"""No network: explicit conflicting chassis must not fall back to nearby years."""
import importlib.util,json,pathlib,sys
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('spec','analysis/codex/spec-site-engines.py');spec=importlib.util.module_from_spec(s);s.loader.exec_module(spec)
cases=[
 ({'code':'U12','from':1987,'to':1992},'Nissan Bluebird T12',(1986,1991),False),
 ({'code':'U12','from':1987,'to':1992},'Nissan Bluebird U12',(1987,1992),True),
 ({'code':'C167','from':2019,'to':None},'V167 GLE - 2019 New Model',(2018,2023),False),
 ({'code':'C167','from':2019,'to':None},'C167 GLE Coupe',(2019,2023),True),
 ({'code':'W907 / W910','from':2018,'to':None},'VS30 Sprinter (BR 907 / 910)',(2018,None),True),
 ({'code':'C140','from':1992,'to':1998},'W140 S-Class',(1991,1998),False),
 ({'code':'Classic B-body','from':1966,'to':1978},'Charger 2nd Gen. B-body',(1967,1968),True)
]
for g,title,years,want in cases:assert spec.generation_fit(g,title,years)==want,(g,title,years,want)
result={'result':'PASS','cases':len(cases),'explicitChassisBeatsNearbyYears':True,'numberedSprinterAliasRetained':True}
pathlib.Path('analysis/codex/popular-engines-pass/batch-3/chassis-research-validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8');print(result)
