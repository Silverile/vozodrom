# Продолжение

Очередь: `remaining-queue.json → nextBodyVariants`, 33 поколения. Следующее — Volkswagen Transporter T6 (index 5), затем BMW E90, Golf VI, Dokker. Эти поколения в этом пакете не изменены.

Найденные первичные документы для T6, ещё не принятые в данные:

- [Заводской UK чертёж T6.1](https://www.volkswagen-vans.co.uk/idhub/content/dam/onehub_nfz/importers/gb/downloads/dimensions/Dimension-Drawings-Transporter_6_1.pdf): веб-индекс показывает длины 4904/5304, базу 3000/3400, ширину 1904, низкую/высокую крышу. Локальная загрузка вернула 403; прочитать сноски до использования.
- [Shuttle UK 27.07.2020, заводской каталог на зеркале](https://manuals.plus/m/667f011e53eb5bfbc5ce248ea55dd20f489cc723df61b1e75b43d358701f2cba): S short/long — длины 4904/5304, высота 1990/1990, база 3000/3400; SE short/long — высоты 1970/1990. Допуск высоты ±50 мм, компоновки 5/8/9 мест. Наружная ширина и пассажирский багажник ещё не подтверждены в этой копии. Не считать грузовой объём 5,8/6,7 м³ багажником за занятыми рядами.
- [Технический лист T6.1 2020, Volkswagen Austria](https://cf-cdn-v6.volkswagen.at/media/Kwc_Basic_DownloadTag_Component/33468-549626-374108-549628-387613-linkTag-child/default/e8f25eac/1700740051/tr-ka-ko-pw-eu6dtemp-kw43-19-en-200109.pdf): локальный DNS не разрешился.
- [Заводской MY2016 каталог на зеркале](https://irp-cdn.multiscreensite.com/87efa795/files/uploaded/Transporter_Brochure_MY2016_09.2015.pdf): поисковое описание указывает старые размеры 4892/5292, похожие на T5. Не переносить без проверки самого документа.

Для E90 найден [заводской UK прайс Touring 2011](https://www.press.bmwgroup.com/united-kingdom/article/attachment/T0125650EN_GB/186482). Нужны также свои документы седана, Coupé и Cabrio, включая положение крыши. Современный Authority Vehicles brochure относится к следующему поколению — не подставлять.

Пакет 2 использует снимок с уже опубликованным пакетом 1. Следующий пакет должен сделать новый снимок; не запускать старый apply.mjs на новой общей рабочей копии. Существующие тексты, двигатели, поколения, статистику и 9 старых вложенных массивов bodyVariants сохранить.
