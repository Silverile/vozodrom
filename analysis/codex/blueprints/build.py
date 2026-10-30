"""Build local-only paired data from crawl.mjs index, using CPU OpenCV only."""
import argparse,collections,hashlib,json,os,random,sys,time
from pathlib import Path
import cv2
import numpy as np
from extract import find_side_view,infer_orientation,normalize,Reject

REPO=Path(__file__).resolve().parents[3]
DEFAULT=REPO.parent/'vozodrom-data'/'blueprints'

def external_root(value):
    root=Path(value).resolve()
    if root==REPO or REPO in root.parents:
        raise ValueError('Dataset output must stay outside the repository')
    return root

def digest(data):return hashlib.sha256(data).hexdigest()

def atomic_json(path,value):
    tmp=path.with_suffix(path.suffix+'.tmp');tmp.write_text(json.dumps(value,indent=2,ensure_ascii=False),encoding='utf-8');os.replace(tmp,path)

def load_index(root):
    rows=[];partial=0
    for i,line in enumerate((root/'index.jsonl').read_text(encoding='utf-8').splitlines()):
        if not line.strip():continue
        try:rows.append(json.loads(line))
        except json.JSONDecodeError:partial+=1
    return rows,partial

def make_split(rows):
    makes=sorted({r['make'] for r in rows},key=lambda m:digest(m.encode()))
    count=max(1,round(.2*len(makes))) if len(makes)>1 else 0
    val=set(makes[:count]);return {m:('val' if m in val else 'train')for m in makes}

