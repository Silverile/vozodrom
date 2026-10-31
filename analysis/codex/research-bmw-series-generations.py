import concurrent.futures,importlib.util,os,re,subprocess,sys
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
OUT='analysis/codex/second-source-engines/bmw-series';os.makedirs(OUT,exist_ok=True)
DEFS={
 'z4':[('E85/E86','E85',2002,2008,[2006],['kupe','kabriolet']),('E89','E89',2009,2016,[2013],['kabriolet']),('G29','G29',2018,2026,[2022],['kabriolet'])],
 'rada-6':[('E24','E24',1976,1989,[1982,1987],['kupe']),('E63/E64','E63',2003,2010,[2007],['kupe','kabriolet']),('F12/F13/F06','F12',2011,2018,[2015],['kupe','kabriolet'])],
 'rada-6-gran-turismo':[('G32','G32',2017,2023,[2020],['hatchback'])],
 'rada-2':[('F22/F23','F22',2013,2021,[2017],['kupe','kabriolet']),('G42','G42',2021,None,[],['kupe'])],
}
EXTRA={
 'E24':['https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-12-0.bmw-6-series-e24.html'],
 'G29':['https://www.press.bmwgroup.com/united-kingdom/article/detail/T0404076EN_GB/the-updated-bmw-z4?language=en_GB','https://www.press.bmwgroup.com/usa/article/detail/T0454065EN_US/the-bmw-z4-final-edition'],
 'G32':['https://www.press.bmwgroup.com/global/article/detail/T0308711EN/the-new-bmw-6-series-gran-turismo?language=en'],
 'F22':['https://newsroom.bmwgroup.com/global/anniversary-20-years-of-series-production-at-bmw-group-plant-leipzig/'],
}
def research(task):
 line,i,d=task;code,article,start,end,facelifts,bodies=d;url='https://de.wikipedia.org/wiki/BMW_'+article
 tree,canonical,error=r.t.fetch(url);assert tree is not None,(url,error)
 card={'name':line,'generations':[{'name':c,'code':c,'from':a,'to':b} for c,ar,a,b,f,bo in DEFS[line]]}
 rows=[e for gi,e in r.page_rows(tree,canonical,card) if gi==i and not re.search(r'\bM[26]\b|Alpina|Schnitzer',e['variant'],re.I)]
 rows=[e for e in rows if e.get('displacementCc') or e.get('displacementLitresNominal') or e['fuel']=='electric']
 if article=='G32':rows=[e for e in rows if (r.t.year_span(e['sourceScope'].get('variantYears') or '') or [9999])[0]<2020] # pre-MHEV launch variants only
 return {'line':line,'index':i,'code':code,'from':start,'to':end,'facelifts':facelifts,'bodyTypes':bodies,'sources':[canonical,*EXTRA.get(article,[])],'engineCandidates':rows,'evidence':{'title':r.t.clean(tree.xpath('string(//h1)')),'production':[r.t.clean(x.text_content()) for x in tree.xpath('(//table)[1]//tr') if re.match('Produktionszeitraum',r.t.clean(x.text_content()))]}}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:results=list(pool.map(research,[(line,i,d) for line,gs in DEFS.items() for i,d in enumerate(gs)]))
r.t.write(OUT+'/research.json',{'baselineRevision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'generations':results,'decision':'G32 completed on existing rada-6-gran-turismo line; not duplicated in the coupe/cabriolet line. Active/Gran Tourer remain separate.'})
print([(r['line'],r['code'],len(r['engineCandidates'])) for r in results])
