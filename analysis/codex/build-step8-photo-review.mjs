import fs from 'node:fs';
const rows=JSON.parse(fs.readFileSync('analysis/codex/skoda-step8-photo-candidates.json','utf8'));
const notes={
 '1101-1102':['rejected','Přední levý konec nárazníku je mimo záběr a vůz nemá dostatečný okraj. Fotografie nesplňuje pravidlo celého automobilu.'],
 '130-135-136':['rejected','Těsný pohled zezadu neukazuje celou délku karoserie ani všechna kola. Pro ilustraci celé modelové rodiny je nevhodný.'],
 '633':['passed','Celý automobil je v předním tříčtvrtečním pohledu s okrajem kolem nárazníku, střechy i kol. Okolní auta a městský mobiliář nezakrývají významnou část karoserie. Přesný rok a původnost výbavy kontrola nepotvrzuje.']
};
fs.writeFileSync('analysis/codex/skoda-step8-photo-review.json',JSON.stringify({reviewedAt:'2026-10-26',method:'Original Commons files viewed from OS temporary storage. Whole-car rule; no new image binaries in repository.',decisions:rows.filter(r=>notes[r.lineSlug]).map(r=>({lineSlug:r.lineSlug,generationIndex:r.generationIndex,file:r.file,decision:notes[r.lineSlug][0],noteCs:notes[r.lineSlug][1]})),unresolved:rows.filter(r=>r.error).map(r=>({lineSlug:r.lineSlug,file:r.file,reason:r.error+'; no visual decision, remains pending'}))},null,2)+'\n');
