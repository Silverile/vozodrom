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
| `data` | JSON s údaji o voze (typ `Draft` v `src/lib/listing-draft.ts`), včetně `features` = klíče výbavy |
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

### Výbava (`src/lib/equipment.ts`)

Slovník s pevnými klíči, českými názvy a skupinami (Bezpečnost, Komfort, Multimédia, Exteriér, Historie a stav).
Inzerát ukládá klíče; hledání, karty a filtr `?vybava=` pracují s názvy, které jsou shodné s dřívějšími texty
testovacích inzerátů a feedů, takže staré odkazy fungují. Texty z feedů se převádějí přes aliasy, neznámé zůstanou,
jak jsou (ve filtru ve skupině „Ostatní“). Starší inzeráty a koncepty bez `features` se čtou jako bez výbavy.

### Kontrola údajů (`src/lib/listing-draft.ts`)

Stejná pravidla v prohlížeči i na serveru: značka z katalogu, model (řada nebo vlastní název), rok v rozmezí
generací řady, generace (povinná, když roku odpovídá víc generací), karoserie, motor, palivo, výkon,
převodovka, nájezd (povinný), cena ≥ 1 000 Kč, místo, VIN (nepovinný; když je, 17 znaků bez I/O/Q). Rok mimo
roky výroby celé řady se odmítne; generace bez let v katalogu rok neblokuje.

**Garáž a deníky** (`src/lib/garage.ts`, `garage-store.ts`):

| Tabulka | Co |
|---|---|
| `garage_car` | auto v garáži: `c-…`, `data` = JSON `CarData` (značka, model, generace, přezdívka, roky, motor, VIN a SPZ, příběh), `photos`, `former` (bývalé auto), `make_slug`/`line_slug` pro filtry |
| `log_entry` | zápis v deníku: `e-…`, auto, nadpis, text, téma (`ENTRY_CATEGORIES`), `cost_czk`, `mileage_km`, `happened_on`, `photos` |
| `entry_comment` | komentáře k zápisům (`k-…`) |
| `entry_like`, `car_like`, `car_follow` | „líbí se“ zápisu a autu, sledování auta (sledující dostane zprávu o novém zápisu) |
| `community_report` | hlášení auta, zápisu nebo komentáře přihlášeným uživatelem; `open` · `hidden` · `dismissed` |

Auta, zápisy a komentáře jsou veřejné hned. Moderátor je skryje s důvodem (`hidden_reason`); autor je dál vidí
i s důvodem. VIN vidí jen majitel, SPZ jen když ji majitel ukáže. Veřejné stránky ukazují jméno zkráceně („Jana N.“).
Fotky jsou v R2 pod `garaz/c-…/` a `deniky/e-…/`.

**`article`** — články „Novinky a rady“ od redakce (moderátoři, admini). Vestavěné články ze
`src/lib/articles.ts` jsou výchozí sada: řádek se stejným `slug` je nahradí, `deleted` je skryje. Text je
formátovaný (`src/lib/markup.tsx`). Migrace `0007_articles.sql`.

