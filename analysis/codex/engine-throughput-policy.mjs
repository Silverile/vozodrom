export function normalizeVariant(value){
 if(typeof value!=='string')return value;
 let v=value.replace(/\[[^\]]*\]/g,'').replace(/\s+/g,' ').trim();
 if(!/^(?:\d+\.\d+|[A-Za-z]{1,4}\d{2,4}\.\d{2,4})$/.test(v))v=v.replace(/\.\d{1,2}$/,'');
 v=v.replace(/^(?:(?:Benzin|Diesel|Petrol|Gasoline|Otto)(?:motor(?:en)?| engines?)?)[\s:–-]+/i,'');
 v=v.replace(/\s*\((?:petrol|diesel|gasoline|benzin)\)/ig,'').replace(/\s+[-–]\s+(?:Van\b|Saloon\b|Estate\b|Hatchback\b|Sedan\b|\d{2}\/\d{2}).*$/i,'');
 v=v.replace(/\binline[- ](?:four|six|three)\b/ig,'').replace(/\s+/g,' ').replace(/^[ ,;\-]+|[ ,;\-]+$/g,'');
 return /^(?:motor(?:en)?|engine(?:s)?|benzin|diesel|petrol|gasoline|ottomotor(?:en)?|unnamed(?::.*)?)$/i.test(v)?null:v||null;
}
export const powerValues=e=>[...new Set((e.availablePowerKw?.length?e.availablePowerKw:[e.powerKwMin,e.powerKwMax]).filter(Number.isFinite))];
export function normalizeEngineRows(rows){
 if(!Array.isArray(rows))return rows;
 const seen=new Set(),out=[];
 for(const engine of rows){
  if(engine.sourceScope?.generationEvidence&&nonEuropeanMarket([engine.sourceScope.originalVariant,engine.sourceScope.variantYears,engine.sourceScope.tableSection,engine.sourceScope.rowNotes].filter(Boolean).join(' ')))continue;
  const name=normalizeVariant(engine.variant);
  if(typeof engine.variant==='string'&&name===null)continue;
  const values=powerValues(engine),keys=name?values.map(kw=>`${name.toLowerCase()}|${kw}`):[];
  if(keys.length&&keys.every(k=>seen.has(k)))continue;
  const fresh=name?[...new Set(values)].filter(kw=>!seen.has(`${name.toLowerCase()}|${kw}`)):values;
  let cleaned=typeof engine.variant==='string'?{...engine,variant:name}:engine;
  if(keys.length&&fresh.length<new Set(values).size)cleaned={...cleaned,availablePowerKw:fresh,powerKwMin:Math.min(...fresh),powerKwMax:Math.max(...fresh)};
  keys.forEach(k=>seen.add(k));out.push(cleaned);
 }
 return out;
}
export function nonEuropeanMarket(text){
 const region='\\b(?:Thailand|China|Chinese|Japan|Japanese.market|India|Indian.market|Indonesia|Malaysia|Taiwan|Brazil|Argentina|Mexico|Pakistan|Iran|Australia|New.Zealand|South.Africa|North.America|USA|US|United.States|Canada|US.spec|Nordamerika|Südamerika|Australien|Indien|Neuseeland|Kanada|Südafrika|Japonsko|Indie|Čína|Brazílie)\\b';
 return new RegExp(region,'i').test(text.replace(new RegExp('(?:not (?:offered |sold |available )?in|except|excluding)\\s+'+region,'ig'),''));
}
export function evidenceProblem(g,index,e){
 if(typeof e.variant!=='string'||normalizeVariant(e.variant)!==e.variant)return 'Malformed engine variant name';
 const scope=e.sourceScope??{};
 if(nonEuropeanMarket([scope.originalVariant,scope.variantYears,scope.tableSection,scope.rowNotes].filter(Boolean).join(' ')))return 'Explicit non-European market row';
 const ev=scope.generationEvidence;
 if(!ev||ev.generationIndex!==index)return 'Missing/wrong source generation evidence';
 if(!['generation-heading','generation-article','row-years','row-years-within-table-envelope','single-generation-production'].includes(ev.method))return 'Unknown attribution method';
 if(ev.rowFromYear!=null&&!(ev.rowFromYear>=g.from&&ev.rowToYear<=(g.to??2026)))return 'Engine row years contradict generation';
 if(ev.fromYear!=null&&ev.fromYear>(g.to??2026))return 'Source starts after generation';
 if(ev.toYear!=null&&ev.toYear<g.from)return 'Source ends before generation';
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
 if(/CONCEPT|PROTOTYP|EXPERIMENTAL|IMPULS/.test(v+' '+(engine.sourceScope?.tableSection??'').toUpperCase()))return 'Experimental/concept version';
 if(make==='audi'&&/^a[3468]$/.test(line)&&new RegExp(`\\bR?S${line.slice(1)}\\b`).test(v))return 'Explicit S/RS sibling badge has its own catalogue line';
 if(make==='bmw'&&['rada-3','rada-5'].includes(line)&&new RegExp(`\\bM${line.slice(-1)}\\b`).test(v))return 'Explicit M sibling badge';
 if(make==='mercedes-benz'&&line==='vito'&&/\bEQV\b/.test(v))return 'EQV passenger badge, not Vito';
 if(make==='peugeot'&&line==='partner'&&/BERLINGO/.test(v))return 'Explicit Berlingo badge';
 return null;
}
