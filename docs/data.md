# Data

## Kde co je

| Data | Úložiště | Zdroj pravdy |
|---|---|---|
| Uživatelé, relace, inzeráty, hlášení, zprávy, oblíbené, hledání | Postgres (Neon, Frankfurt) | `src/db/schema.ts` + migrace v `drizzle/` |
| Fotky inzerátů | R2 `vozodrom-photos` (EU), klíč `inzeraty/<id>/<náhodný>.webp|jpg` | `src/lib/listing-store.ts` |
| Katalog (značky, řady, generace, motory, fotky) | JSON v `src/data/` (součást buildu) | pipeline v `analysis/codex/`, indexy přes `scripts/*-index.mjs` |
| Testovací inzeráty | generují se v kódu (`src/lib/listings.ts`), feed `src/data/feeds/` | deterministický generátor |
| Rozpracovaný formulář, oblíbené bez přihlášení, motiv, souhlas s analytikou | `localStorage` prohlížeče | `src/lib/storage.ts` |

## Tabulky (Postgres)

**Účty (Better Auth)** — `user` (role, blokace), `session`, `account` (heslo nebo Google), `verification`.

**`favorite`, `saved_search`** — oblíbené inzeráty a uložená hledání („hlídací pes“) přihlášeného uživatele.
`saved_search.notified_at` = kdy mu hlídací pes naposledy psal.

**`listing`** — inzeráty uživatelů:

| Sloupec | Význam |
|---|---|
| `id` | `u-` + 12 náhodných znaků |
| `user_id` | autor |
| `status` | `draft` · `pending` · `published` · `rejected` · `withdrawn` |
| `data` | JSON s údaji o voze (typ `Draft` v `src/lib/listing-draft.ts`) |
| `photos` | JSON `[{ key, width, height }]`, pořadí = pořadí v galerii |
| `phone`, `messengers` | kontakt; `messengers` ⊂ `whatsapp`, `telegram`, `viber` |
| `moderation_flags` | důvody, proč robot poslal inzerát moderátorovi |
| `reject_reason`, `moderated_by` | rozhodnutí moderátora |
| `submitted_at`, `published_at` | kdy odeslán ke zveřejnění / poprvé zveřejněn |

**`report`** — hlášení podle DSA: inzerát, kategorie, vysvětlení, jméno a e-mail oznamovatele (a `user_id`,
byl-li přihlášen), stav `open` · `removed` · `dismissed`, zdůvodnění rozhodnutí. Zůstávají jako záznam.

**`conversation`, `conversation_member`, `message`** — chat. Konverzace o inzerátu má id
`l-<inzerát>-<kupující>`, vlákno oznámení `s-<uživatel>`. `conversation_member.last_read_at` určuje nepřečtené;
zpráva bez `sender_id` je oznámení (může mít `link`).

## Stavy inzerátu

```
draft ──zveřejnit──▶ automatická kontrola ──čisté──▶ published ──stáhnout──▶ withdrawn
                         │ podezřelé                  ▲   │
                         ▼                  schválit  │   │ zamítnout (moderátor)
                      pending ────────────────────────┘   ▼
                         └──zamítnout──▶ rejected ──úprava──▶ draft
```

- Úprava zveřejněného inzerátu projde robotem znovu; podezřelá úprava ho vrátí do `pending`.
- Tři otevřená hlášení inzerát skryjí (`pending` s důvodem „opakovaně nahlášeno uživateli“).
- Autor se o každé změně dozví ve vlákně „Vozodrom“ (e-maily se kvůli limitu neposílají).

### Pravidla robota (`src/lib/moderation.ts`)

Inzerát jde k moderátorovi, když obsahuje: platbu předem / převod do zahraničí (Western Union, záloha předem,
kauce…), „auto v zahraničí“ nebo dodání kurýrem, vůz bez dokladů / stočený tachometr, vulgarismy, odkaz
nebo kontakt (e-mail, telefon) v textu, cenu pod polovinou odhadu trhu, nebo je to první inzerát účtu
mladšího 24 hodin. Robot sám nic nezamítá. Komunikátory (WhatsApp, Telegram, Viber) se nehlídají — prodejce
je uvádí u telefonu.

### Kontrola údajů (`src/lib/listing-draft.ts`)

Stejná pravidla v prohlížeči i na serveru: značka z katalogu, model (řada nebo vlastní název), rok v rozmezí
generací řady, generace (povinná, když roku odpovídá víc generací), karoserie, motor, palivo, výkon,
převodovka, nájezd, cena ≥ 1 000 Kč, místo, VIN (17 znaků bez I/O/Q).

## Migrace

- Změna: upravit `src/db/schema.ts` → `npm run db:generate -- --name popis` → zkontrolovat SQL v `drizzle/`.
- Lokálně: `npm run db:migrate` (PGlite musí běžet).
- Produkce: viz [provoz](provoz.md#migrace-na-neon). **Migraci pustit před nasazením kódu**, který nové
  sloupce/tabulky čte — jinak stránky s inzeráty skončí chybou.

## Katalog

- `src/data/catalog/` — zdrojová data (Wikidata, CC0, a ručně ověřené doplňky); licence a postup v
  [SOURCES.md](../src/data/catalog/SOURCES.md). Kurátorství probíhá v `analysis/codex/`.
- `src/data/*-index.json` — malé indexy pro web, generované skripty `scripts/makes-index.mjs`,
  `scripts/model-lines-index.mjs`, `scripts/model-cards-index.mjs` (spustit po změně zdrojů).
- Nákresy zepředu: `src/data/front-drawings.json` + soubory v `public/`, pipeline `scripts/lineart.py`.
- Skutečná data z registru a STK: `src/data/stats/<značka>.json` (statické stránky modelů) a z nich výtah
  `src/data/listing-stats.json` pro dynamické stránky inzerátů uživatelů (`node scripts/listing-stats-index.mjs`,
  spustit po změně statistik). Worker nemůže číst soubory z disku, výtah je proto součástí bundlu (~140 kB gzip).
- Formulář inzerátu bere generace, karoserie, motory a převodovky z karet modelů přes
  `/api/katalog/[značka]/[řada]/` (data se nestahují celá do prohlížeče).
- `src/lib/catalog.ts` je starší ukázkový katalog (pár modelů s testovacími statistikami STK, recenzí a cen);
  stále slouží odhadu ceny a stránkám s testovacími daty.

## Testovací data

`src/lib/listings.ts` generuje smyšlené inzeráty (VIN `TESTVZD…`), `src/data/feeds/` obsahuje ukázkový feed
dealera. Odhad ceny vůči trhu (`src/lib/market.ts`) zatím počítá z těchto testovacích inzerátů.
