"""Evaluate fit_wheels independently of the drawing script.

Manifest paths are relative to this file. Source image + segmentation mask use
exactly lineart.py's crop (8% lower margin), flip and resize. Set --width 900 or
1000; ground truth is always measured in a 900px crop. Ground-truth labels are
never passed to fit_wheels. Approximate masks do NOT certify the original labels.
"""
import argparse,json,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'deps'))
import cv2,numpy as np
from wheels import fit_wheels

def crop_image(img,mask,width=900,flip=False):
    if flip: img=cv2.flip(img,1);mask=cv2.flip(mask,1)
    if not np.any(mask): raise ValueError('empty mask')
    x,y,w,h=cv2.boundingRect(mask)
    y2=min(img.shape[0],y+h+int(.08*w))
    size=(width,int((y2-y)*width/w))
    return cv2.resize(img[y:y2,x:x+w],size,interpolation=cv2.INTER_AREA),cv2.resize(mask[y:y2,x:x+w],size,interpolation=cv2.INTER_NEAREST),(x,y,w,y2-y)

def main():
    p=argparse.ArgumentParser();p.add_argument('--manifest',default='cases.json');p.add_argument('--width',type=int,default=900);p.add_argument('--output',default='results.json');p.add_argument('--baseline',action='store_true');a=p.parse_args()
    cases=json.loads((ROOT/a.manifest).read_text(encoding='utf-8-sig'));results=[]
    for case in cases:
        img=cv2.imread(str(ROOT/case['image']));mask=cv2.imread(str(ROOT/case['mask']),0)
        if img is None or mask is None: raise ValueError('unreadable image/mask: '+case['id'])
        im,ma,box=crop_image(img,mask,a.width,case.get('flip',False));start=time.perf_counter()
        try:
            if a.baseline:
                from baseline import fit_wheels_baseline
                fitter=fit_wheels_baseline
            else:fitter=fit_wheels
            found=fitter(im,ma,a.width,case.get('length_mm'),case.get('wheelbase_mm'),case.get('tyre_mm'))
            normalized=np.array(found)*900/a.width
            record={'id':case['id'],'wheels900':normalized.tolist(),'seconds':time.perf_counter()-start,'crop':box,'maskProvenance':case.get('maskProvenance'),'labelProvenance':case.get('labelProvenance')}
            if case.get('truth900'):
                truth=np.array(case['truth900']);ce=np.linalg.norm(normalized[:,:2]-truth[:,:2],axis=1)/truth[:,2];re=np.abs(normalized[:,2]-truth[:,2])/truth[:,2]
                record.update(centerErrorRadiusFraction=ce.tolist(),radiusErrorFraction=re.tolist(),withinTolerance=bool(np.all(ce<=.04)&np.all(re<=.08)),certified=case.get('exactReferenceCrop',False))
            debug=im.copy()
            for x,y,r in found: cv2.circle(debug,(round(x),round(y)),round(r),(0,0,255),2);cv2.drawMarker(debug,(round(x),round(y)),(0,0,255),cv2.MARKER_CROSS,10,1)
            if case.get('truth900'):
                for x,y,r in np.array(case['truth900'])*a.width/900:cv2.circle(debug,(round(x),round(y)),round(r),(0,255,0),1)
            cv2.imwrite(str(ROOT/f'{case["id"]}{"-baseline" if a.baseline else ""}-overlay.jpg'),debug)
        except ValueError as e:record={'id':case['id'],'error':str(e),'seconds':time.perf_counter()-start}
        results.append(record);print(json.dumps(record),flush=True)
    (ROOT/a.output).write_text(json.dumps(results,indent=2),encoding='utf-8')
if __name__=='__main__':main()
