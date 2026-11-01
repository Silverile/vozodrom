"""One register scan; write only fleet aggregates, never identifiers or raw rows."""
import pathlib,sys,csv,json,re,copy,time
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8');sys.path.insert(0,'scripts/stats')
from match import Matcher,fold
root=pathlib.Path('analysis/codex/single-generation-pass/batch-8')
before=Matcher();after=copy.deepcopy(before)
aliases=[v for n in ['2000','2200','2500','2600'] for v in ['B'+n,'B '+n]]
after.lines['mazda'].extend((fold(a),'b-series') for a in aliases);after.lines['mazda'].sort(key=lambda x:(-len(x[0]),x[0],x[1]))
after._cache={}
total=Counter();badges=Counter();gens=Counter();origins=Counter();fuel=Counter();unresolved=Counter();start=time.time()
with open('C:/Workspace/Projects/CF/vozodrom-data/rsv/vypisvozidel.csv',encoding='utf-8-sig',newline='',errors='replace') as f:
 for i,row in enumerate(csv.DictReader(f)):
  if i and i%3000000==0:print(i,'rows',round(time.time()-start),'s',flush=True)
  if row['Status']!='PROVOZOVANÉ' or before.make(row['Tovární značka'])!='mazda':continue
  total['mazdaFleet']+=1
  y=row['Rok výroby'];reg=row['Datum 1. registrace'][:4];year=int(y) if y.isdigit() else int(reg) if reg.isdigit() else None
  raw=row['Obchodní označení'];a=before.line('mazda',raw,year);b=after.line('mazda',raw,year)
  if a=='b-series':total['bSeriesBefore']+=1
  if b=='b-series':total['bSeriesAfter']+=1
  if a!=b:
   total['changed']+=1
   if a is None:total['previouslyUnmatched']+=1
   assert a is None and b=='b-series',(a,b)
   badge=re.search(r'\bB\s*(2000|2200|2500|2600)',fold(raw));badges['B'+badge[1] if badge else 'other']+=1
   g=after.generation('mazda',b,year,row['Typ']+' '+raw);gens[str(g)]+=1
   # Only region class survives; no VIN/prefix/row is written.
   vin=row.get('VIN','').strip().upper();origins['North-American WMI' if vin[:1] in '12345' and vin else 'Other/unknown WMI']+=1
   p=row['Palivo'].upper();fuel['diesel' if p.startswith('NM') or 'NAFTA' in p else 'other']+=1
   if g is None:unresolved['missing-year' if year is None else 'overlap-or-code']+=1
out={'status':'complete','rowsScanned':i+1,'aliases':aliases,'totals':dict(total),'newlyMatchedBadges':dict(badges),'newlyMatchedGeneration':dict(gens),'newlyMatchedRegion':dict(origins),'newlyMatchedFuel':dict(fuel),'unresolvedGenerationReasons':dict(unresolved),'privacy':'Aggregates only; no raw rows, identifiers or VIN prefixes retained.'}
(root/'mazda-measurement.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out),flush=True)
