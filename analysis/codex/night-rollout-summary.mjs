import fs from 'node:fs';
import assert from 'node:assert/strict';
const reports=[1,2,3].map(n=>JSON.parse(fs.readFileSync(`analysis/codex/popular-batch${n}-review.json`,'utf8')));
const changed=reports.flatMap(r=>r.lines.filter(l=>l.status==='partial-sourced-enrichment'));
const keys=changed.map(l=>`${l.make}/${l.slug}`);
assert.equal(new Set(keys).size,39);
const fields=['generations','facelifts','engines','enginesWithPower','versions','equipmentLines'];
const delta=Object.fromEntries(fields.map(k=>[k,changed.reduce((n,l)=>n+l.after[k]-l.before[k],0)]));
const morningSummaryRu=[
 'За три ночных пакета дополнены 39 популярных моделей; с прежним пилотом Kodiaq — 40 моделей.',
 `Добавлено ${delta.versions} технических версий, ${delta.equipmentLines} линий оснащения и ${delta.facelifts} рестайлингов; у ${delta.enginesWithPower} дополнительных записей моторов теперь есть документированные границы мощности.`,
 'Это частичное обогащение: полный исторический набор двигателей, версий и рестайлингов пока не подтверждён. Новые снимки предложений имеют источники и рыночную область.',
 'Чертежи не создавались; индексы поколений, их даты и блокировки изображений сохранены.',
 'Нужна миграция/проверка структуры: Tucson NX5 перед NX4; Ceed — кузова вместо отдельных поколений; Caddy — граница 2015 года.',
 'BMW 5: общая запись с 1972 года рядом с G60 и F10; Audi A6: почти нет дат, код 4L для записи 2025 года не подтверждён.',
 'Спорные окончания: Fabia I 2009 против заводского 2008; Mégane I 2003 против 2002 в Европе/2009 в Аргентине; Yeti 2017 против заводского 2018.',
 'Yaris: противоречие MY2025/MY2024 в одном прайсе; A4 B8: анонс рестайлинга 2011, поставки в Нидерландах 2012. Даты поколений не менялись.',
 'Обновления Transit 2024 и Yaris 2024 не выданы за подтверждённый новый внешний облик; для них нужна отдельная проверка.',
 'Проверки сохранности данных и TypeScript прошли; сборку и страницы последнего пакета ещё должен проверить Claude.'
];
assert(morningSummaryRu.length<=10);
const report={reviewedAt:'2026-10-31',status:'partial-sourced-enrichment',uniqueLines:39,includingEarlierKodiaqPilot:40,delta,
 deltaMeaning:{enginesWithPower:'Increase in entries with documented bounds, including newly introduced families; not the count of previously existing null entries filled.',engines:'Additional family-summary entries, many derived from already present sourced technical versions.',versions:'Additional technical configurations; dated availability snapshots do not assert complete production intervals.'},
 batch3:reports[2].lines,structuralReview:reports.flatMap(r=>r.generationReview??[]),
 morningSummaryRu,limitations:['No exhaustive historic completeness certification.','No generation migration performed.','Full build and browser rendering of batch3 not run by Codex.','Foreign market examples do not certify Czech availability.']};
fs.writeFileSync('analysis/codex/night-rollout-summary.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({uniqueLines:report.uniqueLines,delta}));
