"""Sourced production families for the wave-2 broad-card migration; facts only."""
import importlib.util,os,re,subprocess
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
ROOT='analysis/codex/second-source-engines/families-8';os.makedirs(ROOT,exist_ok=True)
PALIO='https://en.wikipedia.org/wiki/Fiat_Palio';ESC='https://en.wikipedia.org/wiki/Cadillac_Escalade';ESCDE='https://de.wikipedia.org/wiki/Cadillac_Escalade';IX='https://en.wikipedia.org/wiki/BMW_iX3';G08='https://de.wikipedia.org/wiki/BMW_G01'
pages={}
for url in [PALIO,ESC,ESCDE,IX,G08]:
    tree,canonical,error=r.t.fetch(url);assert tree is not None,(url,error);pages[url]=r.t.clean(tree.text_content())
def gen(make,line,code,start,end,bodies,sources,**extra):return {'make':make,'line':line,'code':code,'from':start,'to':end,'bodyTypes':bodies,'sources':sources,'facelifts':[],'newEngines':[],**extra}
defs=[
 gen('fiat','palio','178',1996,2020,['hatchback','kombi'],[PALIO],markets=['Europe','South America'],facelifts=[2000,2004,2007],note='Hatchback 1996–2016; Weekend 1997–2020. Modernizace a nabídka se lišily podle trhu.'),
 gen('fiat','palio','326',2011,2018,['hatchback'],[PALIO],markets=['Brazil','Argentina'],note='Druhá generace pro Brazílii a Argentinu; nejde o evropský Palio Weekend. Bez přiřazení evropských motorizací.'),
 gen('cadillac','escalade','GMT400',1998,2000,['suv'],[ESC]),
 gen('cadillac','escalade','GMT800',2001,2006,['suv','pickup'],[ESC],note='ESV od roku 2002; EXT 2001–2006. Roky jsou výroba, nikoli modelový rok 2002.'),
 gen('cadillac','escalade','GMT900',2006,2014,['suv','pickup'],[ESC],note='EXT skončil 2013; SUV pokračovalo do 2014. Hybrid 2008–2013.'),
 gen('cadillac','escalade','GMTK2XX',2014,2019,['suv'],[ESC,ESCDE],note='Sériová výroba leden 2014 až prosinec 2019; modelové roky 2015–2020.'),
 gen('cadillac','escalade','GMTT1XX',2020,None,['suv'],[ESC,ESCDE],note='Sériová výroba od září 2020; první modelový rok 2021. ESV je prodloužená karoserie stejné generace.'),
 gen('bmw','ix3','G08',2020,2025,['suv'],[G08],markets=['Europe'],facelifts=[2021],note='Výroba od 2020; evropské uvedení 2021. Modernizované provedení do června 2025.'),
 gen('bmw','ix3','NA5',2025,None,['suv'],[IX],markets=['Europe'],note='Sériová výroba od října 2025. Prodloužené čínské NA6 není samostatná evropská generace.'),
]
for make,line in [('fiat','palio'),('cadillac','escalade'),('bmw','ix3')]:
    for i,d in enumerate(x for x in defs if x['make']==make and x['line']==line):d['index']=i
def engine(d,variant,kw,litres,fuel,url,anchor=None,source_from=None,source_to=None,power_basis='explicit source kW; not converted'):
    # Every manually selected kW value must literally occur in the fetched source.
    assert re.search(r'(?<!\d)'+str(kw)+r'\s*kW\b',pages[url]),(variant,kw,url)
    ev={'method':'generation-heading','anchor':anchor or f"{d['line']} {d['code']} ({d['from']}–{d['to'] or 'present'})",'fromYear':d['from'] if source_from is None else source_from,'toYear':d['to'] if source_to is None else source_to,'generationIndex':d['index'],'rowFromYear':None,'rowToYear':None}
    d['newEngines'].append({'variant':variant,'fuel':fuel,'displacementCc':None,'displacementLitresNominal':litres,'powerKwMin':kw,'powerKwMax':kw,'availablePowerKw':[kw],'powerRangeCoverage':'documented-versions-only','sources':[url],'sourceScope':{'tableSection':ev['anchor'],'variantYears':None,'originalVariant':variant,'powerBasis':power_basis,'generationEvidence':ev}})
es=[d for d in defs if d['make']=='cadillac']
engine(es[0],'5.7 V8',190,5.7,'petrol',ESC)
for name,kw,litres in [('5.3 V8',213,5.3),('5.3 V8',220,5.3),('6.0 V8',257,6.0)]:engine(es[1],name,kw,litres,'petrol',ESC)
engine(es[2],'6.2 V8',301,6.2,'petrol',ESC)
engine(es[2],'6.0 V8 Hybrid',283,6.0,'petrol-hev',ESC,power_basis='explicit combined 283 kW; not ICE-only 248 kW or a sum of motors')
engine(es[3],'6.2 V8',313,6.2,'petrol',ESCDE,anchor='Escalade GMTK2XL (2014–2020)',source_from=2014,source_to=2020)
engine(es[4],'6.2 V8',313,6.2,'petrol',ESCDE)
engine(es[4],'3.0 Duramax',207,3.0,'diesel',ESCDE)
engine(defs[-1],'50 xDrive',345,None,'electric',IX,anchor='BMW iX3 NA5 (2025–present)')
r.t.write(ROOT+'/research.json',{'baselineRevision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'definitions':defs,'existingEngineAssignments':{'fiat/palio':0,'cadillac/escalade':4,'bmw/ix3':0},'sources':[{'url':u,'retrieved':'2026-10-31'} for u in pages],'notes':['Palio 178 end includes Weekend 2020; source hatchback end is 2016.','Palio 326 requires explicit type code for statistics; a year-only overlap must not absorb European Weekend cars.','Escalade existing 306 kW engine is a 2021–2022 GMTT1XX version, not GMT900.','Escalade facelift model year 2025 is left for a production-stage date follow-up.']})
print('Sourced',len(defs),'generations and',sum(len(d['newEngines']) for d in defs),'new engine facts')
