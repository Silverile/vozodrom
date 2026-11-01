import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/rare-engines-pass/batch-1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),selected=read(root+'/selection.json'),changes=read(root+'/engine-changes.json'),done=new Map(changes.changes.map(r=>[r.id+'/'+r.index,r]));
const reasons={
 'great-wall/wingle':'Найденные сведения относятся к разным экспортным рынкам; европейское исполнение каждого Wingle 3/5/6/7 с точными характеристиками пока не подтверждено.',
 'mazda/mx-6':'GD в Европе продавался как 626 Coupé; привязка европейских спецификаций именно к карточке MX-6 требует отдельной проверки названий.',
 'pontiac/trans-sport':'Карточка объединяет семейство без проверенного деления; найденные моторы нельзя надёжно распределить по европейским годам и исполнениям.',
 'fiat/argenta':'В карточке нет датированного поколения или кода; найдены общие характеристики Argenta, но строгая годовая привязка моторных строк не подтверждена.',
 'honda/integra':'Недатированная общая карточка охватывает разные Integra; нужны подтверждённые европейские поколения, а не общий набор моторов.',
 'infiniti/g':'Для P10/P11/V35 найдены североамериканские G20/G35; европейская применимость этих версий не подтверждена. Проверенный европейский G37 добавлен отдельно.',
 'fiat/1300':'Общая недатированная карточка 1300/1500; найденный объём 1300 не подтверждает годы и весь европейский моторный ряд этой записи.',
 'skoda/rapid-1935':'Довоенная модельная семья отложена согласно приоритету; быстрого однозначного технического источника не найдено.',
 'nissan/pick-up':'Pick Up объединяет разные шасси и поколения; перенос общего набора бензиновых и дизельных моторов был бы неоднозначным.',
 'cadillac/seville':'Недатированное семейство нескольких поколений; европейские исполнения и годовая привязка требуют структурного уточнения.',
 'chevrolet/avalanche':'Запись 2001–2013 охватывает несколько исполнений; найденные данные преимущественно для других рынков, европейская применимость не подтверждена.',
 'plymouth/voyager':'AB — ранний полноразмерный североамериканский фургон, а не европейский минивэн Chrysler; подходящая европейская спецификация не подтверждена.',
 'fiat/132':'Недатированная карточка: общая история упоминает разные двигатели, но достаточной привязки отдельных европейских моторных строк к этой записи нет.',
 'fiat/duna':'Совмещены Duna, Prêmio и Elba разных рынков; быстрый источник с однозначным европейским исполнением не найден.',
 'citroen/c25':'Источник перенаправляет на многомарочную таблицу Ducato. В ней есть C25, но недатированная общая запись пока не даёт строгой привязки моторных строк.',
 'ford/bronco-sport':'Найдены характеристики других рынков; европейская рыночная применимость отдельного Bronco Sport не подтверждена.',
 'honda/shuttle':'Название может означать Civic Shuttle, Odyssey/Shuttle или более позднюю японскую модель; недатированная карточка не разрешает эту неоднозначность.',
 'nissan/laurel':'Историческое семейство без датированного поколения; европейские годы/шасси пока не установлены.',
 'daihatsu/rocky':'Для старой семьи нужны точные европейские исполнения Rocky/Rugger; новая DNGA-ветвь относится к другим рынкам, европейская применимость не подтверждена.',
 'datsun/cherry':'Для F10 недостаточно однозначной европейской технической таблицы; данные E10/N10 и версии других рынков не скопированы.',
 'dodge/avenger':'Для купе найдены преимущественно региональные характеристики; европейская спецификация данного поколения пока не подтверждена.',
 'chevrolet/trailblazer':'Недатированное семейство TrailBlazer/Trailblazer включает существенно разные автомобили; нужен точный европейский тип.',
 'dodge/magnum':'Три ветви USA B-body, Brazil/Mexico и LX требуют отдельных региональных источников; европейские исполнения пока не подтверждены.',
 'byd/song-pro':'Совокупная региональная семья; нельзя переносить характеристики европейского BYD другого названия без явной атрибуции.',
 'chevrolet/lumina':'Недатированное семейство и различия рынков; европейское исполнение и моторный ряд пока не подтверждены.',
 'dodge/viper':'Пять поколений: найдены преимущественно мощности в hp других рынков; явные европейские кВт и объёмы по каждому поколению пока не подтверждены.',
 'gaz/gazelle-next':'Найдены региональные варианты, но европейское исполнение с явными объёмом и кВт не подтверждено быстрым источником.',
 'aston-martin/vantage':'Страница производителя для Vantage 1993 содержит спорный объём 5430 см³ и мощность только в bhp; неоднозначные числа не внесены.',
 'infiniti/m':'Y34 M45 и Y50 M35/M45 в найденных источниках относятся преимущественно к другим рынкам; нельзя переносить европейские моторы следующего Y51.',
 'chevrolet/trans-sport':'Недатированная карточка Chevrolet; спецификация Pontiac Trans Sport другого года/марки не считается достаточной атрибуцией.',
 'peugeot/404':'Найденные значения смешивают SAE/DIN и региональные исполнения. Быстрая проверка не дала однозначного европейского моторного набора без пересчётов.',
 'microcar/virgo':'Недатированная семья; подходящего быстрого источника, связывающего конкретный двигатель с этой записью, не найдено.',
 'daihatsu/trevis':'Первая запись относится к раннему Mira Gino; спецификация европейского Trevis 2006–2009 добавлена только во вторую запись.'
};
const completed=[],deferred=[],attempts=read(root+'/default-candidates.json'),spec=read(root+'/spec-candidates.json'),manual=read(root+'/manual-attempts.json');
for(const r of selected){const id=r.make+'/'+r.line,c=done.get(id+'/'+r.index);if(c){completed.push({...r,engineRows:c.engines.length});continue;}assert(reasons[id],id);deferred.push({...r,reason:reasons[id],attemptedSources:[...new Set([...attempts,...spec].filter(x=>x.make===r.make&&x.line===r.line&&x.index===r.index).flatMap(x=>(x.attempts??[]).map(a=>a.url)).concat(manual.filter(x=>x.id===id).map(x=>x.url)))]});}
assert.equal(completed.length+deferred.length,90);
const queue={counts:{reviewed:selected.length,generationsFilled:completed.length,engineRows:changes.rows,deferred:deferred.length,nextUnreviewed:read(root+'/untouched-queue.json').length},completed,deferred,nextRegistered1To99:read(root+'/untouched-queue.json'),zeroMatchedFleetQueue:'../queue.json: zeroModernCandidates; European-market source review required before admission',zeroDateUnconfirmedQueue:'../queue.json: zeroDateUnconfirmed; dates and European-market eligibility unconfirmed'};
write(root+'/remaining-queue.json',queue);
const lines=['Пакет 1: проверено '+selected.length+' поколений; заполнено '+completed.length+'; добавлено '+changes.rows+' строк; отложено '+deferred.length+'; ещё не проверено '+queue.counts.nextUnreviewed+'.','','Отложенные записи и причины:','',...deferred.map(r=>`- ${r.make}/${r.line} [${r.index}] (${r.generation}): ${r.reason}`)];
fs.writeFileSync(root+'/report.md',lines.join('\n')+'\n');console.log(queue.counts);
