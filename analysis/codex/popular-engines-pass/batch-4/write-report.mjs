import fs from 'node:fs';import zlib from 'node:zlib';
const root='analysis/codex/popular-engines-pass',batch=root+'/batch-4',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),changes=read(batch+'/engine-changes.json'),completed=[],deferred=[];
function reason(r){const id=r.make+'/'+r.line;
 if(id==='moskvic/426')return 'Отдельная RU-статья найдена, но помечена как недостоверная и даёт спорные 1360 см³ вместо 1358 в иных описаниях. Мощность только в л.с.; без надёжной собственной спецификации поля не заполнены.';
 if(id==='chevrolet/silverado')return 'Для указанного V поколения от 2026 не подтверждена отдельная серийная спецификация. Моторы прежнего T1XX или Silverado EV не скопированы.';
 if(id==='kia/seltos')return 'Для нового SP3 не подтверждены собственные европейские серийные моторы. Данные SP2 и иных рынков не перенесены.';
 if(id==='nissan/200-sx')return 'S10/S110/S15 отделены от европейских S12/S13/S14. В найденных таблицах японские и американские спецификации; конкретная европейская ветвь не подтверждена.';
 if(id==='nissan/prairie')return 'M12 — отдельная японская Liberty. Европейский M11 добавлен отдельно; его моторы сюда не перенесены.';
 if(id==='infiniti/q50')return 'Длиннобазный Q50L предназначен для Китая; европейский короткобазный Q50 не является доказательством его моторной гаммы.';
 if(id==='honda/insight')return 'Третья региональная генерация не смешана с европейским Insight II. Собственная европейская спецификация не подтверждена.';
 if(id==='renault/duster-renault-badged-non-eu')return 'Отдельная Renault-ветвь вне ЕС; моторы европейской Dacia Duster не перенесены автоматически.';
 return 'Собственная европейская спецификация этой региональной/импортной ветви не подтверждена. Американские и иные моторы тёзок не перенесены; протоколы в research.log/spec.log.';
}
for(const r of read(batch+'/selection.json')){const c=changes.changes.find(x=>x.id===r.make+'/'+r.line&&x.index===r.index);if(c)completed.push({...r,engineRows:c.engines.length});else deferred.push({...r,reason:reason(r)});}
const first=read(root+'/remaining-queue.json'),second=read(root+'/batch-2/remaining-queue.json'),third=read(root+'/batch-3/remaining-queue.json');
const allCompleted=[...first.completed,...second.completed,...third.completed,...completed],allDeferred=[...first.unresolved,...second.deferred,...third.deferred,...deferred];
const queue={originalPopularGenerations:480,originalFleet100To999:260,reviewedThisBatch:80,reviewedFleet100To999Cumulative:260,completed,deferred,allCompleted,allDeferred,nextFleet100To999:[]};write(batch+'/remaining-queue.json',queue);
const index=read('src/data/model-cards-index.json'),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz')))['src/data/model-cards-index.json'],count=x=>Object.values(x).flatMap(ls=>Object.values(ls)).reduce((n,c)=>n+c.generations.reduce((n,g)=>n+(g.engines?.length??0),0),0);
const engineJournals=['','/batch-2','/batch-3','/batch-4'].map(s=>read(root+s+'/engine-changes.json')),summary={reviewed:480,completed:allCompleted.length,deferred:allDeferred.length,unreviewed:0,fleet1000:{reviewed:220,completed:first.completed.length,deferred:first.unresolved.length,originalRows:engineJournals[0].rows},fleet100To999:{reviewed:260,completed:second.completed.length+third.completed.length+completed.length,deferred:second.deferred.length+third.deferred.length+deferred.length,rows:engineJournals.slice(1).reduce((n,x)=>n+x.rows,0)},audi:{identityCards:21,generations:49,engineRows:114},grossPopularRows:engineJournals.reduce((n,x)=>n+x.rows,0),crvRepair:{removed:7,added:2,net:-5},gleRepair:{replaced:1,net:0},initialEngineRows:count(base),currentEngineRows:count(index),netEngineRows:count(index)-count(base)};write(batch+'/closing-summary.json',summary);
const text=`## Пакет 4: последняя часть линий с парком 100–999

Проверены последние 80 поколений: ${changes.rows} строк в ${changes.generations} поколениях, ${deferred.length} отложены с причинами. Следующая непроверенная очередь пуста. Полный сводный список 171 отложенного поколения: batch-4/remaining-queue.json → allDeferred.

Добавлены, в частности, Space Wagon I–III, Crossfire, 944, GS/LS первого поколения, исторические Minx и Mercedes 170, C15/2CV/Visa, Cascada, CR-Z/Insight II, Mazda6e, MG5 EV, Dolphin Surf, i7/i8. У BAIC X7 использован собственный чешский лист 1498 см³ / 130 кВт, у Aixam 400 — отдельная homologation 6AA702 от 1997 года.

Гибриды и региональные версии проверены отдельно: CR-Z 91/101, Insight II 72 и i8 266/275 кВт — системные величины, не суммы компонентов. Моторы китайского EZ-6 не названы европейской Mazda6e. iOn/C-Zero имеют собственные источники, не общий лист i-MiEV; 49 кВт электрического Partner также не перенесены в iOn.

Даты, коды поколений, кузова, комплектации, рисунки, псевдонимы и вся статистика этого пакета сохранены. Неизвестные мощности/объёмы остались пустыми; наличие строки не означает полную спецификацию или исчерпывающую гамму. Проверки — PASS: сверка всех 4753 карточек и итоговой очереди, аудит 12139 моторных строк, регрессии системного/тягового выхода и собственных моделей, 20 отклонённых подмен доказательств пяти технических версий, тест политики моторов и TypeScript. Результаты: validation.json, qa-final.json и fact-validation.json в этом пакете.
`;
const closing=`## Итог прохода популярных моторов и Audi

| Группа | Проверено поколений | Получили строки | Отложено |
|---|---:|---:|---:|
| Линии с парком ≥1000 | 220 | 157 | 63 |
| Линии с парком 100–999 | 260 | 152 | 108 |
| Всего | 480 | 309 | 171 |

Все 480 исходных кандидатов просмотрены; непроверенных нет. Отложено означает отсутствие достаточного подтверждения, а не отсутствие двигателя у автомобиля. Сводный список с причинами сохранён в batch-4/remaining-queue.json, исходные протоколы каждого пакета сохранены.

Основные пакеты добавили 893 строки популярных моторов (466 + 129 + 159 + 139). Исправление CR-V I удалило семь поздних ошибочных строк и добавило две правильные: итог 888. Замена источника GLE Coupé C167 на собственный и корректировка MHEV не изменили число строк. Отдельно 21 Audi-карточка получила 49 поколений и 114 строк. Чистый итог всего прохода: +1002 строки, с 11137 до 12139.

Структура и статистика Audi были дополнены в первом пакете; последующие три пакета меняли только моторные факты. Исправления SQ7, CR-V и C167/V167 описаны выше и покрыты регрессиями. Охват моторных гамм репрезентативный; неподтверждённые параметры остаются пустыми. Машиночитаемые итоги: batch-4/closing-summary.json.
`;
fs.writeFileSync(batch+'/report.md','# Моторы популярных моделей — пакет 4\n\n'+text+'\n## Отложено в этом пакете\n\n'+deferred.map(r=>`- ${r.make}/${r.line} [${r.index}] ${r.generation}: ${r.reason}`).join('\n')+'\n\n'+closing);
const p=root+'/report.md',s=fs.readFileSync(p,'utf8'),marker='\n## Пакет 4:';fs.writeFileSync(p,(s.includes(marker)?s.slice(0,s.indexOf(marker)):s.trimEnd())+'\n\n'+text+'\n'+closing);console.log(summary);
