# Источники последнего кузовного пакета

Используются исходные технические документы производителей, в том числе сохранённые на публичных зеркалах. Наличие чисел в поисковой выдаче не означает подтверждения всех конфигураций. Табличные колонки и чертежи скачанных PDF проверены на изображениях; локальные копии, извлечённый текст и изображения находятся в игнорируемом final-rebuild/. Отдельный снимок baseline.json.gz также не предназначен для git.

## Решения по неоднозначным данным

- BMW: окончательные техлисты E90/E91 от 09/2005 имеют приоритет перед предварительным рекламным листом. Высота Touring отдельно без антенны/лижин; Coupé 335i не смешано с 325i/330i. Для E93 положение крыши и объём 350/210 л подтверждены [заводской пресс-картой](https://www.press.bmwgroup.com/austria/article/detail/T0026557DE/das-neue-bmw-3er-cabrio?language=de). У E46 300 л только при сложенном коробе крыши — прямая оговорка техлиста, не общий объём для любой крыши.
- Focus I: исходный шведский Ford-лист августа 1998, с запуском седана и универсала весной 1999. Число 1580 л универсала не использовано как базовый багажник без установленной позиции сидений.
- Mégane I: заводской сентябрьский прайс 1998 не содержит нужной таблицы размеров. Отдельный прайс Cabriolet 02/2001 даёт длину, высоту и VDA-багажник, но не колёсную базу и не определение ширины без зеркал. Состояние крыши при объёме прямо не уточнено — указано в примечании.
- Mégane IV: современный электрический Mégane E-Tech — другая модель; такой PDF исключён. Использованы ирландские документы Mégane IV 2021 и Grand Coupé MY2019. Объём 447 л только для указанного PHEV, 503 л VDA — седан.
- Audi A6: таблицы Avant для бензина и дизеля различаются по объёму. Указаны конкретно Avant 2.0 TDI и его заводские 565 л; 546 л седана не заменены более известной цифрой из другого источника.
- Ford Fiesta Mk6: PDF зеркала не скачался по TLS, открытие через web дало 502. Таблица оригинального Ford-техлиста доступна в индексированном тексте поиска: длина 3924, ширина явно без зеркал 1685, база 2486 мм. Диапазоны высоты и расположение сложной таблицы багажника не интерпретировались; они null.
- Proace City: заводские документы 10/2024 дают высоты 1860/1880 мм без установленного соответствия исполнению; высота null. У Caddy V одновременно две длины в схеме — также null. У cee’d JD длина трёхдверного кузова конфликтует с суммой базы и свесов — исправленная цифра не выведена.
- Sprinter W906: верхняя граница высоты незагруженного 4×2 для каждого указанного кузова, не единая высота всей модели и не 4×4. Размеры пассажирского Crewbus из фургона не выводились.
- Caddy/Berlingo/Proace, Trafic: занятые ряды, верхняя граница загрузки, VDA или метод без уточнения указаны в noteCs. Грузовые м³ исключены из пассажирского trunkL. У Trafic II завод прямо описывает полностью занятый Combi и загрузку до крыши: 0,7/2,2 м³ переведены в литры с этой оговоркой.

## Рассмотренные поколения

| Поколение | Исполнений | Источники чисел |
| --- | ---: | --- |
| volkswagen/transporter/5 | 4 | [документ](https://manuals.plus/m/667f011e53eb5bfbc5ce248ea55dd20f489cc723df61b1e75b43d358701f2cba) |
| bmw/rada-3/4 | 6 | [документ](https://treffseiten.de/bmw/info/daten_320i_325i_330i_320d_limousine_05_09.pdf), [документ](https://treffseiten.de/bmw/info/daten_320i_325i_330i_touring_05_09.pdf), [документ](https://treffseiten.de/bmw/info/daten_325i_330i_335i_coupe_06_09.pdf), [документ](https://www.treffseiten.de/bmw/info/daten_3er_cabrio_320i_325i_330i_335i_07_01.pdf), [документ](https://www.press.bmwgroup.com/austria/article/detail/T0026557DE/das-neue-bmw-3er-cabrio?language=de) |
| volkswagen/golf/5 | 4 | [документ](https://xr793.com/wp-content/uploads/2022/12/2011-VW-Golf-Hatch-UK.pdf), [документ](https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/golf-mk-6-2009-2013/vw_golf_estate_2009-2013_Feb_2011.pdf) |
| dacia/dokker/0 | 2 | [документ](https://presse.dacia.de/dacia-dokker-familienfreund-mit-grossem-platzangebot/?lang=deu) |
| kia/ceed/0 | 3 | [документ](https://www.kia.com/content/dam/kwcms/kme/se/sv/assets/contents/forms/brochure/pdf/instruktionsbocker/ceededfllguppl.pdf) |
| renault/megane/0 | 5 | [документ](https://www.auto-preisliste.de/download-preislisten-aller-marken/59-renault/2401-renault-megane-1995-2003/35695-2001-02-preisliste-renault-megane-cabriolet) |
| citroen/berlingo/0 | 2 | [документ](https://xr793.com/wp-content/uploads/2022/09/2006-Citroen-Berlingo-Multispace-Tech-Specs-UK.pdf) |
| skoda/1000-1100-mb/0 | 2 | [документ](https://www.skoda-storyboard.com/en/press-releases/55-years-of-the-skoda-1000-mb-the-first-czech-mass-produced-car-celebrates-its-anniversary/) |
| kia/ceed/1 | 3 | [документ](https://preprod2-press.kia.com/content/kiapress/ie/en/home/media-resouces/press-releases/2015/15_08_31_35---kia-ceed-upgrade.html) |
| ford/fiesta/5 | 3 | [документ](https://xr793.com/wp-content/uploads/2022/09/2011.75-Ford-Fiesta-UK.pdf) |
| bmw/rada-3/3 | 5 | [документ](https://treffseiten.de/bmw/info/daten_318i.pdf), [документ](https://www.treffseiten.de/bmw/info/daten_318ti_320td_compact.pdf) |
| ford/focus/0 | 3 | [документ](https://fordclubsweden.se/forum/download/file.php?id=50844) |
| volkswagen/golf-plus-line-models-auto-slug-golf-plus-has-no-line-or-card/0 | 2 | [документ](https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/golf-plus/vw_golf_plus_aug_2011.pdf) |
| ford/mondeo/2 | 3 | [документ](https://www.scribd.com/doc/82207569/Ford-Mondeo-Sales-Brochure-May-2005) |
| audi/a4/3 | 2 | [документ](https://xr793.com/wp-content/uploads/2022/10/2009-Audi-A4-S4-UK.pdf) |
| renault/clio/2 | 3 | [документ](https://presse.renault.de/dynamisch-sicher-vielseitig/?lang=deu) |
| toyota/proace/1 | 2 | [документ](https://media.toyota.co.uk/wp-content/uploads/sites/5/pdf/220321M-Proace-Verso-Tech-Spec.pdf) |
| seat/leon/2 | 2 | [документ](https://mundoseat.seat.com/mediacenter_netstor/seat-media-center/global_site/documents/Leon-ST/fr/Tarifs_SEAT_Nouvelle_LEON_2017.2_au_2_juin_2017.pdf) |
| ford/fiesta/4 | 2 | [документ](https://www.ford-fiesta-club.de/Fiesta05.pdf) |
| ford/transit-custom/0 | 4 | [документ](https://xr793.com/wp-content/uploads/2020/09/2018-Ford-Transit-Custom-UK.pdf) |
| audi/a3/1 | 3 | [документ](https://xr793.com/wp-content/uploads/2022/10/2008-Audi-A3-S3-UK.pdf) |
| citroen/berlingo/2 | 5 | [документ](https://www.sueverkruep.de/citroen/wp-content/uploads/sites/6/2019/11/Preisliste_Berlingo_16.pdf) |
| mercedes-benz/sprinter/1 | 10 | [документ](https://blog.le-parnass.com/catalogue_pdf/mercedes-benz_sprinter_201409_e.pdf) |
| volkswagen/caddy/3 | 3 | [документ](https://xr793.com/wp-content/uploads/2022/12/2016-VW-Caddy-UK.pdf) |
| renault/megane/3 | 3 | [документ](https://cdn.group.renault.com/ren/ie/transversal-assets/brochures/car-ebrochures/MEGANE-eBrochure.pdf), [документ](https://nd-mediagallery2-public-production.s3.amazonaws.com/4511e2c8ea2659c03f7e2e3cbbd70fc5/kearys_renault_megane_grand_coupe_brochure.pdf) |
| toyota/proace-city/0 | 3 | [документ](https://media.toyota.co.uk/the-toyota-proace-city-a-new-compact-van-to-strengthen-toyotas-lcv-line-up/) |
| mercedes-benz/trida-v/2 | 3 | [документ](https://blog.le-parnass.com/catalogue_pdf/mercedes-benz_v-class_201609_g.pdf) |
| volkswagen/caddy/4 | 5 | [документ](https://www.volkswagen-vans.co.uk/idhub/content/dam/onehub_nfz/importers/gb/downloads/brochures/caddy-life/caddy_life-brochure.pdf) |
| audi/a6/2 | 2 | [документ](https://xr793.com/wp-content/uploads/2022/10/2008-Audi-A6-S6-UK.pdf) |
| renault/trafic/1 | 3 | [документ](https://presse.renault.de/attraktives-multitalent/?lang=deu) |
| dacia/logan/1 | 2 | [документ](https://cdn.group.renault.com/dac/ie/transversal-assets/brochures/model-brochures/logan-mcv-stepway-oct.pdf) |
| renault/trafic/2 | 4 | [документ](https://www.user-manual.renault.com/fr/chapitre6-caract%C3%A9ristiques-techniques/dimensions-en-metres-10) |
| peugeot/partner/1 | 3 | [документ](https://www.media.stellantis.com/de-de/peugeot/press/die-neuen-peugeot-partner-und-partner-tepee-robust-und-technisch-durchdacht) |

Пофактные источники, якоря таблиц и условия находятся в variants.json и bodyVariantEvidence исходных карточек. Полная матрица null и объяснений — cumulative-review.json. Покрытие ограничено перечисленными референсами, не всеми годами, моторами и комплектациями поколения.