**`catalog_edit`** — úpravy katalogu od administrátorů jako operace nad kartou modelu (`field = "op"`, `value` = JSON
operace z `src/lib/catalog-ops.ts`), v pořadí uložení. Starší řádky s `field` summary/name/dateNote se čtou jako
nastavení textu (prázdná hodnota = text katalogu). Viz [Úpravy katalogu](#opravy-katalogu).

## Migrace

- Změna: upravit `src/db/schema.ts` → `npm run db:generate -- --name popis` → zkontrolovat SQL v `drizzle/`.
- Lokálně: `npm run db:migrate` (PGlite musí běžet).
- Produkce: viz [provoz](provoz.md#migrace-na-neon). **Migraci pustit před nasazením kódu**, který nové
  sloupce/tabulky čte — jinak stránky s inzeráty skončí chybou.

## Katalog

Web nečte `src/data/model-cards-index.json` přímo. Před `dev`, `build` a `typecheck` z něj
`scripts/app-model-cards.mjs` vyrobí jeden soubor na modelovou řadu, `public/katalog-data/<značka>/<řada>.json`,
bez důkazních polí (`sources`, `sourceScope`, `fieldSources`, …); soubory se necommitují. Jsou to statické assety,
takže katalog není v balíčku Workeru (limit 64 MiB, pomalé studené starty). `src/lib/card-store.ts` (`loadCard`) je
při předrenderování čte z disku a ve Workeru přes `ASSETS`. Plný index zůstává pro kontroly katalogu.

- `src/data/catalog/` — zdrojová data (Wikidata, CC0, a ručně ověřené doplňky); licence a postup v
  [SOURCES.md](../src/data/catalog/SOURCES.md). Kurátorství probíhá v `analysis/codex/`.
- `src/data/*-index.json` — malé indexy pro web, generované skripty `scripts/makes-index.mjs`,
  `scripts/model-lines-index.mjs`, `scripts/model-cards-index.mjs` (spustit po změně zdrojů).
- Nákresy zepředu: `src/data/front-drawings.json` + soubory v `public/`, pipeline `scripts/lineart.py`. Řady
  v `front-drawing-review.json` se ověřují a nákresy se neukazují. Bez schváleného nákresu ukazuje `CatalogImage`
  obecný piktogram s popiskem „Ilustrační obrázek“ — nikdy jako obrázek konkrétního vozu.
- Období výroby automobilů a motocyklů značek: `src/data/catalog/brand-production-periods.json` (se zdroji) →
  `brand-facts.json` (`node scripts/brand-facts.mjs --periods-only`). Chybějící konec = neověřeno, ne „vyrábí se“;
  `dissolved` je zánik společnosti, ne konec výroby.
- Skutečná data z registru a STK: `src/data/stats/<značka>.json` (statické stránky modelů) a z nich výtah
  `src/data/listing-stats.json` pro dynamické stránky inzerátů uživatelů (`node scripts/listing-stats-index.mjs`,
  spustit po změně statistik). Worker nemůže číst soubory z disku, výtah je proto součástí bundlu (~140 kB gzip).
- Formulář inzerátu bere generace, karoserie, motory a převodovky z karet modelů přes
  `/api/katalog/[značka]/[řada]/` (data se nestahují celá do prohlížeče).
- `src/lib/catalog.ts` je starší ukázkový katalog (pár modelů s testovacími statistikami STK, recenzí a cen);
  stále slouží odhadu ceny a stránkám s testovacími daty.

## Testovací data

`src/lib/listings.ts` je seznam inzerátů z feedů dealerů (zatím prázdný); inzeráty uživatelů jsou v databázi.
Odhad ceny vůči trhu (`src/lib/market.ts`) počítá jen z těchto inzerátů, takže se zatím neukazuje.

## Opravy katalogu

Administrátor upravuje katalog přímo na stránce modelu (tlačítko „✎ Upravit katalog“, u generace „Upravit“):
libovolné pole karty, přidání, smazání a přesun generací, nákres zepředu. Stránky katalogu jsou statické, úpravy
se do nich dostanou při sestavení:

1. Editor (`src/components/catalog-editor/`) převádí každou změnu na operaci (`src/lib/catalog-ops.ts`: set, reset,
   insert, remove, move, drawing). Operace nesou, co čekaly na svém místě; „Uložit“ je pošle do
   `/api/admin/katalog/`, server je přehraje na kartě s dosavadní historií a uloží jen ty, které sedí
   (v transakci SERIALIZABLE: ze dvou současných uložení jedné řady jedno dostane 409; Hyperdrive nepodporuje
   advisory locks). Operace uvnitř generace nesou její identitu (kód, název, první rok, u přidané generace
   token), takže když data generace přeřadí, trefí se do své; zmizelá generace je konflikt.
2. Nákres: obrázek ze souboru, Ctrl+V nebo přetažením převede v prohlížeči `src/lib/drawing-format.ts` do formátu
   webu (port `vozodrom-data/tools/front/site_drawings.py`, shodný s ním bajt po bajtu; Codexův test
   v `analysis/codex/drawing-format/`). WebP jde do R2 (`katalog/…`, služba `/foto/katalog/…`).
3. Před buildem `scripts/fetch-catalog-edits.mjs` (npm `prebuild`, jen na CI) stáhne všechny operace z
   `https://vozodrom.cz/api/katalog/opravy/` do `src/data/catalog-edits.json`; když web neodpoví, build pokračuje
   s verzí v repozitáři.
4. `scripts/app-model-cards.mjs` je přehraje do souborů karet (`public/katalog-data/…/<řada>.json`, původní karta
   vedle jako `<řada>.base.json`). U řad, kde se měnily generace nebo nákresy, zapíše do
   `src/data/catalog-built.json` (negeneruje se do gitu), odkud která generace pochází: nákresy a statistiky STK
   jsou vedené podle pořadí v datech, `src/lib/catalog-built.ts` je přes to přemapuje. Operace, které už na
   data nesedí (data se pod nimi změnila), se přeskočí a ukáže je `/admin/obsah/`.
5. „Publikovat na web“ spustí workflow nasazení přes GitHub API (secret `GITHUB_DEPLOY_TOKEN`, viz provoz).
   Úpravy jdou na web i s každým jiným nasazením.

