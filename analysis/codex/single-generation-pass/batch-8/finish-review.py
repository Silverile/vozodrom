import pathlib,json,sys
sys.stdout.reconfigure(encoding='utf-8')
root=pathlib.Path('analysis/codex/single-generation-pass/batch-8')
def read(p):return json.loads(pathlib.Path(p).read_text(encoding='utf-8-sig'))
def write(p,x):pathlib.Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
old=read(root.parent/'batch-7/remaining-queue.json');queries=read(root/'search-queries.json');searches=read(root/'search-results.json')
by_id={x['id']:x for x in searches};assert len(by_id)==88
confirmed={
 'mahindra/mm-540':{'url':'https://mahindramuseum.in/page/9/','reason':'Музейная история выделяет собственную семью MM540DP/MM550DP 1985–2005; изменение обозначения после 1994 и указателей в 1989 не является новой конструкцией. Общая история Jeep не использована.'},
 'mahindra/540-bahia':{'url':'https://mahindramuseum.in/2021/10/30/mahindra-540/','reason':'Отдельная экспортная конструктивная семья 540/Bahia/Indian Chief на базе CJ540DP, греческая сборка с 1988. Не смешана с индийской MM540. Нет точного конца: «начало 1990-х» не превращено в конкретный год.'},
 'ginetta/f400':{'url':'https://www.ginetta.org/index.php/history/model-index/2010-s/f400','reason':'Клубная модельная история подтверждает одну конструкцию F400 под Ginetta с 2010. Предыдущие Farboud/Farbio и отдельно названная G60 не продлевают её период. Неизвестный собственный конец остаётся пустым.'},
 'maybach/landaulet':{'url':'https://group.mercedes-benz.com/documents/investors/reports/annual-report/daimler/daimler-ir-annualreport-2008.pdf','reason':'Заводской отчёт, печатная стр. 92 (PDF 96), выделяет одну закaзную Landaulet: изготовление с начала 2008 после концепта 2007. Пустой точный конец не мешает подтвердить одну конструкцию; период всей 57/62 не перенесён.'}
}
overrides={
 'microcar/m-go':'ADAC относит версии 2016/2019 к рестайлингам первой генерации, но полная связь ранней 2008 и поздних технических версий ещё не установлена. Смешанные trims не распределены по неподтверждённым границам.',
 'mazda/az-wagon':'Заводские релизы подтверждают собственные Mazda с 1994 и полные переделки 1998/2003/2008; найденные даты являются запуском продаж. Нужна карта календарной серии и собственных кодов/моторов всех четырёх Mazda, а не ранние Suzuki.',
 'dodge/senior-six':'Клубная заводская таблица прочитана: начало 2249 в мае 1927, 2252 с июля 1928 и DB с июля 1929. Полная связь 2251/DB с конструкциями Senior и распределение кузовов не доказаны; не закрыто одним интервалом.',
 'dodge/standard-six':'Таблица по серийным номерам подтверждает 140/141 с февраля 1928 и записи до декабря 1928. Последняя строка таблицы не обозначена последним изготовленным автомобилем; собственный конец и набор кузовов не установлены.',
 'dodge/victory-six':'Таблица по серийным номерам подтверждает 130/131 с ноября 1927 и записи до декабря 1928. Это не полный доказанный конец серии; нужна собственная карта кузовов и последних производственных номеров.'
}
pending=[]
for row in old['reviewedPending']:
 id=row['make']+'/'+row['line'];assert id in by_id
 if id in confirmed:continue
 reason=overrides.get(id,row['reason'])
 if row['make']=='hotchkiss':reason='Поиск нашёл индексируемые клубные таблицы по кузовам/годам, но полная страница вновь вернула 403/тайм-аут. Для этого типа не установлены собственные календарные границы и точный набор кузовов; чужие моторы/годы не скопированы.'
 pending.append({**row,'reason':reason,'lastAttempt':{'query':by_id[id]['query'],'leadSources':by_id[id]['sources'],'status':'deferred','note':'URLs are search leads; their presence does not establish facts or complete generation boundaries.'}})
