import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/rare-engines-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),q=read(root+'/zero-market-queue.json');
// Cheap prioritisation screen requested by the user: no engine extraction and no new
// claim that every rejected/import-only model was never available anywhere in Europe.
// Engine admission still requires the existing generation/market/source checks.
const europeanMakes=new Set('iveco alfa-romeo porsche mini jaguar lancia maserati aro ds-automobiles bentley aixam lamborghini ligier aston-martin microcar daimler-company alpina lotus santana-motor ariel alpine polestar jensen-motors morgan innocenti abarth ac-cars artega autobianchi automobili-pininfarina bac bellier bertone brabus bristol-cars bugatti-automobiles casalini de-tomaso e-go-mobile estrima fsm fso ginetta koenigsegg maybach noble pagani'.split(' '));
// Named export lines, not a transfer of eligibility from a European rebadge or sibling.
const named={
 honda:['crx-del-sol','nsx','s2000'],suzuki:['carry/7','carry/9'],lada:['granta','kalina','priora'],mazda:['2-hybrid'],nissan:['350-z','370-z','nv250'],
 chevrolet:['alero','beretta','corsica','volt/0'],mg:['gs','mg5/2','rv8','xpower-sv','zs-2001','express'],
 lexus:['es/7','lc','lm/1','nx','rx'],daewoo:['evanda','honker','lacetti','lublin'],daihatsu:['copen/0'],isuzu:['piazza/0'],
 byd:['han','tang','seal-5'],cadillac:['lyriq'],infiniti:['q60','q70'],maxus:['eterron-9-terron-9','mifa-9','t70'],
 lynkCoPlaceholder:[],geely:['ex5'],voyah:['courage-zhiyin'],fisker:['ocean'],'fisker-automotive':['karma'],
 mahindra:['kuv100','scorpio-pik-up-goa-pik-up-getaway','xuv500'],proton:['suprima-s'],
 'lynk-co':['02-ev'],'nio':['es8/0','es8/1','et5-touring'],'ora':['03','07'],perodua:['kembara'],
 brilliance:['bs4','bs6'],borgward:['bx7'],moskvic:['2141/0']
};
delete named.lynkCoPlaceholder;
const overrides={
 'mclaren/sabre/0':'US-only homologation branch; European marque does not admit this model.',
 'ds-automobiles/ds-5ls/0':'Separate regional DS 5LS, not European DS5.',
 'ds-automobiles/ds-6/0':'Separate regional DS6; European marque alone is insufficient.',
 'skoda/kamiq-china/0':'Explicit China-only branch, not European Kamiq.',
 'skoda/rapid-india/0':'Explicit India branch, not European Rapid.',
 'renault/logan-renault-badged-non-eu/1':'Explicit non-EU badge branch; Dacia eligibility is not transferred.',
 'fiat/argo/0':'Regional South American line; not admitted by Fiat origin.',
 'fiat/cronos/0':'Regional South American line; not admitted by Fiat origin.',
 'fiat/toro/0':'Regional South American line; not admitted by Fiat origin.',
 'ford/maverick/0':'2021 pickup branch, not the earlier European Maverick SUVs.',
 'dacia/striker/0':'Actual series-production timing still requires confirmation; not admitted from future/launch metadata alone.'
};
const pass=[],held=[],byMake={};
for(const r of q.pending){const id=r.make+'/'+r.line,key=id+'/'+r.index,allow=(named[r.make]??[]).some(x=>x===r.line||x===r.line+'/'+r.index),reason=overrides[key];let outcome;
 if(reason)outcome={...r,filterStatus:'held',filterBasis:'explicit-regional-or-production-exception',filterReason:reason};
 else if(europeanMakes.has(r.make)||allow)outcome={...r,filterStatus:'pass-for-engine-source-review',filterBasis:europeanMakes.has(r.make)?'European-or-UK-marque-screen':'named-European-market-line-screen',filterReason:'Passed the cheap market priority screen; individual engine facts and generation identity still require their own sources.'};
 else outcome={...r,filterStatus:'held',filterBasis:'no-positive-European-screen-rule',filterReason:'European availability of this exact badge/generation was not established by the cheap screen. Regional/private imports and European rebadges do not automatically qualify. This is not a claim of proven absence from Europe.'};
 (outcome.filterStatus==='held'?held:pass).push(outcome);const b=byMake[r.make]??={make:r.make,makeMatchedFleet:r.makeMatchedFleet,total:0,pass:0,held:0};b.total++;b[outcome.filterStatus==='held'?'held':'pass']++;
}
assert.equal(pass.length+held.length,1218);assert.equal(new Set([...pass,...held].map(r=>r.make+'/'+r.line+'/'+r.index)).size,1218);
const makes=Object.values(byMake).sort((a,b)=>b.makeMatchedFleet-a.makeMatchedFleet||a.make.localeCompare(b.make));
const result={rules:{kind:'cheap conservative market-priority screen, not a full market-history verification',period:q.periodRule,ranking:q.ranking,engineAdmission:'A screening pass authorises source research, not automatic engine publication. Generation/badge/European specification must still be checked.',held:'Not positively admitted; not proof that a car was never imported/sold in Europe.',undated:'679 undated records excluded from this operation.'},counts:{pendingScreened:1218,pass:pass.length,held:held.length,makesPassing:makes.filter(m=>m.pass).length,previouslyMarketReviewed:20,undatedUntouched:679},byMake:makes,pass,held};write(root+'/market-filter.json',result);
fs.writeFileSync(root+'/market-filter-report.md',[`Дешёвый фильтр рынка: все 1218 записей распределены. Допущено к исследованию моторов ${pass.length}, отложено ${held.length}; марок с допущенными записями ${result.counts.makesPassing}.`, '', 'Это фильтр приоритета, а не новая проверка истории продаж каждого автомобиля. Марки ЕС/Великобритании допускаются с исключением явных региональных ветвей; для прочих марок используется список европейских модельных линий. Данные конкретных моторов по-прежнему требуют собственных источников. Отложено не означает «никогда не продавалось в Европе». 679 недатированных записей не затронуты.', '', '| Марка | Допущено | Отложено |', '|---|---:|---:|',...makes.map(m=>`| ${m.make} | ${m.pass} | ${m.held} |`)].join('\n')+'\n');console.log(result.counts);console.log(makes.filter(m=>m.pass).map(m=>m.make+': '+m.pass).join(', '));
