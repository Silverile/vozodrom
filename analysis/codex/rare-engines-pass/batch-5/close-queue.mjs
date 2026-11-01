import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/rare-engines-pass',batch=root+'/batch-5',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n'),prior=read(root+'/batch-4/remaining-queue.json'),selected=read(batch+'/selection.json'),changes=read(batch+'/engine-changes.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,filled=new Map(changes.changes.map(r=>[key(r),r]));
const reasons={
 'maxus/t70/0':'Не подтверждены европейская спецификация и точный шильдик T70; T90/Terron не использованы как доноры.',
 'santana-motor/santana-2500-series-iv-super-cazorla/0':'Не найдена быстро проверяемая собственная таблица для объединённой семьи Series IV/Super Cazorla; данные Land Rover не перенесены.',
 'santana-motor/santana-cajal/0':'Серийное производство и европейская спецификация Cajal не подтверждены собственным источником производителя.',
 'ariel/atom/1':'История производителя подтверждает мотор Honda, но отдельная таблица объёма и кВт этой версии не найдена; параметры донора не перенесены.',
 'ariel/atom/2':'История производителя содержит bhp; отдельная спецификация поколения в см³/кВт не проверена, пересчёт не выполнялся.',
 'proton/suprima-s/0':'Сохранённый источник относится к Малайзии; реальные европейские продажи именно Suprima S не подтверждены.',
 'morgan/plus-four-cx-t/0':'Собственная публикация подтверждает CXT, но отдельная техническая таблица не найдена; параметры обычного Plus Four не перенесены.',
 'mahindra/scorpio-pik-up-goa-pik-up-getaway/1':'Не подтверждены серийное европейское исполнение нового Lifestyle Pik Up и омологация; концепт не приравнен к серии.',
 'innocenti/koral/0':'Нет проверенной собственной технической таблицы Innocenti Koral; данные Yugo не перенесены.',
 'innocenti/mille/0':'Нет проверенной таблицы именно Innocenti Mille; параметры Fiat Uno не перенесены.',
 'innocenti/mille-clip/0':'Нет проверенной таблицы именно Mille Clip; соседние Innocenti/Fiat не использованы как доноры.',
 'innocenti/mini-bertone/1':'Общий каталог Mini смешивает несколько кузовов и двигателей; строки не привязаны однозначно к этому поколению.',
 'innocenti/mini-bertone/2':'Общий каталог Mini не отделяет удлинённую ветвь 990 достаточно надёжно; данные короткого кузова не перенесены.',
 'innocenti/mini-bertone/3':'В общей таблице не подтверждена точная принадлежность двигателей ветви Small; топливо и объём не угаданы.',
 'innocenti/porter/0':'Нет собственной проверенной таблицы Innocenti Porter; данные Piaggio не перенесены.',
 'fisker/ocean/0':'Сохранённая спецификация относится к США; европейский документ ликвидатора содержит другие мощности, версии пока не согласованы.',
 'ac-cars/brooklands-ace/0':'Отдельная собственная спецификация ранней серии не проверена; страница клуба владельцев недоступна, параметры Rover/Ford не перенесены.',
 'ac-cars/brooklands-ace/1':'Отдельная спецификация поздней серии не проверена; серии 1993–1996 и 1997–2000 не объединялись.',
 'bellier/jade/0':'Не найдена быстро проверяемая собственная техническая таблица Jade; данные B8 не перенесены.',
 'bellier/opale/0':'Не найдена собственная спецификация Opale; данные других микрокаров не перенесены.',
 'borgward/bx7/0':'Не разделены надёжно немецкая BX7 TS и китайские исполнения; собственная европейская таблица не найдена.',
 'brilliance/bs4/0':'Для европейского BS4 не проверена собственная таблица, отделённая от китайских моторов Junjie.',
 'brilliance/bs4/1':'Европейские продажи универсала Junjie не подтверждены; наличие европейского седана не доказывает рынок универсала.'
};
assert.deepEqual(selected,prior.nextEuropeanScreenPass.slice(0,80));
const completed=selected.filter(r=>filled.has(key(r))).map(r=>({...r,engineRows:filled.get(key(r)).engines.length})),deferred=selected.filter(r=>!filled.has(key(r))).map(r=>{assert(reasons[key(r)],key(r));return{...r,reason:reasons[key(r)]};}),next=prior.nextEuropeanScreenPass.slice(80),byMake=Object.values(selected.reduce((a,r)=>{const b=a[r.make]??={make:r.make,reviewed:0,filled:0,rows:0,deferred:0};b.reviewed++;if(filled.has(key(r))){b.filled++;b.rows+=filled.get(key(r)).engines.length;}else b.deferred++;return a;},{})),p=prior.counts;
const summary={generationsReviewed:selected.length,generationsFilled:completed.length,newRows:changes.rows,deferred:deferred.length,nextEuropeanScreenPass:next.length,screenPassWholeReviewed:p.screenPassWholeReviewed+selected.length,screenPassWholeFilled:p.screenPassWholeFilled+completed.length,screenPassWholeDeferred:p.screenPassWholeDeferred+deferred.length,screenPassWholeNewRows:p.screenPassWholeNewRows+changes.rows,registeredWholePassFilled:63,registeredWholePassRows:134,registeredWholePassDeferred:72,zeroWholePassFilled:p.zeroWholePassFilled+completed.length,zeroWholePassRows:p.zeroWholePassRows+changes.rows,zeroWholePassDeferred:p.zeroWholePassDeferred+deferred.length,wholePassFilled:p.wholePassFilled+completed.length,wholePassNewRows:p.wholePassNewRows+changes.rows,totalPublicEngineRows:p.totalPublicEngineRows+changes.rows,screenHeld:926,undatedHeld:679,byMake};
write(batch+'/remaining-queue.json',{counts:summary,completed,deferred,allScreenPassCompleted:[...prior.allScreenPassCompleted,...completed],allScreenPassDeferred:[...prior.allScreenPassDeferred,...deferred],nextEuropeanScreenPass:next});write(batch+'/summary.json',summary);
fs.writeFileSync(batch+'/report.md',[
 `Пакет 5: рассмотрены **${selected.length}** поколений, добавлены **${changes.rows} строк в ${completed.length} поколений**, отложены **${deferred.length}**. В очереди остаются **${next.length}**.`,
 '', 'Использованы собственные спецификации, пресс-релизы и каталоги применяемости производителей, проверенные версии того же поколения и строгий резервный поиск. В каждой строке один источник. Выборка документированных версий не означает полный моторный ряд. Неизвестные значения оставлены пустыми; bhp/PS не пересчитывались, мощности компонентов не складывались.',
 '', 'Разделены старые и новые Alpina B7/B8/D4/D5, Lotus Evora/400 и Esprit V8, Ariel Nomad/Nomad 2, классический Morgan Plus 4 и новый Plus Four. Сохранены именно европейские Abarth и Mahindra. У Morgan Super 3 номинальные 1.5 л и точные 1432 см³ — разные поля.',
 '', 'Polestar 1: собственные [NL](https://www.polestar.com/nl/polestar-1/performance/) и [UK](https://www.polestar.com/uk/polestar-1/performance/) страницы противоречат друг другу: 448/441 кВт. Номинальные 2.0 л подтверждены, кВт оставлены пустыми; разные настройки двигателя этим противоречием не доказаны.',
 '', 'Найдена прежняя ошибка: trim G V12 900 One of Ten (2019) хранится под Brabus G W463 до2018. Новая строка двигателя662кВт добавлена к правильному W463A; прежний trim в этом пакете не перемещался. Источник: [BRABUS IAA2019](https://media.brabus.com/_Resources/Persistent/a/6/8/6/a686cd653804a75bb82aa6233beb50b0c639614f/PM%20BRABUS%20G%20V12%20900%20E.pdf).',
 '', 'Поколения, годы, кузова, рисунки, алиасы и статистика не менялись. Индекс карточек перестроен. Проверки: validation.json и qa-final.json.',
 '', '| Марка | Рассмотрено | Заполнено | Строк | Отложено |','|---|---:|---:|---:|---:|',...byMake.map(r=>`| ${r.make} | ${r.reviewed} | ${r.filled} | ${r.rows} | ${r.deferred} |`),
 '', 'Причины переноса:', '',...deferred.map(r=>`- ${key(r)}: ${r.reason}`),''
].join('\n'));console.log(summary);
