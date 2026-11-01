import fs from 'node:fs';
const root='analysis/codex/popular-engines-pass',batch=root+'/batch-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),changes=read(batch+'/engine-changes.json'),before=read(root+'/batch-2/remaining-queue.json'),completed=[],deferred=[];
function reason(r){const id=r.make+'/'+r.line;
 if(id==='nissan/pulsar')return 'Указанная ветвь не является европейским C13, уже имеющим моторы. Отдельные японские/австралийские спецификации и VZ-R N1 не перенесены без подтверждения европейской версии.';
 if(id==='nissan/bluebird'&&r.index===8)return 'U12 нельзя заполнять европейским T12: совпадающие годы скрывали разные коды. Найденная строка T12 исключена; собственная европейская U12 не подтверждена.';
 if(id==='nissan/bluebird'&&r.index>=9)return 'Региональная U13/U14 не смешана с европейскими T12/Primera. Собственная европейская спецификация не подтверждена.';
 if(id==='nissan/bluebird')return 'В общей таблице ранних 410/510/610 не установлена европейская применимость отдельных мощностей и норм. Подтверждённые EU-колонки 810/910/U11 добавлены отдельно.';
 if(id==='mitsubishi/lancer-evolution-i-x')return 'Для этого поколения не подтверждена собственная европейская серийная спецификация. JDM, FQ, гоночные и колёсные мощности не перенесены. VI/IX/X с отдельными европейскими данными заполнены.';
 if(id==='nissan/vanette')return 'Европейские HC23/Cargo и японские C22/S20/S21 нельзя считать одной спецификацией. Собственное соответствие двигателя выбранному коду не подтверждено.';
 if(id==='moskvic/2137')return 'Запрос отдельной статьи перенаправляется на 2140. Данные седана без отдельного подтверждения универсала 2137 не скопированы.';
 if(id==='aro/10')return 'Собственный технический источник по серии 10/11 не найден; запрос DE-статьи вернул 404. Моторы иных ARO и разных региональных сборок не перенесены.';
 return 'Европейская спецификация этой региональной ветви не подтверждена. Двигатели американских, китайских, латиноамериканских или иных тёзок не перенесены; протоколы в research.log/spec.log.';
}
for(const r of read(batch+'/selection.json')){const c=changes.changes.find(x=>x.id===r.make+'/'+r.line&&x.index===r.index);if(c)completed.push({...r,engineRows:c.engines.length});else deferred.push({...r,reason:reason(r)});}
write(batch+'/remaining-queue.json',{originalFleet100To999:260,reviewedThisBatch:90,reviewedCumulative:180,completed,deferred,previousFleet100To999Deferred:before.deferred,previousFleet1000Unresolved:before.previousFleet1000Unresolved,nextFleet100To999:read(batch+'/untouched-queue.json')});
const text=`## Пакет 3: следующая часть линий с парком 100–999

Проверены следующие 90 поколений. Добавлены ${changes.rows} моторных строк в ${changes.generations} поколений; ${deferred.length} отложены с причинами. За два пакета этой группы проверены 180 из 260 поколений: 101 заполнено, 79 отложены. Следующие 80 непроверенных: batch-3/remaining-queue.json. Прежние 63 пропуска группы ≥1000 сохранены отдельно.

Основные дополнения: четыре поколения Continental GT, Vaneo/CL, Cerato LD, Nubira J200, Avensis Verso, Demio/Tribute, Zafira Life/Campo, CX/C6/C5 X, Alfa 145/146/Tonale, DS7, RS5 I–III, BMW XM, Seal U DM-i. Охват репрезентативный, не полный перечень моторов. Каждый ряд имеет один источник; невыясненные объём и мощность оставлены пустыми. Системные мощности PHEV проверены отдельно от ICE и электромоторов.

Исправлен один ряд предыдущего пакета: GLE Coupé C167 ошибочно получил спецификацию SUV V167. Теперь указан собственный заводской источник Coupé; 48-вольтовый EQ Boost отражён как MHEV. Выход всей системы оставлен неизвестным: 320 кВт ICE и 16 кВт boost не сложены. Новая проверка запрещает подмену явных кодов шасси при близких годах; известное обозначение Sprinter VS30 / BR907 разрешено только с явным номером серии. Найденный кандидат Bluebird T12 исключён из U12.

Даты, коды поколений, кузова, комплектации, рисунки, псевдонимы и вся статистика сохранены; пересборка статистики не требуется. Проверки — PASS: сверка всех 4753 карточек, аудит 12000 моторных строк, все 92 опубликованные спецификации с доказательством поколения, 3109 строк с исходными годами, семь регрессий выбора шасси, тест доказательств комплектаций, тест политики моторов, TypeScript. Подробности: batch-3/validation.json, qa-final.json и chassis-validation.json.
`;
fs.writeFileSync(batch+'/report.md','# Моторы популярных моделей — пакет 3\n\n'+text+'\n## Отложено\n\n'+deferred.map(r=>`- ${r.make}/${r.line} [${r.index}] ${r.generation}: ${r.reason}`).join('\n')+'\n');
const p=root+'/report.md',s=fs.readFileSync(p,'utf8'),marker='\n## Пакет 3:';fs.writeFileSync(p,(s.includes(marker)?s.slice(0,s.indexOf(marker)):s.trimEnd())+'\n\n'+text);
console.log({reviewed:completed.length+deferred.length,filled:completed.length,deferred:deferred.length,next:80});
