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
- [x] Настоящие фото в объявлениях пользователей (R2, сжатие и удаление EXIF в браузере); тестовые объявления — иллюстрации

## Перед открытием для людей
- [x] Хостинг с бэкендом: Cloudflare Workers + Neon Postgres (Франкфурт) — подробности в docs/provoz.md
  - [x] Выбран Cloudflare Workers (OpenNext); Workers Paid ($5/мес) оплачен 30.10.2026
  - [x] Пробный деплой vozodrom-trial на workers.dev работает (Worker 3,2 MiB gzip — больше лимита Free)
  - [x] Кеш страниц: пока статические ассеты Workers (страницы без ревалидации); R2 — когда появится БД
  - [x] Конфигурация в репозитории, workflow deploy-cloudflare.yml
  - [x] Секреты GitHub добавлены; деплой из Actions работает (vozodrom.vozodrom.workers.dev, 30.10.2026)
  - [x] DNS vozodrom.cz в Cloudflare: DNSSEC WEDOS снят (DS исчез 11:19), NS jakub/ruth.ns.cloudflare.com с 30.10.2026 13:18
  - [x] DNSSEC в Cloudflare + KEYSET в WEDOS (DS 2371 в .cz с 30.10.2026 14:49, проверка проходит)
  - [x] vozodrom.cz и www на Worker (custom domains, 30.10.2026), workflow Pages удалён
  - [x] Redirect Rule www → vozodrom.cz (301, с query), Always Use HTTPS; GitHub Pages выключен, TXT удалён
  - [x] Ветка accounts влита, аккаунты на vozodrom.cz работают (30.10.2026)
  - [x] Пробный Worker vozodrom-trial удалён
- [ ] Правовые документы: VOP, условия для дилеров (P2B), GDPR, cookies, порядок жалоб DSA, правила форума
- [ ] Проверка документов юристом (1–2 часа)
- [ ] Выписка работодателя из торгового реестра (§304) — убедиться, что предмет деятельности не пересекается
- [ ] Источники объявлений: фиды дилеров (Soft4cars и др.), стартовый сегмент (стратегия B)

## Analytika a účty
- [x] GA4 property „vozodrom web“ (G-2D6CJ8T7NY), načítá se jen se souhlasem
- [x] GA: Google Signals vypnuté, uchovávání dat 14 měsíců (uvedeno na /soukromi/)
- [ ] Před ostrým spuštěním: doplnit provozovatele do /soukromi/ a nechat zkontrolovat
- [x] Účty: Better Auth + Neon Postgres (přes Hyperdrive); e-mail/heslo, role, admin /admin/ — v provozu
- [x] Neon projekt vozodrom (Frankfurt) + Hyperdrive vozodrom-db (bez cache); migrace; BETTER_AUTH_SECRET
- [ ] Změnit heslo neondb_owner v Neonu (bylo vidět v terminálu) a aktualizovat ho v Hyperdrive
- [x] Přihlášení přes Google (projekt vozodrom v Google Cloud, klient vozodrom.cz; secrets ve Workeru), ověřeno 30.10.2026
- [x] E-maily: Cloudflare Email Service, noreply@vozodrom.cz (SPF/DKIM/DMARC), limit 200/den; registrace otevřená
- [x] WAF: Block scanners (/wp-*, *.php, /.env, /.git → 403); Auth rate limit 5 POST/10 s na IP (sign-in, sign-up, reset)
- [x] Inzeráty uživatelů: formulář podle katalogu, fotky, robot + ruční moderace podezřelých
- [x] Hlášení podle DSA (čl. 16/17): formulář, skrytí po 3 hlášeních, rozhodnutí a vyrozumění
- [x] Chat kupující–prodejce (WebSocket, Durable Objects), oznámení ve vlákně „Vozodrom“, hlídací pes (cron)
- [ ] Neon: zbavit se usínání databáze (doplatek $10/měs. nebo Launch) — zatím ponecháno
- [ ] Inzeráty uživatelů ve „Výběr“ a „Oblíbené“
- [ ] Podávání inzerátů v rubrikách technika, moto, díly, pneumatiky
- [ ] Chat: nahlášení zprávy, blokování uživatele
- [ ] Admin: moderace fóra a recenzí, úpravy katalogu a novinek
- [ ] Příjem pošty na doméně (např. podpora@vozodrom.cz přes Cloudflare Email Routing)
