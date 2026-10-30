// Model-specific evidence, never base-model production windows.
export function applyPerformance({cards,lines,additions,issues}) {
  const history='https://nieuws.audi.nl/audi-sport-viert-25-jaar-audi-rs-modellen/';
  const rs6='https://www.audi.com/en/media-releases/20-years-four-generations-audi-rs-6-superior-performance-with-an-everyday-look-14795';
  const rs6Dates='https://www.audi.com/en/media-releases/for-me-the-current-rs-6-is-the-crowning-achievement-of-two-decades-of-rs-history-14760';
  const rs3='https://www.audi.com/en/media-releases/a-feast-for-the-senses-upgrade-for-the-audi-rs-3-16140';
  const tt='https://audi.hu/en/news/details/465_extremely_sporty_the_new_audi_tt_rs_from_gyor_introduced/';
  const ttEnd='https://www.audi.com/en/audi-tt-rs-coupe-11276';
  const rs5='https://www.audi.com/en/press-releases/the-new-audi-rs-5-high-performance-in-a-hybrid-17012';
  const q3='https://www.audi.com/en/the-new-audi-rs-q3-and-the-new-audi-rs-q3-sportback-compact-power-packs-2020-12492/the-new-audi-rs-q3-and-the-new-audi-rs-q3-sportback-12493';
  const s2='https://magazine.audi.com.au/article/the-birth-of-s';
  const plus='https://www.audi.com/en/highlights-from-40-years-of-audi-sport-gmbh-15337/high-performance-models-made-by-quattro-15340';
  // code, start, end, bodies, sources, date basis. Null end is UNKNOWN, not current.
  const specs={
    rs2:[['B4',1994,null,['kombi'],[history],'market-introduction']],
    rs3:[['I',2011,null,['hatchback'],[rs3],'market-introduction'],['II',2015,2020,['hatchback','sedan'],[rs3],'production'],['III',2021,null,['hatchback','sedan'],[rs3],'market-introduction']],
    rs4:[['B5',2000,null,['kombi'],[history],'market-introduction'],['B7',2005,null,['sedan','kombi','kabriolet'],[history],'market-introduction'],['B8',2012,null,['kombi'],[history],'market-introduction'],['B9',2017,null,['kombi'],[history],'market-introduction']],
    rs5:[['I',2010,null,['kupe','kabriolet'],[history],'market-introduction'],['II',2017,null,['kupe','hatchback'],[history],'market-introduction'],['III',2026,null,['sedan','kombi'],[rs5],'market-introduction']],
    rs6:[['C5',2002,2004,['sedan','kombi'],[rs6,rs6Dates],'production'],['C6',2008,2010,['sedan','kombi'],[rs6,rs6Dates],'production'],['C7',2013,null,['kombi'],[rs6],'market-introduction'],['C8',2019,null,['kombi'],[rs6],'market-introduction']],
    'rs-q3':[['I',2013,null,['suv'],[history],'market-introduction'],['II',2019,2025,['suv'],[q3,'https://www.audi.com/de/audi-rs-q3-58'],'market-availability']],
    'tt-rs':[['I',2009,null,['kupe','kabriolet'],[history,tt],'market-introduction'],['II',2016,2023,['kupe','kabriolet'],[tt,ttEnd],'market-availability']],
    s2:[['I',1990,1995,['kupe'],[s2],'production']],
    's6-plus':[['I',1996,null,['sedan','kombi'],[plus],'market-introduction']],
  };
  for(const [slug,name,parent,source] of [['s2','S2','coupe',s2],['s6-plus','S6 plus','s6',plus]]){
    if(!cards.some(c=>c.lineSlug===slug))cards.push({makeSlug:'audi',lineSlug:slug,name,isAddition:true,segment:null,generations:[],sources:[source],needsReview:[],familyLineSlug:parent,imageStatus:'missing',aliases:[name.replaceAll(' ','')]});
    if(![...lines,...additions].some(l=>l.makeSlug==='audi'&&l.slug===slug))additions.push({makeSlug:'audi',slug,name,familyLineSlug:parent,aliases:[name.replaceAll(' ','')],sources:[source]});
  }
  for(const [slug,rows] of Object.entries(specs)){
    const card=cards.find(c=>c.lineSlug===slug);
    card.generations=rows.map(([code,from,to,bodyTypes,sources,dateBasis])=>({
      code,name:`${card.name} ${code}`,from,to,productionStatus:to===null?'unknown':'ended',
      dateBasis,verifiedAt:'2026-10-30',bodyTypes,facelift:null,engines:null,engineCoverage:'unknown',
      drivetrains:null,transmissions:null,dimensionsMm:null,trunkL:null,photo:null,trims:null,
      markets:['source-market'],imageStatus:'missing',sources,
      specificationScope:{market:'European model history; exact CZ availability unverified',modelYear:null,variant:null,bodyType:null,noteCs:'Začátek je uvedení generace na trh, není-li výslovně doložena výroba. Karoserie mohly přibýt později. Neznámý konec nepotvrzuje současnou výrobu.'},
    }));
    card.coverage='generations-partial';card.verifiedAt='2026-10-30';
    card.sources=[...new Set([...card.sources,...rows.flatMap(r=>r[4])])];
    card.summaryCs=`${card.name} má v tomto přehledu ${rows.length} doložené konstrukční generace. Roky uvedení, karoserie a konec výroby se mohou lišit podle trhu; neznámé údaje se dále ověřují.`;
    card.needsReview=[{field:'generations',reason:'Exact end dates, body-specific availability, facelifts and powertrains remain incomplete; only model-specific evidence was applied.'}];
    if(slug==='s2')card.needsReview.push({field:'bodyTypes',reason:'This sourced generation covers Coupé; S2 sedan/Avant dates and relationship remain to be researched.'});
    if(slug==='rs4')card.needsReview.push({field:'generations[0].from',reason:'Audi history distinguishes 1999 presentation from 2000 market introduction; index uses market introduction.'});
    if(slug==='rs3'){
      card.generations[1].facelift=[{year:2017,name:'facelift',sources:[rs3]}];
      card.generations[2].facelift=[{year:2024,name:'facelift',sources:[rs3]}];
      card.generations[1].specificationScope.noteCs+=' Sedan od 2017; Sportback od 2015.';
    }
    const line=[...lines,...additions].find(l=>l.makeSlug==='audi'&&l.slug===slug);
    line.from=Math.min(...rows.map(r=>r[1]));
    // Partial end coverage must never be flattened into a false overall end date.
    line.to=rows.at(-1)[2];line.productionStatus=line.to===null?'unknown':'ended';
    line.dateScope='model-specific-generation-envelope';
    line.bodyTypes=[...new Set(rows.flatMap(r=>r[3]))];
    line.generations=card.generations.map(({code,from,to,productionStatus,dateBasis,sources})=>({code,from,to,productionStatus,dateBasis,sources}));
    line.sources=[...new Set([...(line.sources??[]),...card.sources])];
    const issue=issues.find(i=>i.candidate_model===card.name||i.candidate_model===slug);
    const result={issue_type:'missing_generation',candidate_model:card.name,status:'model_specific_generations_added_partial_dates',evidence_urls:card.sources,confidence:'high',proposed_action:'verify_remaining_end_dates_body_intervals_and_markets'};
    if(issue)Object.assign(issue,result);else issues.push(result);
  }
  const oldSource='https://www.audi.com/en/press-releases/a-new-era-for-the-four-rings-60-years-since-the-first-post-war-audi-16734';
  const old=cards.find(c=>c.lineSlug==='920');
  old.generations[0].to=1940;old.generations[0].productionStatus='ended';
  old.generations[0].sources=[...new Set([...old.generations[0].sources,oldSource])];
  old.sources=[...new Set([...old.sources,oldSource])];
  const oldLine=lines.find(l=>l.makeSlug==='audi'&&l.slug==='920');
  oldLine.to=1940;oldLine.productionStatus='ended';oldLine.productionPeriods=[{from:1938,to:1940}];
  oldLine.generations[0].to=1940;oldLine.generations[0].productionStatus='ended';
  oldLine.sources=[...new Set([...oldLine.sources,oldSource])];
  Object.assign(issues.find(i=>i.candidate_model==='920'),{status:'production_end_corrected',evidence_urls:[oldSource]});
  const rename='https://www.audi.com/en/the-audi-q8-e-tron-until-2025-15069/increased-efficiency-and-range-sharpened-design-the-new-audi-q8-e-tron-15070';
  const electricCard=cards.find(c=>c.lineSlug==='q8-e-tron');
  electricCard.aliases=[...new Set([...(electricCard.aliases??[]),'e-tron','Audi e-tron','e-tron Sportback','Q8 Sportback e-tron'])];
  electricCard.summaryCs='Původní Audi e-tron navazuje od roku 2023 modernizovaným modelem pod názvem Q8 e-tron. Jde o pokračování stejné modelové řady, nikoli novou generaci; starší vozy lze hledat jako e-tron.';
  electricCard.generations[0].name='e-tron / Q8 e-tron';
  electricCard.generations[0].facelift=[{year:2023,name:'Q8 e-tron',note:'Přejmenování a modernizace; evropské uvedení v únoru 2023.',sources:[rename]}];
  electricCard.sources=[...new Set([...electricCard.sources,rename])];
  electricCard.generations[0].sources=[...new Set([...electricCard.generations[0].sources,rename])];
  const electricLine=lines.find(l=>l.makeSlug==='audi'&&l.slug==='q8-e-tron');
  electricLine.aliases=electricCard.aliases;electricLine.sources=[...new Set([...electricLine.sources,rename])];
  Object.assign(issues.find(i=>i.candidate_model==='q8-e-tron'),{issue_type:'incorrect_name',status:'original_name_alias_and_facelift_restored',evidence_urls:[rename]});
  return specs;
}
