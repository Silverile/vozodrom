import fs from 'node:fs';
const root='analysis/codex/popular-engines-pass',batch=root+'/batch-2',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),queue=read(batch+'/remaining-queue.json');
for(const r of queue.deferred){const id=r.make+'/'+r.line;
 r.reason=['ford/f-150','dodge/caravan'].includes(id)||(id==='kia/optima'&&r.index===4)||(id==='chrysler/pacifica'&&r.index===1)
 ?'Европейская спецификация этой региональной ветви не подтверждена; данные иных рынков не перенесены.'
 :id==='mitsubishi/pajero-sport'?'Общая статья смешивает поколения; поздние строки KH0/QE исключены из первого K90/PA. Собственная европейская строка не подтверждена.'
 :id==='mercedes-benz/amg-gt'?'Название 53 в найденной карточке C192 вызывает сомнение; без независимого подтверждения строка удержана.'
 :'Проверены исходная статья и поиск технических спецификаций; собственное поколение, европейская применимость или явный кВт не подтверждены. См. research.log/spec.log.';
}
fs.writeFileSync(batch+'/remaining-queue.json',JSON.stringify(queue,null,2)+'\n');
const text=`## Пакет 2: линии с парком 100–999

Проверены 90 поколений; 129 новых моторных строк в 53 поколениях, 37 отложены с причинами. Следующие 170 непроверенных поколений: batch-2/remaining-queue.json; прежние 63 пропуска группы ≥1000 сохранены. Охват репрезентативный, не исчерпывающий.

Основные дополнения: RS6/RS3, Q8 e-tron, BMW i4/iX1, Peugeot 408, CLE/EQA, Lexus IS/LBX, Hiace, Interstar, Mascott, Evasion/806. Каждая строка имеет один источник. Неизвестные объём или системная мощность оставлены пустыми; компоненты гибридов не складывались.

Исправлена ошибка предыдущего пакета: семь поздних моторов удалены из CR-V I, добавлены собственные 2.0 16V 94/108 кВт. Парсер больше не считает общее слово модели кодом поколения; политика проверки отвергает непересекающиеся исходные годы. Аудит всех 11841 строк: таких противоречий больше нет.

Прежнее замечание SQ7 G8 закрыто: назначение G8 требует явного кода; год сам по себе не используется. Регрессия 124297 вариантов затронула только пять неоднозначных SQ7. Уже опубликованная статистика с удержанием 37 G8 не менялась. Вся статистика, структура поколений, кузова, годы, рисунки и псевдонимы сохранены.

Проверки: validate.mjs, run-engine-audit.mjs, test-attribution.py, test-sq7.py, тест доказательств технических версий, тест политики моторов, TypeScript — PASS. Результаты в batch-2/validation.json, parser-validation.json, match-validation.json и qa-final.json.
`;
fs.writeFileSync(batch+'/report.md','# Моторы популярных моделей — пакет 2\n\n'+text+'\n## Отложено\n\n'+queue.deferred.map(r=>`- ${r.make}/${r.line} [${r.index}] ${r.generation}: ${r.reason}`).join('\n')+'\n');
const p=root+'/report.md',s=fs.readFileSync(p,'utf8'),last=s.lastIndexOf('\n## ');if(last<0)throw Error('Missing previous appendix');fs.writeFileSync(p,s.slice(0,last)+'\n'+text);
