import importlib.util,concurrent.futures,json,pathlib
spec=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass')
items=[('E23',1977,1986),('E32',1986,1994),('E38',1994,2001),('E65',2001,2008),('F01',2008,2015),('G11',2015,2022),('G70',2022,None)]
card={'name':'Řada 7','generations':[{'code':c,'from':f,'to':t} for c,f,t in items]}
def work(item):
 code,_,_=item;url='https://en.wikipedia.org/wiki/BMW_7_Series_('+code+')';tree,canonical,error=e.fetch(url)
 rows=[];facts=[];prose=[]
 if tree is not None:
  for x in tree.xpath('//style|//script'):x.drop_tree()
  rows=[{'generation':i,'engine':r} for i,r in e.page_rows(tree,url,card)]
  for tr in tree.xpath('//table[contains(@class,"infobox")][1]//tr'):
   cells=tr.xpath('./th|./td')
   if cells and e.clean(cells[0].text_content()) in ['Production','Body style']:facts.append(e.clean(tr.text_content()))
  for p in tree.xpath('//p'):
   txt=e.clean(p.text_content())
   if any(x in txt.lower() for x in ['facelift','produced','production','g73']):prose.append(txt)
 return {'code':code,'url':url,'error':error,'facts':facts,'prose':prose,'rows':rows}
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(work,items));e.write(str(root/'bmw7-research.json'),results)
for r in results:print(r['code'],r['error'],r['facts'],len(r['rows']),flush=True)

