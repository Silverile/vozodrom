import fs from 'node:fs';const root='analysis/codex/popular-engines-pass',index=JSON.parse(fs.readFileSync('src/data/model-cards-index.json','utf8')),rows=[];
function add(id,i,url,variants,note=''){const[m,l]=id.split('/'),g=index[m][l].generations[i];for(const[v,fuel,cc,size,kw]of variants)rows.push({id,index:i,engine:{variant:v,fuel,displacementCc:cc,displacementLitresNominal:size,powerKwMin:kw,powerKwMax:kw,availablePowerKw:kw===null?[]:[kw],powerRangeCoverage:'documented-versions-only',sources:[url],sourceScope:{tableSection:'Selected documented European production powertrain',originalVariant:v,noteCs:note||'Doložené jmenovité údaje této verze; bez převodu koní na kW a bez součtu elektrických a spalovacích komponent.',generationEvidence:{method:'generation-heading',anchor:g.code??g.name,fromYear:g.from,toYear:g.to,generationIndex:i,rowFromYear:null,rowToYear:null}}}});}
add('mercedes-benz/gla',2,'https://media.mercedes-benz.com/en/article/22b96b64-a441-4fad-a22a-bc41718aded7',[
 ['GLA 200 electric','electric',null,null,165],['GLA 250+ electric','electric',null,null,200],['GLA 350 4MATIC electric','electric',null,null,260]],'Vlastní startovní elektrické verze nové generace; hybridy plánované později nejsou přeneseny ze staršího GLA.');
add('audi/q7',2,'https://www.audi.com/en/press-releases/third-generation-of-the-successful-suv-new-audi-q7-combines-versatility-and-performance-18004',[
 ['3.0 TDI quattro','diesel-mhev',null,3,180],['3.0 TDI quattro','diesel-mhev',null,3,220]],'Výslovná jmenovitá hodnota motoru 3.0 V6 TDI MHEV plus; elektrických 18 kW se nepřičítá. Přesný objem v cm³ zde nebyl doložen.');
add('bmw/x5',4,'https://www.bmwgroup.com/en/news/general/2026/the-new-bmw-x5.html',[
 ['40 xDrive','petrol-mhev',null,null,294],['40d xDrive','diesel-mhev',null,null,230]],'Vlastní jmenovité výkony nového X5 od sériového náběhu 08/2026. Přesný objem zdroj neuvádí. Pozdější iX5 a PHEV nejsou ztotožněny s aktuálně zahájenými verzemi.');
add('fiat/500',2,'https://www.media.stellantis.com/em-en/fiat/press/olivier-franois-president-of-fiat-brand-presents-the-world-premiere-of-the-new-500-3-1-and-the-entire-new-500-line-up-at-lingotto-turin',[
 ['500 Action','electric',null,null,70],['500 Passion / Icon','electric',null,null,87]]);
add('mitsubishi/eclipse-cross',1,'https://www.mitsubishi-motors.se/mitsubishi-lanserar-nya-eclipse-cross-suv-med-eldrift/',[['Eclipse Cross EV','electric',null,null,160]]);
add('honda/civic',0,'https://de.wikipedia.org/wiki/Honda_Civic_1._Generation',[
 ['1.2 (SB1)','petrol',1170,1.2,40],['1.2 (SB2)','petrol',1237,1.2,44],['1.5 (SF)','petrol',1488,1.5,51]],'Samostatné řádky SB1, SB2 a SF v modelové tabulce. RS a CVCC regionální varianty nepřeneseny.');
add('honda/civic',1,'https://de.wikipedia.org/wiki/Honda_Civic_2._Generation',[
 ['1.3 (SS)','petrol',1335,1.3,44],['1.5 (SS)','petrol',1488,1.5,51]],'Vlastní řádky pětidveřového SS, nikoli hodnoty předchozího Civicu.');
add('honda/civic',5,'https://de.wikipedia.org/wiki/Honda_Civic_6._Generation',[
 ['1.4i','petrol',1396,1.4,55],['1.4i S','petrol',1396,1.4,66],['1.5i LS','petrol',1493,1.5,84],['1.6i LS','petrol',1590,1.6,77],['1.6i SRi','petrol',1590,1.6,92]],'Vlastní evropské řádky EJ9/EK3/EJ6/EJ8. Japonský EK9 Type R a regionální HX/Si/SiR nejsou přeneseny.');
fs.writeFileSync(root+'/curated-main.json',JSON.stringify(rows,null,2)+'\n');console.log({rows:rows.length});