q={**old,'confirmedSingleGeneration':old['confirmedSingleGeneration']+list(confirmed),'remaining':len(pending),'reviewedPending':pending,'unreviewed':0,'lines':[{k:v for k,v in x.items() if k not in ('reason','lastAttempt')} for x in pending],'finalAttemptCompleted':True}
assert len(q['completedSplits'])==79 and len(q['confirmedSingleGeneration'])==184 and len(pending)==84
assert len(q['completedSplits'])+len(q['confirmedSingleGeneration'])+len(pending)==347
write(root/'resolutions.json',{'reviewed':88,'newSplits':0,'confirmedFamilies':confirmed,'catalogueGenerationFieldsChanged':False,'note':'Four existing scoped families confirmed; unknown exact end dates and technical facts remain unknown.'})
write(root/'deferred.json',pending);write(root/'remaining-queue.json',q)
groups=[];used=set()
def group(reason,ids):
 ids=[i for i in ids if any(x['make']+'/'+x['line']==i for x in pending)]
 if ids:groups.append((reason,ids));used.update(ids)
us={'amc','buick','cadillac','chevrolet','gmc','mercury','oldsmobile','packard','pontiac'}
group('Не хватает календарных производственных границ каждой конструкции и безопасного распределения фото/моторов; модельные годы и данные другого бренда не подставлены', [x['make']+'/'+x['line'] for x in pending if x['make'] in us and x['line']!='model-f-g' and x['line']!='model-f'])
group('Публичные клубные таблицы найдены поиском, но полный текст недоступен (403/тайм-аут); нет собственной карты календарной серии и кузовов', ['hotchkiss/'+x for x in ['411','413','615','620','l','o','t','type-c','v','z']])
group('Маркетинговые циклы/номера версий не доказывают смену конструкции; ранние и поздние технические версии требуют отдельной привязки', ['microcar/m-go','microcar/mc1','aixam/city','aixam/crossline','aixam/crossover','aixam/mac'])
group('Параллельные исполнения и донорские названия ещё не разнесены по собственным конструкциям и календарным периодам', ['byd/f3','changan/benben','changan/star','dongfeng/a60','forthing/lingzhi'])
group('Нужны собственные периоды конкретной марочной версии; даты донора, продаж или общей компании недостаточны', ['dacia/2000','dacia/d6','dodge/attitude','fiat/marengo','hyundai/cortina','mazda/az-wagon','mazda/e-series','plymouth/colt'])
group('Есть анонсы или неполные сведения о выпуске; нет проверенной карты собственной серии и её границ', ['derways/land-crown','derways/plutus','derways/saladin','great-wall/cc513','hindustan-motors/veer'])
group('Таблица реальных дат прочитана; остаётся проверить полное окончание серии, её конструктивную сферу и кузова', ['dodge/senior-six','dodge/standard-six','dodge/victory-six'])
for row in pending:
 id=row['make']+'/'+row['line']
 if id not in used:group(row['reason'],[id])