def preview(rows,root):
    chosen=random.Random(42).sample(rows,min(40,len(rows)))
    if not chosen:return
    # 4 pairs across, 10 down, stored locally; never emitted to a chat/browser.
    thumb_w,thumb_h=256,128
    canvas=np.zeros((((len(chosen)+3)//4)*thumb_h,4*thumb_w*2,3),np.uint8)
    for i,row in enumerate(chosen):
        source=cv2.imread(str(root/row['input']));target=cv2.imread(str(root/row['target']))
        if source is None or target is None:continue
        pair=np.concatenate([cv2.resize(source,(thumb_w,thumb_h)),cv2.resize(target,(thumb_w,thumb_h))],axis=1)
        y=(i//4)*thumb_h;x=(i%4)*thumb_w*2;canvas[y:y+thumb_h,x:x+thumb_w*2]=pair
    if not cv2.imwrite(str(root/'preview.jpg'),canvas):raise OSError('preview write failed')

def write_report(root,rows,reasons,raw_count,invalid_lines,started):
    split=make_split(rows);counts=collections.Counter(split[r['make']]for r in rows)
    text=['# Local-only blueprint dataset','',f'Updated UTC: {time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime())}',f'Indexed originals: {raw_count}',f'Accepted pairs: {len(rows)}',f'Train pairs: {counts["train"]}; validation pairs: {counts["val"]}',f'Invalid/partial index lines ignored: {invalid_lines}',f'Elapsed build seconds: {time.monotonic()-started:.1f}','', '## Skip reasons','']
    text += [f'- {k}: {v}'for k,v in sorted(reasons.items())]
    text += ['', '## Make split','', *[f'- {m}: {s}'for m,s in sorted(split.items())], '', '## Known limitations','', '- Side-view detection is conservative; disconnected outlines, grid joins and unusual sheet layouts may be rejected.', '- Near-black threshold suppresses pale watermarks but may also lose faint legitimate strokes.', '- Dimension/text removal uses the silhouette support; labels intersecting the car can remain.', '- Inferred orientation is an uncalibrated shape heuristic. By default it is flagged for review rather than accepted; supply explicit orientation annotations.', '- Wheel circles can select trim rings; inspect accepted samples before training.', '- No real-source extraction accuracy is certified by synthetic tests.', '- Everything here, including preview, targets and inputs, is local training data; never commit, publish, trace or serve it.']
    (root/'REPORT.md').write_text('\n'.join(text)+'\n',encoding='utf-8')
    return split

def build(args):
    started=time.monotonic();root=external_root(args.data_dir)
    if not(root/'index.jsonl').exists():raise ValueError('Missing external index.jsonl; crawl first')
    lock=root/'.build.lock'
    with lock.open('x',encoding='utf-8')as f:f.write(str(os.getpid()))
    rows=[];reasons=collections.Counter();seen_raw=set();seen_target=set();status=[]
    try:
        for d in ['inputs','targets']: (root/d).mkdir(exist_ok=True)
        source_rows,invalid=load_index(root)
        annotations=json.loads(Path(args.orientations).read_text(encoding='utf-8-sig'))if args.orientations else {}
        config=digest((Path(__file__).with_name('extract.py').read_text(encoding='utf-8-sig')+str(args.threshold)+str(args.accept_inferred_orientation)+json.dumps(annotations,sort_keys=True)).encode())
        previous={}
        previous_skips={}
        if(root/'processing-log.jsonl').exists():
            for line in(root/'processing-log.jsonl').read_text(encoding='utf-8').splitlines():
                if line.strip():
                    log=json.loads(line)
                    if log.get('permanent')and log.get('config')==config:
                        previous_skips.setdefault(log['id'],log)
        if(root/'pairs.jsonl').exists():
            for line in(root/'pairs.jsonl').read_text(encoding='utf-8').splitlines():
                if line.strip():
                    r=json.loads(line);previous[r['id']]=r
        for source in source_rows:
            if time.monotonic()-started>args.max_minutes*60:reasons['checkpoint-deadline']+=1;break
            identity=source.get('sha256','');record={'id':identity,'sourcePage':source.get('sourcePage'),'config':config}
            try:
                file=(root/source['file']).resolve()
                if(root/'raw').resolve()not in file.parents:raise Reject('unsafe-raw-path')
                raw=file.read_bytes()
                if digest(raw)!=identity:raise Reject('raw-hash-mismatch')
                if identity in seen_raw:raise Reject('duplicate-raw-sha256')
                seen_raw.add(identity)
                if identity in previous_skips:
                    old_skip=previous_skips[identity];reasons[old_skip['reason']]+=1;status.append(old_skip);continue
                old=previous.get(identity)
                if old and old.get('config')==config and(root/old['input']).is_file()and(root/old['target']).is_file():
                    if old['targetSha256']in seen_target:raise Reject('duplicate-target-sha256')
                    seen_target.add(old['targetSha256']);rows.append(old);continue
                image=cv2.imdecode(np.frombuffer(raw,np.uint8),cv2.IMREAD_COLOR)
                if image is None:raise Reject('decode-failed')
                side=find_side_view(image,args.threshold)
                orientation=annotations.get(identity)or annotations.get(source.get('url',''))
                method='annotation'
                if orientation is None:
                    guess=infer_orientation(side);method='shape-heuristic'
                    if not args.accept_inferred_orientation:
                        record.update(orientationCandidate=guess,sideBox=list(side.box));raise Reject('orientation-needs-review'if guess else'orientation-unknown')
                    orientation=guess
                x,y,wheels=normalize(side,orientation)
                target_hash=digest(y.tobytes())
                if target_hash in seen_target:raise Reject('duplicate-target-sha256')
                ident=identity[:24];input_path=f'inputs/{ident}.png';target_path=f'targets/{ident}.png'
                if not cv2.imwrite(str(root/input_path),cv2.cvtColor(x,cv2.COLOR_RGB2BGR)):raise OSError('input write failed')
                if not cv2.imwrite(str(root/target_path),y):raise OSError('target write failed')
                seen_target.add(target_hash)
                rows.append({'id':identity,'make':source['make'].strip().lower(),'model':source['model'],'sourcePage':source.get('sourcePage'),'input':input_path,'target':target_path,'targetSha256':target_hash,'orientation':orientation,'orientationMethod':method,'sideBox':list(side.box),'wheels':wheels,'config':config,'shape':[256,512],'channels':['silhouette','wheels','outer-edge']})
                record['status']='accepted'
            except(Reject,KeyError,OSError,cv2.error)as e:
                reason='opencv-decode-or-geometry-error'if isinstance(e,cv2.error)else str(e)
                reasons[reason]+=1;record.update(status='skipped',reason=reason,permanent=isinstance(e,(Reject,cv2.error))and reason!='duplicate-raw-sha256')
            status.append(record)
        split=write_report(root,rows,reasons,len(source_rows),invalid,started)
        for r in rows:r['split']=split[r['make']]
        atomic_json(root/'splits.json',split)
        for name,selection in [('pairs',rows),('train',[r for r in rows if r['split']=='train']),('val',[r for r in rows if r['split']=='val']),('processing-log',status)]:
            temp=root/(name+'.jsonl.tmp');temp.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n'for r in selection),encoding='utf-8');os.replace(temp,root/(name+'.jsonl'))
        preview(rows,root)
        print(json.dumps({'raw':len(source_rows),'pairs':len(rows),'skips':dict(reasons),'makes':len(split)}))
    finally:lock.unlink()

def main():
    p=argparse.ArgumentParser();p.add_argument('--data-dir',default=str(DEFAULT));p.add_argument('--threshold',type=int,default=110);p.add_argument('--orientations');p.add_argument('--accept-inferred-orientation',action='store_true');p.add_argument('--max-minutes',type=float,default=18);a=p.parse_args()
    if not 30<=a.threshold<=180 or not 0<a.max_minutes<=20:p.error('threshold 30..180, max-minutes >0..20')
    build(a)
if __name__=='__main__':main()
