const fs=require('fs');
const d='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(d+p,'utf8'));
const write=(p,x)=>fs.writeFileSync(d+p,JSON.stringify(x,null,2)+'\n');
const year=read('TURN-6-YEAR-RECHECK.json');
const audi=read('audi.json');
const sources=[
 'https://www.volkswagen-group.com/de/publikationen/unternehmensberichte/geschaeftsbericht-2012-2330/download?disposition=attachment',
 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/a3/8v/'
];
const review={round:7,lineSlug:'a3',generationIndex:2,field:'from',kept:2012,
 verdict:'Closed at calendar-year precision: VW 2012 annual report explicitly dates new A3 production to April2012; ADAC independently describes 8V manufacture2012–2020. No day/month is added to catalogue. VW report accessed as indexed text; direct open exceeds web size limit.',sources};
(audi.depthYearRechecks??=[]).push(review);
(audi.depthYearRechecks??=[]).push({round:7,lineSlug:'a4',generationIndex:3,field:'from',kept:2007,
 verdict:'2007 retained; exact final-vehicle SOP remains open. OEM retrospective links B8 and two-plant production to2007. Independent TRUMPF author describes series door manufacture from early2007, which cannot independently establish complete-vehicle SOP. Do not promote component-production dates to whole-car SOP.',
 sources:['https://www.audi-mediacenter.com/en/press-releases/silver-jubilee-audi-a4-celebrates-its-25th-birthday-11619/download','https://application.wiley-vch.de/berlin/journals/ltj/07-02/LTJ0702_S27_S28.pdf'],
 access:'OEM indexed PDF excerpt only; direct URL redirected unsuccessfully. TRUMPF paper full PDF read.'});
for(const x of year.entries)if(x.make==='audi'&&x.lineSlug==='a3'&&x.path==='generations[2].from'){
 (x.recheckHistory??=[]).push({round:6,status:x.recheckStatus,note:x.recheckNote,sources:x.recheckSources});
 x.recheckStatus='closed-series-production-year-two-publishers';
 x.recheckNote=review.verdict;x.recheckSources=sources;x.recheckRound=7;
}
year.round7Scope='Only Audi A3 8V year disposition closed this round. Other prior dispositions remain unchanged; exact SOP day/month is not a catalogue requirement. Audi A4 component evidence does not close full-vehicle SOP.';
write('audi.json',audi);write('TURN-6-YEAR-RECHECK.json',year);
console.log('Appended two Audi year reviews; closed one A3 calendar-year disposition; no card mutation.');
