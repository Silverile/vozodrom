# Vozodrom — чеклист запуска

## Бренд и домены
- [x] Название выбрано: **vozodrom** (TMview: 0 совпадений, 25.10.2026; не юридическая проверка)
- [x] **vozodrom.cz** зарегистрирован 25.10.2026, до 25.10.2027, WEDOS, DNSSEC, NS WEDOS
- [ ] Включить автопродление vozodrom.cz в WEDOS (проверить цену продления)
- [x] WHOIS vozodrom.cz проверен 30.10.2026: видно только имя держателя (по правилам CZ.NIC не скрывается), адрес/e-mail/телефон скрыты. Убрать имя — только перевести домен на фирму
- [x] **vozodrom.com** куплен на Cloudflare (отмечено 30.10.2026; $10,46/год, продление $10,46)
- [x] Cloudflare: 2FA на аккаунте и автопродление vozodrom.com включены
- [x] vozodrom.com — редирект на vozodrom.cz
- [ ] Перед публичным запуском — проверка товарного знака юристом / подача знака (ÚPV или EUIPO), по желанию

## Прототип (GitHub Pages)
- [x] Репозиторий github.com/Silverile/vozodrom, Next.js + Tailwind, статический экспорт
- [x] Каталог, страницы моделей, поиск, карточка объявления, на тестовых данных
- [x] GitHub Pages через GitHub Actions
- [x] DNS в WEDOS: 4 A, 4 AAAA, CNAME www → silverile.github.io, TXT подтверждения GitHub (не удалять)
- [x] Домен подтверждён в GitHub, Custom domain vozodrom.cz, сборка на корне домена
- [x] Enforce HTTPS — включено
- [x] Дизайн: новые иллюстрации машин, логотип A (галочка), разделы как у Дрома, тизеры на главной
- [x] Разделы: авто, техника, мото, запчасти, шины; отзывы владельцев, форум, новости и советы (тестовые данные)
- [x] Подача объявления для всех разделов (только предпросмотр, без отправки)
- [x] Договор купли-продажи и инструкция по přepis (проверено Codex)
- [ ] Настоящие фото вместо иллюстраций (после бэкенда и загрузки фото)

## Перед открытием для людей
- [ ] Хостинг с бэкендом (Vercel/Cloudflare + Postgres в ЕС) — GitHub Pages запрещает коммерческое использование
  - [x] Выбран Cloudflare Workers (OpenNext); Workers Paid ($5/мес) оплачен 30.10.2026
  - [x] Пробный деплой vozodrom-trial на workers.dev работает (Worker 3,2 MiB gzip — больше лимита Free)
  - [x] Кеш страниц: пока статические ассеты Workers (страницы без ревалидации); R2 — когда появится БД
  - [x] Конфигурация в репозитории, workflow deploy-cloudflare.yml
  - [ ] Секреты GitHub: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID; первый деплой из Actions
  - [ ] Перенести DNS vozodrom.cz в Cloudflare (сначала снять DNSSEC в WEDOS), привязать домен к Worker, отключить Pages
  - [ ] Удалить пробный Worker vozodrom-trial
- [ ] Правовые документы: VOP, условия для дилеров (P2B), GDPR, cookies, порядок жалоб DSA, правила форума
- [ ] Проверка документов юристом (1–2 часа)
- [ ] Выписка работодателя из торгового реестра (§304) — убедиться, что предмет деятельности не пересекается
- [ ] Источники объявлений: фиды дилеров (Soft4cars и др.), стартовый сегмент (стратегия B)

## Analytika a účty
- [x] GA4 property „vozodrom web“ (G-2D6CJ8T7NY), načítá se jen se souhlasem
- [x] GA: Google Signals vypnuté, uchovávání dat 14 měsíců (uvedeno na /soukromi/)
- [ ] Před ostrým spuštěním: doplnit provozovatele do /soukromi/ a nechat zkontrolovat
- [ ] Vybrat poskytovatele účtů (Firebase / Supabase / vlastní backend); /prihlaseni/ je zatím jen náhled
