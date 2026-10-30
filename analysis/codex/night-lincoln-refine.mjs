import fs from 'node:fs';
import {generation,markUnknowns,saveCards} from './night-card-helpers.mjs';
const cs=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/lincoln.json'));
const get=s=>cs.find(c=>c.lineSlug===s),c=get('mkx'),base=c.generations[0];
c.generations=[['MKX I — CD3',2006,2015],['MKX II — CD4 original badge',2015,2018],['Nautilus rename of MKX II — U540',2018,2023],['Nautilus new construction — CDX707',2023,null]].map(([n,f,t])=>generation(n,f,t,[...base.sources,'https://en.wikipedia.org/wiki/Lincoln_Nautilus'],{bodyTypes:['suv'],markets:base.markets,marketNotesCs:base.marketNotesCs,specificationScope:{market:'North America/China, source-production',modelYear:null,variant:null,bodyType:'suv',noteCs:'MKX druhé generace byl modernizován a přejmenován na Nautilus; nejde o dvě nezávislé konstrukce. Nová konstrukce Nautilus se vyrábí od2023; americký modelový rok2024 není rokem zahájení výroby.'}}));
for(const s of ['model-l','model-k','el-series','custom','capri','cosmopolitan','premiere','mark-series','continental','zephyr'])for(const g of get(s).generations)g.bodyTypes=null;
get('continental').generations.at(-1).bodyTypes=['sedan'];
for(const s of ['model-k','el-series']){const g=get(s).generations[0];g.from=null;g.to=null;g.productionStatus='unknown';g.specificationScope.noteCs='Přehled a historie uvádějí uvedení řady a modelové roky, ale přesné kalendářní hranice výroby nebyly ověřeny. Tyto údaje nejsou bez dalšího vydávány za výrobní období.';}
for(const c of cs){c.sources=[...new Set([...c.sources,...c.generations.flatMap(g=>g.sources)])];c.needsReview=[];markUnknowns(c);}saveCards('lincoln',cs);
