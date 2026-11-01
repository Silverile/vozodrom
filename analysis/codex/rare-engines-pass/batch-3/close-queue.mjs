import fs from 'node:fs';
const root='analysis/codex/rare-engines-pass',batch=root+'/batch-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n'),selected=read(batch+'/selection.json'),changes=read(batch+'/engine-changes.json'),market=read(root+'/market-filter.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,filled=new Map(changes.changes.map(r=>[key(r),r]));
const reasons={
 'chevrolet/alero/0':'Европейский шильдик подтверждён, но таблица перенаправляет на Oldsmobile; европейское исполнение двигателя отдельно не установлено.',
 'chevrolet/beretta/0':'Не удалось отделить документированные европейские исполнения от американской моторной гаммы.',
 'chevrolet/corsica/0':'Не удалось отделить документированные европейские исполнения от американской моторной гаммы.',
 'mg/express/0':'Коммерческая версия: источник именно Express не найден; моторы ZR автоматически не переносились.',
 'mg/mg5/2':'Поколение в карточке — седан Roewe i5; европейский MG5 EV — универсал другой ветви. Требуется отдельное исправление структуры.',
 'mini/classic/4':'Источник Mayfair пересекает несколько периодов; точная привязка исполнения к Mk V не подтверждена.',
 'mini/classic/5':'Технические данные SPi найдены без достаточной привязки к периоду Mk VI.',
 'moskvic/2141/0':'Экспортное семейство установлено, но характеристики конкретных европейских исполнений не подтверждены.',
 'daewoo/evanda/0':'Общая таблица Chevrolet/Magnus не отделяет европейский Daewoo периода 2002–2004.',
 'daewoo/honker/0':'Смешаны периоды Tarpan/Daewoo и последующие производители; мотор конкретного периода не подтверждён.',
 'daewoo/lacetti/0':'Не завершена проверка европейского исполнения и разграничения Lacetti/Nubira.',
 'daewoo/lublin/0':'Общая таблица пересекает период Daewoo 1996–2001 и другие марки; автоматический перенос исключён.',
 'isuzu/piazza/0':'Не подтверждено отдельное европейское исполнение в пределах выбранного поколения.',
 'maserati/spyder/1':'Источник Spyder 90 найден, но проверка точного исполнения и характеристик не завершена.',
 'maserati/spyder/2':'Spyder III отделён по периоду, но значение мощности в кВт отдельно не подтверждено; пересчёт hp не выполнялся.',
 'aro/spartana/0':'Надёжная техническая таблица собственного европейского исполнения не найдена.',
 'bentley/azure/1':'Источник второго поколения найден, но проверка характеристик именно Azure II не завершена.'
};
const completed=selected.filter(r=>filled.has(key(r))).map(r=>({...r,engineRows:filled.get(key(r)).engines.length})),deferred=selected.filter(r=>!filled.has(key(r))).map(r=>{if(!reasons[key(r)])throw Error('Missing reason '+key(r));return {...r,reason:reasons[key(r)]};});
const summary={generationsReviewed:selected.length,generationsFilled:completed.length,newRows:changes.rows,deferred:deferred.length,pendingScreened:1218,screenPass:292,screenHeld:926,makesPassing:75,nextEuropeanScreenPass:market.pass.slice(80).length,registeredWholePassFilled:63,registeredWholePassRows:134,registeredWholePassDeferred:72,zeroWholePassFilled:17+completed.length,zeroWholePassRows:45+changes.rows,wholePassFilled:80+completed.length,wholePassNewRows:179+changes.rows,totalPublicEngineRows:12318+changes.rows,undatedHeld:679};
write(batch+'/remaining-queue.json',{counts:summary,completed,deferred,nextEuropeanScreenPass:market.pass.slice(80)});write(batch+'/summary.json',summary);
const text=['Пакет 3: предварительный фильтр всех 1218 оставшихся записей выполнен до исследования моторов. Допущены 292 записи (75 марок), отложены 926. Это консервативная сортировка приоритетов, а не документальное доказательство продаж каждой модели в Европе. Полная таблица по маркам: `../market-filter-report.md`.','',`Из первых ${selected.length} допущенных поколений заполнены ${completed.length}: добавлены ${changes.rows} моторных строк. Отложены ${deferred.length}, в очереди остаются ${market.pass.length-selected.length}. Порядок — по парку марки в чешском реестре.`, '', 'У каждой строки один источник; неизвестные величины пусты, мощность гибридов берётся для системы без сложения компонентов. Поколения, годы, кузова, алиасы, рисунки и статистика не менялись. Европейский MG5 EV не перенесён в карточку седана Roewe i5.','', 'Причины переноса:', '',...deferred.map(r=>`- ${key(r)}: ${r.reason}`),''];fs.writeFileSync(batch+'/report.md',text.join('\n'));console.log(summary);
