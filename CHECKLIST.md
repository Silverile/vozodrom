# Vozodrom — чеклист запуска

## Бренд и домены
- [x] Название выбрано: **vozodrom** (TMview: 0 совпадений, 25.10.2026; не юридическая проверка)
- [x] **vozodrom.cz** зарегистрирован 25.10.2026, до 25.10.2027, WEDOS, DNSSEC, NS WEDOS
- [ ] Включить автопродление vozodrom.cz в WEDOS (проверить цену продления)
- [ ] Решить, скрывать ли имя владельца в публичном WHOIS (настройки контакта в WEDOS / CZ.NIC)
- [ ] Купить **vozodrom.com** на Cloudflare ($10,46/год, продление $10,46), включить 2FA и автопродление
- [ ] Перед публичным запуском — проверка товарного знака юристом / подача знака (ÚPV или EUIPO), по желанию

## Прототип (GitHub Pages)
- [x] Репозиторий github.com/Silverile/vozodrom, Next.js + Tailwind, статический экспорт
- [x] Каталог, страницы моделей, поиск, карточка объявления, на тестовых данных
- [x] GitHub Pages через GitHub Actions
- [x] DNS в WEDOS: 4 A, 4 AAAA, CNAME www → silverile.github.io, TXT подтверждения GitHub (не удалять)
- [x] Домен подтверждён в GitHub, Custom domain vozodrom.cz, сборка на корне домена
- [ ] Enforce HTTPS — включить, когда GitHub выпустит сертификат
- [ ] Дизайн: заменить заглушки машин, доработать главную

## Перед открытием для людей
- [ ] Хостинг с бэкендом (Vercel/Cloudflare + Postgres в ЕС) — GitHub Pages запрещает коммерческое использование
- [ ] Правовые документы: VOP, условия для дилеров (P2B), GDPR, cookies, порядок жалоб DSA, правила форума
- [ ] Проверка документов юристом (1–2 часа)
- [ ] Выписка работодателя из торгового реестра (§304) — убедиться, что предмет деятельности не пересекается
- [ ] Источники объявлений: фиды дилеров (Soft4cars и др.), стартовый сегмент (стратегия B)

## Analytika a účty
- [x] GA4 property „vozodrom web“ (G-2D6CJ8T7NY), načítá se jen se souhlasem
- [ ] GA: Google Signals nechat vypnuté, uchovávání dat 2–14 měsíců
- [ ] Před ostrým spuštěním: doplnit provozovatele do /soukromi/ a nechat zkontrolovat
- [ ] Vybrat poskytovatele účtů (Firebase / Supabase / vlastní backend); /prihlaseni/ je zatím jen náhled