assert used=={x['make']+'/'+x['line'] for x in pending}
stats=read(root/'statistics.json') if (root/'statistics.json').exists() else None
measurement=read(root/'mazda-measurement.json')
stats_text=(f"Пересчёт Mazda: полные {stats['days']} дня истории STK до отбора марки; парк марки {stats['makeFleet']:,}, её итоги и {stats['unrelatedMazdaLinesPreserved']} посторонних модельных строк сохранены. B-Series впервые опубликована: 98 машин, UN — 88; UF — 10, поэтому её парк ниже порога 30 и не публикуется. Осмотров B-Series — {stats['bSeriesAfter'].get('stk',{}).get('inspections','ниже порога')}." if stats else 'Итоговый пересчёт Mazda выполняется; публикационные проверки ещё не завершены.')
report='''# Итог проверки одиночных поколений

Просмотрены все 347 исходных кандидатов. Закрыта структурная проверка 263 моделей: **79 разделений и 184 сохранённых конструктивных семейства**. После повторного поиска по всем 88 ранее отложенным закрыты ещё четыре семьи; 84 случая остаются отложенными с причинами ниже. Это не заявление о полноте всех моторов, кузовов и рынков.

| Пакет | Разделено моделей | Сохранено семейств |
|---|---:|---:|
| 1, BMW 7 | 1 | 0 |
| 2 | 8 | 3 |
| 3 | 12 | 13 |
| 4 | 14 | 3 |
| 5 | 14 | 57 |
| 6 | 17 | 50 |
| 7 | 13 | 54 |
| 8, заключительная проверка | 0 | 4 |
| **Всего** | **79** | **184** |

BMW 7 теперь содержит E23, E32, E38, E65/E66, F01/F02, G11/G12 и G70; основной парк ≥100 обработан пакетами 1–4. Разделены также BMW X1/X6/8, Opel Vivaro/Movano/Combo/Omega, Citroën Jumpy, Nissan Patrol/Pathfinder и другие семьи. Полные перечни разделённых и сохранённых моделей: [итоговая очередь](batch-8/remaining-queue.json); доказательства изменений — в отчётах batch-1–7. В каталоге 11 137 строк двигателей; неподтверждённые мощности, даты и комплектации оставлены пустыми.

У разделений добавлены aliases с candidates для старых идентификаторов. Рисунки, holds, фото и технические профили перенесены по проверенной конструкции; размеры UP10 не скопированы в Publica P30, фото Ray относится к фазе 2017. Пересчёты выполнялись пакетами с полной историей VIN перед отбором марок. Редкие группы сохраняют порог публикации 30.

Заключительная проверка подтвердила:

'''
for id,fact in confirmed.items():report+=f"- `{id}` — {fact['reason']} [Источник]({fact['url']}).\n"
report+='''
У Mazda добавлены восемь написаний B2000/B2200/B2500/B2600 (слитно и с пробелом), подтверждённых [каталогом производителя DBA](https://dba.com.au/wp-content/uploads/2022/07/DBA-Off-Road-AWD-Catalogue-2021.pdf). Его годы применяемости запчастей не использованы как годы производства. Полный скан 19 429 934 строк реестра нашёл 98 ранее несопоставленных действующих автомобилей, включая 95 дизельных B2500; североамериканских WMI среди 98 нет. Американские B2300/B3000/B4000 не добавлены. Само обозначение B2500 встречалось и в Северной Америке, поэтому результат для нынешнего парка не доказывает однозначность любой будущей записи.

'''+stats_text+'\n\nОтложенные случаи (полный индивидуальный журнал причин, запросов и найденных ссылок — [deferred.json](batch-8/deferred.json); ссылки поисковой выдачи сами по себе не считаются доказательствами):\n\n'
for reason,ids in groups:report+='- '+', '.join('`'+i+'`' for i in ids)+' — '+reason.rstrip('.')+'.\n'
report=report.replace('в отчётах batch-1–7','в исходных материалах BMW 7 и отчётах batch-2–7').replace('закaзную','заказную')
report+='\nПроверки и ограничения: итоговые результаты пакета — [validation.json](batch-8/validation.json). Старый общий валидатор сохраняет прежнее расхождение 6950/7470 в историческом снимке; его assertion не изменён. Сборка интерфейса и развёртывание в этот проход не выполнялись.\n'
(root.parent/'report.md').write_text(report,encoding='utf-8')
(root/'report.md').write_text('Заключительная проверка: 88 повторных поисков, четыре подтверждённых конструктивных семейства, 84 отложенных. Календарные/технические поля четырёх семей не изменялись.\n\n'+stats_text+'\n\nПодробности и полный список причин: [общий заключительный отчёт](../report.md).\n',encoding='utf-8')
print('Final review: 79 split + 184 retained + 84 deferred = 347; source attempt coverage 88/88; Mazda stats', 'complete' if stats else 'pending')
