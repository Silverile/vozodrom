export function normalizeVariant(value){
 if(typeof value!=='string')return value;
 let v=value.replace(/\[[^\]]*\]/g,'').replace(/\s+/g,' ').trim();
 if(!/^(?:\d+\.\d+|[A-Za-z]{1,4}\d{2,4}\.\d{2,4})$/.test(v)&&!/\s\d[.,]\d{1,2}$/.test(v))v=v.replace(/\.\d{1,2}$/,'');
 v=v.replace(/^(?:(?:Benzin|Diesel|Petrol|Gasoline|Otto)(?:motor(?:en)?| engines?)?)[\s:–-]+/i,'');
 v=v.replace(/\s*\((?:petrol|diesel|gasoline|benzin)\)/ig,'').replace(/\s+[-–]\s+(?:Van\b|Saloon\b|Estate\b|Hatchback\b|Sedan\b|\d{2}\/\d{2}).*$/i,'');
 v=v.replace(/\binline[- ](?:four|six|three)\b/ig,'').replace(/\s+/g,' ').replace(/^[ ,;\-]+|[ ,;\-]+$/g,'');
 return /^(?:motor(?:en)?|engine(?:s)?|benzin|diesel|petrol|gasoline|ottomotor(?:en)?|unnamed(?::.*)?)$/i.test(v)?null:v||null;
}
export const powerValues=e=>[...new Set((e.availablePowerKw?.length?e.availablePowerKw:[e.powerKwMin,e.powerKwMax]).filter(Number.isFinite))];
export function normalizeImportedVariant(make,line,engine){
 let v=normalizeVariant(engine.variant);if(!v)return v;
 v=v.replace(/\s+(?:Manual|Automatic|Auto|Steptronic|Stepspeed|Tiptronic)$/i,'').trim();
 if(make==='mercedes-benz'&&line==='w114-w115')v=v.replace(/\s+Long$/i,'').replace(/^230\.6$/,'230').replace(/^280 CE$/,'280 E').replace(/^(\d{3}) C$/,'$1');
 if(/^(?:\d+(?:st|nd|rd|th) Anniversary|RWD|FWD|AWD|2WD|4WD)$/i.test(v))v=labelFromStoredFacts(engine);
 return v;
}
const folded=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function balancedBrackets(value){
 const stack=[],pairs={')':'(',']':'[','}':'{'};
 for(const c of value??''){if('([{'.includes(c))stack.push(c);else if(Object.hasOwn(pairs,c)&&stack.pop()!==pairs[c])return false;}
 return stack.length===0;
}
export function labelFromStoredFacts(e){
 const fuel={petrol:'benzin',diesel:'diesel','petrol-cng':'benzin/CNG','petrol-lpg':'benzin/LPG','petrol-mhev':'benzin mHEV','diesel-mhev':'diesel mHEV','petrol-hev':'benzin HEV','petrol-phev':'benzin PHEV',electric:'Elektromotor',hydrogen:'Vodíkový pohon'}[e.fuel]??null;
 const size=e.displacementLitresNominal>0?`${e.displacementLitresNominal} l`:e.displacementCc>0?`${e.displacementCc} cm³`:null;
 const values=powerValues(e),kw=values.length?`${Math.min(...values)}${Math.min(...values)!==Math.max(...values)?`–${Math.max(...values)}`:''} kW`:null;
 if(!size&&!fuel&&!kw)return null;
 if(!size&&!kw&&fuel==='benzin')return 'Benzinový motor';
 if(!size&&!kw&&fuel==='diesel')return 'Dieselový motor';
 return [size,fuel,kw].filter(Boolean).join(' ');
}
export function enginePresentation(engine){
 let e={...engine},name=normalizeVariant(e.variant),original=e.variant;
 if(typeof original==='string'&&name===null)return null; // a header is not an engine
 if(!name){name=labelFromStoredFacts(e);if(!name)return null;e.variant=name;e.labelBasis='stored-engine-fields';return e;}
 let v=name;
 // Keep technical wording before an editorial qualifier. Preserve the full old text below.
 if(v.includes(';'))v=v.split(';')[0].trim();
 // A qualifier can itself contain a semicolon; discard an incomplete bracketed tail.
 if(!balancedBrackets(v))v=v.replace(/\s*\([^)]*$/, '').trim();
 if(v.includes(':')&&/nabidka|prospekt|brochure|technical sheet|press kit|comparison sheet/i.test(folded(v.split(':')[0])))v=v.slice(v.indexOf(':')+1).trim();
 v=v.replace(/\s+[–—]\s+.*$/u,part=>/nabidka|profil|udaj|muze|dolozen|zdroj|prospekt|vyber|historick|specifikace/i.test(folded(part))?'':part);
 v=v.replace(/\s*\([^)]*\)/g,part=>/nabidka|vyber|dolozen|prospekt|overen|specifikace|vykon podle verze/i.test(folded(part))?'':part).trim();
 if(/comparison sheet|technical sheet|press kit|brochure/i.test(v)||v.length>75)v=labelFromStoredFacts(e)??v.split(/[;,]/)[0].slice(0,75).trim();
 if(v!==name){e.noteCs=e.noteCs?.includes(name)?e.noteCs:[e.noteCs,name].filter((x,i,a)=>x&&a.indexOf(x)===i).join('\n');e.variant=v;}
 else e.variant=name;
 return e;
}
export function normalizeEngineRows(rows,presentation=true){
 if(!Array.isArray(rows))return rows;
 const seen=new Set(),out=[];
 for(const original of rows){
  const engine=presentation?enginePresentation(original):{...original};if(!engine)continue;
  if(engine.sourceScope?.generationEvidence&&nonEuropeanMarket([engine.sourceScope.originalVariant,engine.sourceScope.variantYears,engine.sourceScope.tableSection,engine.sourceScope.rowNotes].filter(Boolean).join(' ')))continue;
  const name=normalizeVariant(engine.variant);
  if(typeof engine.variant==='string'&&name===null)continue;
  const values=powerValues(engine),keys=name?values.map(kw=>`${name.toLowerCase()}|${kw}`):[];
  if(keys.length&&keys.every(k=>seen.has(k))){
   if(engine.noteCs){const target=out.find(e=>e.variant===name);if(target)target.noteCs=[...new Set([target.noteCs,engine.noteCs].filter(Boolean))].join('\n');}
   continue;
  }
  const fresh=name?[...new Set(values)].filter(kw=>!seen.has(`${name.toLowerCase()}|${kw}`)):values;
  let cleaned=typeof engine.variant==='string'?{...engine,variant:name}:engine;
  if(keys.length&&fresh.length<new Set(values).size)cleaned={...cleaned,availablePowerKw:fresh,powerKwMin:Math.min(...fresh),powerKwMax:Math.max(...fresh)};
  keys.forEach(k=>seen.add(k));out.push(cleaned);
 }
 return out;
}
export function nonEuropeanMarket(text){
 text=text.replace(/\b1[.,]6\s+Mexico\b/ig,'1.6 performance edition'); // European Escort badge
 const region='\\b(?:Thailand|China|Chinese|Japan|Japanese.market|India|Indian.market|Indonesia|Malaysia|Taiwan|Brazil|Argentina|Mexico|Pakistan|Iran|Australia|New.Zealand|South.Africa|North.America|USA|US|United.States|Canada|US.spec|Nordamerika|Südamerika|Australien|Indien|Neuseeland|Kanada|Südafrika|Japonsko|Indie|Čína|Brazílie)\\b';
 return new RegExp(region,'i').test(text.replace(new RegExp('(?:not (?:offered |sold |available )?in|except|excluding)\\s+'+region,'ig'),''));
}
export function evidenceProblem(g,index,e){
 if(typeof e.variant!=='string'||normalizeVariant(e.variant)!==e.variant)return 'Malformed engine variant name';
 const scope=e.sourceScope??{};
 if(nonEuropeanMarket([scope.originalVariant,scope.variantYears,scope.tableSection,scope.rowNotes].filter(Boolean).join(' ')))return 'Explicit non-European market row';
 const ev=scope.generationEvidence;
 if(!ev||ev.generationIndex!==index)return 'Missing/wrong source generation evidence';
 if(!['generation-heading','generation-article','row-years','row-years-within-table-envelope','single-generation-production','series-number-article','specification-page','reviewed-technical-version'].includes(ev.method))return 'Unknown attribution method';
 if(ev.method==='reviewed-technical-version'){
  const proof=scope.technicalVersionProof,trim=(g.trims??[]).find(t=>t.name===proof?.name&&(t.sources??[]).includes(proof?.source));
  if(!trim?.engine||JSON.stringify(trim.engine)!==JSON.stringify(proof.engine)||!(e.sources??[]).includes(proof.source))return 'Reviewed technical-version proof missing or changed';
  if(e.fuel!==trim.engine.fuel||e.displacementCc!==(trim.engine.displacementCc??null))return 'Technical-version fuel/capacity changed';
  if(e.powerKwMin!==null&&e.powerKwMin!==trim.engine.powerKw||e.powerKwMax!==e.powerKwMin)return 'Technical-version power changed';
  if(e.displacementLitresNominal!==null&&!trim.engine.displacementCc&&!new RegExp('\\b'+String(e.displacementLitresNominal).replace('.','[.,]')+'\\b').test(trim.name))return 'Technical-version nominal capacity not explicit';
  return null;
 }
 if(ev.rowFromYear!=null&&!(ev.rowFromYear>=g.from&&ev.rowToYear<=(g.to??2026)))return 'Engine row years contradict generation';
 if(ev.fromYear!=null&&ev.fromYear>(g.to??2026))return 'Source starts after generation';
 if(ev.toYear!=null&&ev.toYear<g.from)return 'Source ends before generation';
 if(ev.method==='specification-page'){
  const p=scope.specificationPage;
  if(!p||!(e.sources??[]).includes(p.url)||!/^https:\/\/www\.ultimatespecs\.com\/car-specs\/[A-Za-z-]+\/\d+\/[^/?#]+\.html$/.test(p.url??''))return 'Missing specification-page source';
  if(!p.title||!p.generation||p.generation!==ev.anchor||p.generationProductionFrom!==ev.fromYear||p.generationProductionTo!==ev.toYear)return 'Specification generation evidence mismatch';
  if(typeof p.generationFieldPresent!=='boolean')return 'Specification generation evidence kind missing';
  if((p.generationFieldPresent===false||p.generationAttribution==='linked-generation-page')&&(!p.linkedFromGenerationEngineTable||!/^https:\/\/www\.ultimatespecs\.com\/car-specs\/[A-Za-z-]+\/M\d+\/[^/?#]+$/.test(p.generationPageUrl??'')||p.generation!==p.generationPageTitle))return 'Missing explicit generation-table link';
  if(p.generationAttribution==='linked-generation-page'){
   const tokens=s=>new Set(folded(s??'').toUpperCase().match(/[A-Z0-9]+/g)??[]),parent=tokens(p.generationPageTitle),title=tokens(p.title),raw=tokens(p.generationFieldText),codes=[...tokens(g.code)].filter(c=>/\d/.test(c));
   if(!raw.size||![...raw].every(c=>parent.has(c))||!codes.some(c=>parent.has(c)&&title.has(c)))return 'Abbreviated generation field lacks scoped chassis-code proof';
  }
  const words=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ');
  const owns=text=>(p.modelAliases??[]).some(a=>/^[A-Z0-9]+$/.test(a)&&new RegExp(`(?<![A-Z0-9])${[...a].join('\\s*')}(?![A-Z0-9])`).test(words(text)));
  if(!owns(p.title)||!owns(p.generation))return 'Specification model title mismatch';
  const bodies=new Set(g.bodyTypes??[]),body=p.bodyText?.trim()??'';
  if(body&&!/^(?:-|n\/a|unknown)$/i.test(body)&&bodies.size===1){
   if((bodies.has('convertible')||bodies.has('kabriolet'))&&!/cabrio|convertible|roadster/i.test(body))return 'Specification body contradicts convertible generation';
   if((bodies.has('coupe')||bodies.has('kupe'))&&!/coup[eé]/i.test(body))return 'Specification body contradicts coupe generation';
  }
  if(!['HORSEPOWER','TOTAL ELECTRIC POWER'].includes(p.powerLabel))return 'Unsupported specification power label';
  if(e.fuel==='electric'&&!/electric/i.test(p.fuelText??''))return 'Missing electric propulsion evidence';
  if(p.powerLabel==='TOTAL ELECTRIC POWER'&&e.fuel!=='electric')return 'Electric power used for combustion engine';
  if(e.fuel==='diesel'&&!/diesel/i.test(p.fuelText??'')||e.fuel==='petrol'&&!/petrol|gasoline/i.test(p.fuelText??''))return 'Specification fuel mismatch';
  if(/hybrid|PHEV|MHEV|HEV|48\s*V/i.test((p.fuelText??'')+' '+p.title))return 'Hybrid needs explicit system-output handling';
  if(!/\bkW\b/i.test(p.powerText??''))return 'Specification page lacks explicit kW';
  const kw=[...new Set([...p.powerText.matchAll(/(\d+(?:[.,]\d+)?)\s*kW\b/ig)].map(m=>Number(m[1].replace(',','.'))))];
  if(kw.length!==1||kw[0]!==e.powerKwMin||e.powerKwMin!==e.powerKwMax)return 'Specification power differs from published kW';
  if(ev.rowFromYear==null)return 'Specification variant production year missing';
 }
 if(ev.method==='series-number-article'){
  if(!/^\d{3}$/.test(ev.seriesNumber??''))return 'Missing article series number';
  if(!new RegExp(`\\b[WRCAVXH]${ev.seriesNumber}\\b`).test(g.code??''))return 'Article series number contradicts generation';
  if(!new RegExp(`Mercedes-Benz (?:Baureihe |[WRCAVXH] ?)${ev.seriesNumber}\\b`).test(ev.anchor??''))return 'Article title contradicts series number';
  if(!(e.sources??[]).some(u=>new RegExp(`/Mercedes-Benz_(?:Baureihe_|[WRCAVXH]_?)${ev.seriesNumber}(?:$|#)`).test(decodeURI(u))))return 'Source URL does not identify the series';
  return null;
 }
 if(ev.method.startsWith('row-years'))return ev.rowFromYear==null?'Row-year attribution without row years':null;
 if(ev.fromYear==null||Math.abs(ev.fromYear-g.from)>1){
  const words=s=>new Set(s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase().match(/[A-Z0-9]+/g)??[]);
  const anchor=words(ev.anchor),identity=words(`${g.code??''} ${g.name??''}`);
  for(const [word,roman]of Object.entries({FIRST:'I',SECOND:'II',THIRD:'III',FOURTH:'IV',FIFTH:'V',SIXTH:'VI',SEVENTH:'VII',EIGHTH:'VIII',NINTH:'IX',TENTH:'X',ERSTE:'I',ZWEITE:'II',DRITTE:'III',VIERTE:'IV',FUNFTE:'V',SECHSTE:'VI',SIEBTE:'VII',ACHTE:'VIII'}))if(anchor.has(word))anchor.add(roman);
  const ids=[...identity].filter(x=>/^(?:[A-Z]+\d+[A-Z0-9]*|\d+[A-Z]+[A-Z0-9]*|I|II|III|IV|V|VI|VII|VIII|IX|X|[A-L])$/.test(x));
  if(!ids.some(x=>anchor.has(x)))return 'Generation anchor contradicts catalogue generation';
 }
 return null;
}
export function rejectEngine(make,line,engine){
 const v=engine.variant.toUpperCase();
 const s=engine.sourceScope??{};
 if(make==='maruti-suzuki'&&(engine.sources??[]).some(u=>/wikipedia\.org\/wiki\/Suzuki_|ultimatespecs\.com\/car-specs\/Suzuki\//i.test(u))&&!/\bMaruti\b/i.test([s.tableSection,s.rowNotes,s.articleTitle,s.originalVariant,s.specificationPage?.title].filter(Boolean).join(' ')))return 'Shared Suzuki source needs explicit Maruti version attribution';
 if(/\bmotorsport\b|\brally(?:ing)?\b/i.test(engine.sourceScope?.tableSection??''))return 'Motorsport section is not a road-car engine specification';
 if(/CONCEPT|PROTOTYP|EXPERIMENTAL|IMPULS/.test(v+' '+(engine.sourceScope?.tableSection??'').toUpperCase()))return 'Experimental/concept version';
 if(make==='audi'&&/^a[3468]$/.test(line)&&new RegExp(`\\bR?S${line.slice(1)}\\b`).test(v))return 'Explicit S/RS sibling badge has its own catalogue line';
 if(make==='bmw'&&['rada-3','rada-5'].includes(line)&&new RegExp(`\\bM${line.slice(-1)}\\b`).test(v))return 'Explicit M sibling badge';
 if(make==='mercedes-benz'&&line==='vito'&&/\bEQV\b/.test(v))return 'EQV passenger badge, not Vito';
 if(make==='mercedes-benz'&&line==='slc-c107'&&/\bSL\b/.test(v))return 'SL roadster badge, not the C107 SLC coupe';
 if(make==='peugeot'&&line==='partner'&&/BERLINGO/.test(v))return 'Explicit Berlingo badge';
 return null;
}
