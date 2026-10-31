"""One-source table/prose pass on newly created cards only, paced and resumable."""
import importlib.util,json,os,sys,time
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
ROOT=next((a[7:] for a in sys.argv if a.startswith('--root=')),'analysis/codex/wave-3-missing-cards')
report=r.t.load(ROOT+'/report.json');r.INDEX=r.t.load('src/data/model-cards-index.json')
out=ROOT+'/engine-candidates.json'
prior=r.t.load(out) if os.path.exists(out) else {'generations':[]}
bykey={(x['make'],x['line'],x['generationIndex']):x for x in prior['generations'] if not any('429' in (a.get('error') or '') for a in x.get('attempts',[])) and not (x['make']=='ford' and x['line']=='f-150' and x['generationIndex']>=4 and x.get('ownershipPolicy')!='dedicated-light-duty-article')}
# A resume after materialization must retain successful candidates, even though
# the corresponding public generations now have engines. Saved compact proof
# can restore the candidates if a previous resume omitted those filled rows.
proof_file=ROOT+'/engine-evidence.json'
if os.path.exists(proof_file):
 for proof in r.t.load(proof_file)['rows']:
  make,line=proof['id'].split('/');gi=proof['index'];g=r.INDEX[make][line]['generations'][gi]
  assert proof['engine'] in g.get('engines',[]), 'Saved proof no longer matches public engine'
  key=(make,line,gi)
  row=bykey.setdefault(key,{'make':make,'line':line,'generationIndex':gi,'from':g['from'],'to':g['to'],'sources':g['sources'],'engines':[],'attempts':[]})
  if not any(e['variant']==proof['engine']['variant'] and e['powerKwMin']==proof['engine']['powerKwMin'] for e in row['engines']):
   row['engines'].append({**proof['engine'],'sourceScope':proof['sourceScope']})
  row['resumedFromSavedEvidence']=True
results=[];limited=False
for card in report['added']:
 make,line=card['id'].split('/');c=r.INDEX[make][line]
 for gi,g in enumerate(c['generations']):
  key=(make,line,gi)
  if g.get('engines') or g.get('dateBasis')=='announcement':
   if key in bykey and bykey[key].get('engines'):results.append(bykey[key])
   continue
  item={'make':make,'line':line,'generationIndex':gi,'from':g['from'],'to':g['to'],'sources':g['sources']}
  if key in bykey:result=bykey[key]
  elif limited:result={**item,'engines':[],'attempts':[],'reason':'Deferred after HTTP 429; source absence not established.'}
  else:
   # One verified generation/family source; parser proves each engine's generation.
   url=g['sources'][0]
   if url not in r.t.cache:time.sleep(1.5)
   # Since the tenth generation, these dedicated articles describe the light-duty
   # F-150 family, separately from Super Duty. Earlier mixed F-Series articles
   # retain the strict ownership gate rather than importing heavy-truck engines.
   light_duty=make=='ford' and line=='f-150' and gi>=4 and 'Ford_F-Series_(' in url
   saved_name=c['name']
   if light_duty:c['name']='F-Series'
   try:result=r.research(item,[url],phase='new-card-source-table-or-prose')
   finally:c['name']=saved_name
   if light_duty:result['ownershipPolicy']='dedicated-light-duty-article'
   if any('429' in (a.get('error') or '') for a in result['attempts']):limited=True
  results.append(result)
  print(card['id'],gi,len(result['engines']),flush=True)
  r.t.write(out,{'baselineRevision':report['baselineRevision'],'complete':False,'rateLimited':limited,'generations':results})
r.t.write(out,{'baselineRevision':report['baselineRevision'],'complete':True,'rateLimited':limited,'generations':results})
