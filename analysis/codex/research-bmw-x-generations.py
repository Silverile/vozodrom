import concurrent.futures,importlib.util,json,os,subprocess,sys,re
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
OUT='analysis/codex/second-source-engines/bmw-x';os.makedirs(OUT,exist_ok=True)
DEFS={'x5':[('E53',1999,2006,2003),('E70',2006,2013,2010),('F15',2013,2018,None),('G05',2018,2026,2023),('G65',2026,None,None)],'x3':[('E83',2003,2010,2006),('F25',2010,2017,2014),('G01',2017,2024,2021),('G45',2024,None,None)]}
def research(task):
 line,i,definition=task;code,start,end,facelift=definition;url='https://de.wikipedia.org/wiki/BMW_'+code
 card={'name':line.upper(),'generations':[{'name':f'{line.upper()} ({c})','code':c,'from':a,'to':b} for c,a,b,f in DEFS[line]]}
 tree,canonical,error=r.t.fetch(url);assert tree is not None,(url,error)
 paragraphs=[r.t.clean(p.text_content()) for p in tree.xpath('//p|//li|//h2|//h3') if re.search(r'Modellpflege|Facelift|Serienproduktion|Serienfertigung|Produktionsstart',p.text_content(),re.I)]
 text=r.t.clean(tree.text_content());nearby=bool(facelift and re.search(r'(?:Modellpflege|Facelift).{0,400}'+str(facelift)+'|'+str(facelift)+r'.{0,400}(?:Modellpflege|Facelift)',text,re.I))
 if facelift:assert nearby or any(str(facelift) in p for p in paragraphs),(code,'Missing facelift source evidence')
 rows=[e for gi,e in r.page_rows(tree,canonical,card) if gi==i and not re.search(r'X[35]\s*M(?!\d)|Competition|Alpina',e['variant'],re.I)]
 rows=[e for e in rows if e.get('displacementCc') or e.get('displacementLitresNominal') or e['fuel']=='electric']
 return {'line':line,'index':i,'code':code,'from':start,'to':end,'facelift':facelift,'sources':[canonical], 'engineCandidates':rows,'sourceEvidence':{'title':r.t.clean(tree.xpath('string(//h1)')),'productionRows':[r.t.clean(x.text_content()) for x in tree.xpath('(//table)[1]//tr') if re.match('Produktionszeitraum',r.t.clean(x.text_content()))],'faceliftYearFound':bool(facelift and (nearby or any(str(facelift) in p for p in paragraphs)))}}
tasks=[(line,i,g) for line,gs in DEFS.items() for i,g in enumerate(gs)]
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:results=list(pool.map(research,tasks))
r.t.write(OUT+'/research.json',{'baselineRevision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'generations':results,'newX5Source':'https://www.bmwgroup.com/en/news/general/2026/the-new-bmw-x5.html','g65ProductionSource':'https://en.wikipedia.org/wiki/BMW_X5_(G65)'})
print(json.dumps([{'line':g['line'],'code':g['code'],'engineCandidates':len(g['engineCandidates']),'evidence':g['sourceEvidence']} for g in results],ensure_ascii=False))
