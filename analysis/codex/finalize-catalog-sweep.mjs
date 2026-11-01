import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';

const root='analysis/codex/wave-3/batch-9';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const audit=read('analysis/codex/catalog-completeness-audit.json');
const summary=read('analysis/codex/catalog-sweep-summary.json');
const progress=read('analysis/codex/catalog-sweep-progress.json');
const residual=read('analysis/codex/catalog-sweep-residuals.json');
const ordinary=read('analysis/codex/wave-3/progress.json');
const validation=read(root+'/validation.json');
const stats=read(root+'/statistics.json');
const cards=read('src/data/model-cards-index.json');
const before=JSON.parse(cp.execFileSync('git',['show',summary.baselineRevision+':src/data/model-cards-index.json'],{maxBuffer:90e6}));
const entries=x=>Object.entries(x).flatMap(([m,ls])=>Object.entries(ls).map(([l,c])=>({id:m+'/'+l,...c})));
const oldCards=entries(before),currentCards=entries(cards),oldIds=new Set(oldCards.map(c=>c.id)),currentIds=new Set(currentCards.map(c=>c.id));
const oldGenerations=oldCards.flatMap(c=>c.generations),generations=currentCards.flatMap(c=>c.generations);
const identityOnly=currentCards.filter(c=>!c.generations.length).map(c=>c.id);
assert.equal(validation.result,'PASS');assert.equal(stats.status,'complete');
assert.equal(ordinary.remaining,0);assert.equal(progress.counts.unvisited,0);
assert.equal(progress.counts.linesVisited,audit.counts.lines);
assert(progress.counts.byWave.every(w=>w.lines===w.visited));
assert.equal(audit.counts.linesWithoutCard,0);
assert.equal(generations.length,audit.counts.generations);
assert.equal(oldGenerations.length,summary.countsBefore.generations);
assert.equal(currentCards.length,audit.counts.cards);
const identityReview=read(root+'/identity-only-audi-review.json');
assert.deepEqual([...identityOnly].sort(),identityReview.items.map(x=>x.id).sort());
const metrics={
  asOf:audit.asOf,status:'source-queues-closed-with-residual-gaps',historicalCompletenessCertified:false,
  scope:'Every current identity passed the field audit and tracked source-search queues; remaining fields and identity-only cards are explicit.',
  currentLines:audit.counts.lines,trackedLines:progress.counts.linesVisited,untrackedLines:0,
  ordinaryWave3:{visited:ordinary.visited,total:ordinary.currentLines,remaining:ordinary.remaining},
  finalSourceBatch:{ordinary:647,fleetCoverageCatchup:163,total:810},
  before:summary.countsBefore,after:audit.counts,
  engineRowsBefore:summary.engineRowsBefore,engineRowsAfter:summary.engineRowsAfter,
  newCardIds:[...currentIds].filter(id=>!oldIds.has(id)),removedOriginalCardIds:[...oldIds].filter(id=>!currentIds.has(id)),
  missingGenerationCardsBefore:oldCards.filter(c=>!c.generations.length).length,
  identityOnlyCards:identityOnly,
  bodyEntriesBefore:oldGenerations.filter(g=>g.bodyTypes?.length).length,
  bodyEntriesAfter:generations.filter(g=>g.bodyTypes?.length).length,
  missingEngineEntries:generations.filter(g=>!g.engines.length).length,
  missingBodyEntries:generations.filter(g=>!g.bodyTypes?.length).length,
  missingStartYearEntries:generations.filter(g=>g.from==null).length,
  announcementEntries:generations.filter(g=>g.dateBasis==='announcement').length,
  structuralSignals:residual.structuralSignals.length,
  sourceQueueFrame:progress.counts.byWave,fieldGapFrame:summary.currentFrame,
  changedPublicCards:summary.changedPublicCards,
  drawingEntriesChecked:validation.drawingEntries,statisticsGenerationKeysChecked:validation.statisticsGenerationKeys,
  validation:root+'/validation.json',statistics:root+'/statistics.json',buildAndRenderedPagesChecked:false
};
assert.equal(metrics.newCardIds.length,audit.counts.cards-summary.countsBefore.cards);
assert.equal(metrics.removedOriginalCardIds.length,0);
write('analysis/codex/catalog-sweep-closing-validation.json',metrics);
for(const item of [summary,progress,residual])item.asOf=audit.asOf;
summary.sweepStatus=metrics.status;summary.closingValidation='analysis/codex/catalog-sweep-closing-validation.json';summary.identityOnlyCards=identityOnly;
summary.wave3MissingCards.phase='Missing-card queue closed; subsequent structural/source passes completed with residual history gaps';
summary.wave3MissingCards.fullStructuralPassCompleted=true;
summary.wave3StructuralPass.next='Source queues closed; remaining field and history gaps need focused research';
summary.wave3Ordinary.finalFleetCoverageCatchup=163;
ordinary.scope='Ordinary wave-3 source queues plus final fleet-coverage catch-up IDs; visited/remaining totals filter to the current no-fleet wave.';
ordinary.finalFleetCoverageCatchup=163;
progress.activePhase='Source queues closed; residual field and history research remains';
write('analysis/codex/catalog-sweep-summary.json',summary);write('analysis/codex/catalog-sweep-progress.json',progress);write('analysis/codex/catalog-sweep-residuals.json',residual);
write('analysis/codex/wave-3/progress.json',ordinary);
const b=summary.countsBefore,c=audit.counts,n=x=>x.toLocaleString('ru-RU');
const rows=[
 ['Модели в списке',b.lines,c.lines],['Карточки моделей',b.cards,c.cards],['Модели без карточки',b.linesWithoutCard,c.linesWithoutCard],
 ['Карточки без записей о поколениях',metrics.missingGenerationCardsBefore,identityOnly.length],
 ['Записи поколений, кузовов и региональных веток',b.generations,c.generations],
 ['Записи поколений с двигателями',b.generationsWithEngines,c.generationsWithEngines],
 ['Строки двигателей',summary.engineRowsBefore,summary.engineRowsAfter],
 ['Записи поколений с типом кузова',metrics.bodyEntriesBefore,metrics.bodyEntriesAfter],
 ['Записи поколений с отмеченным рестайлингом',b.generationsWithFacelifts,c.generationsWithFacelifts],
 ['Записи поколений с пробелами в мощности',b.generationsWithEngineRowsWithoutPower,c.generationsWithEngineRowsWithoutPower]
];
const labels={1:'От 1 000 машин в чешском реестре',2:'От 1 до 999 машин',3:'Без опубликованной численности в реестре'};
const md=[
 '# Итоги проверки каталога',
 '',
 'Срез: '+audit.asOf.split('-').reverse().join('.')+'. Обход очередей завершён. Все '+n(c.lines)+' модели прошли аудит полей и учёт поисковых попыток; карточки есть у всех. Полнота истории каждой модели ещё не подтверждена.',
 '',
 '## Что изменилось',
 '',
 '| Показатель | В начале обхода | Сейчас |','|---|---:|---:|',...rows.map(([label,a,z])=>`| ${label} | ${n(a)} | ${n(z)} |`),
 '',
 `Добавлено ${n(metrics.newCardIds.length)} новых карточек. Список моделей сократился на ${n(b.lines-c.lines)} дублей и служебных предложений. Все исходные карточки остались в каталоге (${n(oldCards.length)}); часть сведений объединена с основными записями. Изменения затронули ${n(summary.changedPublicCards)} текущих карточек.`,
 '',
 '- Исправлены запрошенные Tucson, Ceed, Caddy, BMW 5 и Audi A6. Кузова Ceed собраны внутри поколений. Анонсированное поколение Tucson сохранено с соответствующей пометкой.',
 '- Дополнена структура ряда BMW; объединены дубли поколений, оставшиеся от отдельных технических листов. Для исправленных границ использовались годы серийного производства.',
 '- Убраны обрывки таблиц и служебные уточнения из названий двигателей. Для добавленных фактов сохранены ссылки на источники; неподтверждённые цифры оставлены пустыми.',
 '- Исправлен подсчёт дефектов STK: один код неисправности учитывается один раз за осмотр. Исправлена маршрутизация числовых обозначений BMW и сопоставление поколений по годам. При перестройке поколений переносились привязки рисунков и статистики.',
 '',
 'На финальной сверке обнаружились 163 модели с чешской численностью, пропущенные прежними поисковыми очередями, включая поздно созданные карточки. Для них выполнен дополнительный проход. Вместе с последними 647 моделями третьей волны это 810 проверенных записей в заключительном пакете. Очередь третьей волны закрыта: '+n(ordinary.visited)+' из '+n(ordinary.currentLines)+'.',
 '',
 '## Что осталось',
 '',
 `Отдельные строки двигателей отсутствуют у ${n(metrics.missingEngineEntries)} записей поколений; часть мощностей неизвестна у ${n(c.generationsWithEngineRowsWithoutPower)}. Тип кузова не заполнен у ${n(metrics.missingBodyEntries)}, начальный год — у ${n(metrics.missingStartYearEntries)}. Данные о комплектациях пока есть только в ${n(c.generationsWithEquipmentLines)} записях поколений.`,
 '',
 '| Группа | Моделей | Записей поколений | Без строк двигателей | С пробелами в мощности |','|---|---:|---:|---:|---:|',
 ...summary.currentFrame.map(f=>`| ${labels[f.wave]} | ${n(f.lines)} | ${n(f.generations)} | ${n(f.emptyEngineGenerations)} | ${n(f.partialPowerGenerations)} |`),
 '',
 'Причины пробелов: в части источников нет нужных таблиц; автоматический разбор не всегда надёжно связывает мощность, топливо, рынок и поколение; исторические и параллельные серии требуют ручного сопоставления. Часть записей относится к анонсам и несерийным проектам, для которых серийных характеристик ещё нет. Пробел в нашем справочнике не означает, что информацию невозможно найти.',
 '',
 `Отдельный хвост — карточки Audi без поколений: **${identityOnly.length}**. Это ветки S/RS, e-tron и allroad (полный список — в отдельном файле). Их карточки пока содержат только идентификацию модели. Ссылки на модельные статьи и разделы собраны; собственные поколения и годы ещё нужно разобрать вручную. Годы базовых Audi автоматически не переносились.`,
 '',
 `Структурные сигналы для проверки: **${n(metrics.structuralSignals)}**. Часть связана с нормальным параллельным выпуском кузовов и региональных версий. Среди конкретных хвостов: ранняя история Land Cruiser до J70, границы некоторых Mahindra CJ и Abarth 1000, региональные ветки Geely Emgrand и привязка рисунка Microcar M-GO.`,
 '',
 '## Проверки и следующий шаг',
 '',
 `Финальный контроль прошёл: проверены ${n(validation.drawingEntries)} привязок рисунков и ${n(validation.statisticsGenerationKeys)} ключей поколений в статистике. Последний пакет сохраняет ${n(validation.untouchedPublicCards)} нетронутых карточек без изменений. Сборка, проверка страниц и публикация финального пакета остаются следующим шагом Claude.`,
 '',
  'Блокирующих решений владельца для передачи этого пакета нет. Для следующего этапа стоит выбрать приоритет: сначала закрывать оставшиеся пробелы популярных в Чехии машин или продолжать редкие и исторические модели. Рекомендация — популярные машины и незаполненные истории Audi, затем редкие модели. Годы и мощности, по которым нет подтверждения, требуют дальнейшего поиска источников.',
 '',
 'Подробности: [остаточные пробелы](catalog-sweep-residuals.json), [финальные счётчики и контроль покрытия](catalog-sweep-closing-validation.json), [заключительный пакет](wave-3/batch-9/report.md), [истории Audi для разбора](wave-3/batch-9/identity-only-audi-review.json), [структурные вопросы](structure-pass-6/follow-ups.json).'
];
fs.writeFileSync('analysis/codex/catalog-sweep-summary.md',md.join('\n')+'\n');
const batchPath=root+'/report.md';let batch=fs.readFileSync(batchPath,'utf8');
const scopeText='\nScope of this final batch: 647 remaining ordinary wave-3 lines plus 163 current fleet lines omitted from earlier source queues. All 810 identities are unique. The final global audit identifies 21 identity-only Audi histories, 11 in this catch-up and 10 already tracked earlier; see identity-only-audi-review.json.\n';
if(!batch.includes('Scope of this final batch:'))batch=batch.replace(/\n\n/,'\n'+scopeText+'\n');
fs.writeFileSync(batchPath,batch);
console.log(JSON.stringify({status:metrics.status,trackedLines:metrics.trackedLines,missingCards:c.linesWithoutCard,identityOnlyCards:identityOnly.length,engineRows:summary.engineRowsAfter,missingEngineEntries:metrics.missingEngineEntries,newCards:metrics.newCardIds.length,changedCards:summary.changedPublicCards}));
