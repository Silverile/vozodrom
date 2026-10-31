"""One-source table/prose pass on newly created cards only, paced and resumable."""
import importlib.util,json,os,time
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
ROOT='analysis/codex/wave-3-missing-cards'
report=r.t.load(ROOT+'/report.json');r.INDEX=r.t.load('src/data/model-cards-index.json')
out=ROOT+'/engine-candidates.json'
prior=r.t.load(out) if os.path.exists(out) else {'generations':[]}
bykey={(x['make'],x['line'],x['generationIndex']):x for x in prior['generations'] if not any('429' in (a.get('error') or '') for a in x.get('attempts',[]))}
results=[];limited=False
for card in report['added']:
 make,line=card['id'].split('/');c=r.INDEX[make][line]
 for gi,g in enumerate(c['generations']):
  if g.get('engines') or g.get('dateBasis')=='announcement':continue
  item={'make':make,'line':line,'generationIndex':gi,'from':g['from'],'to':g['to'],'sources':g['sources']}
  key=(make,line,gi)
  if key in bykey:result=bykey[key]
  elif limited:result={**item,'engines':[],'attempts':[],'reason':'Deferred after HTTP 429; source absence not established.'}
  else:
   # One verified generation/family source; parser proves each engine's generation.
   url=g['sources'][0]
   if url not in r.t.cache:time.sleep(1.5)
   result=r.research(item,[url],phase='new-card-source-table-or-prose')
   if any('429' in (a.get('error') or '') for a in result['attempts']):limited=True
  results.append(result)
  print(card['id'],gi,len(result['engines']),flush=True)
  r.t.write(out,{'baselineRevision':report['baselineRevision'],'complete':False,'rateLimited':limited,'generations':results})
r.t.write(out,{'baselineRevision':report['baselineRevision'],'complete':True,'rateLimited':limited,'generations':results})
