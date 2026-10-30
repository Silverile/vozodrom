# Architektura

## Přehled

```
prohlížeč ──HTTPS──▶ Cloudflare (vozodrom.cz, WAF, Redirect Rules)
                         │
                         ▼
               Worker „vozodrom“ (worker/index.ts)
               ├─ /ws/zpravy ─────────▶ Durable Object Inbox (jeden na uživatele) ◀── push z aplikace
               ├─ cron 06:00 UTC ─────▶ /api/cron/hlidaci-pes
               └─ vše ostatní ────────▶ aplikace Next.js (OpenNext, .open-next/worker.js)
                                         ├─ statické assety a předrenderované stránky (ASSETS)
                                         ├─ Postgres Neon (Frankfurt) přes Hyperdrive (HYPERDRIVE)
                                         ├─ fotky inzerátů v R2, jurisdikce EU (PHOTOS)
                                         └─ e-maily přes Cloudflare Email Service (EMAIL)
```

Vše běží v jednom Workeru na tarifu **Workers Paid**. Samostatný server není.

## Vstupní Worker (`worker/index.ts`)

Obaluje aplikaci, kterou vyrobí OpenNext (`.open-next/worker.js`), a přidává, co Next.js sám neumí:

- **WebSocket chatu** `/ws/zpravy?token=…`: ověří krátkodobý podepsaný token (`src/lib/ws-token.ts`, HMAC
  s `BETTER_AUTH_SECRET`, platnost 60 s) a předá spojení Durable Objectu `Inbox` daného uživatele.
- **Durable Object `Inbox`**: drží WebSockety všech otevřených záložek uživatele (hibernace, nečinné spojení
  nic nestojí) a rozesílá jim události, které aplikace pošle (`POST` z `src/lib/chat.ts`).
- **Cron** (`scheduled`): denně zavolá `/api/cron/hlidaci-pes` s tajnou hlavičkou.

## Vykreslování stránek

| Druh | Příklady | Jak |
|---|---|---|
| Předrenderované při buildu | `/`, `/katalog/…`, `/inzeraty/…` (testovací a feed inzeráty), `/novinky/…` | Statické assety Workeru (`open-next.config.ts`, cache `static-assets`, bez revalidace). Odpověď ~0,1 s. |
| Dynamické (na požadavek) | `/ucet/…`, `/admin/…`, `/prihlaseni/`, `/inzerat/[id]` (inzeráty uživatelů) | Server čte relaci a databázi; `connection()` vypíná předrenderování. |
| Klientská data | výsledky hledání, „Nejnovější inzeráty“ | Statická stránka si dotáhne zveřejněné inzeráty uživatelů z `/api/inzeraty/verejne/`. |

Hlavička je statická; přihlášení se zjišťuje v prohlížeči (`authClient.useSession`), aby stránky mohly zůstat
předrenderované. Relace se čte z podepsané cookie (cache 2 min), databáze se ptá jen po jejím vypršení.

## Moduly (`src/`)

**Aplikace (`src/app/`)**

- `katalog/`, `inzeraty/` (statické), `inzerat/[id]` (inzeráty uživatelů), `pridat/` (formulář),
  `ucet/` (účet, zprávy, správa inzerátu), `admin/` (uživatelé, inzeráty, hlášení), `prihlaseni/`,
  `zapomenute-heslo/`, `nove-heslo/`, `foto/[...key]` (fotky z R2), `api/` (viz [API](api.md)).
- Ostatní rubriky (`technika`, `moto`, `dily`, `pneumatiky`, `forum`, `recenze`, `novinky`) jsou zatím
  statické ukázky s testovacími daty.

**Serverová logika (`src/lib/`, soubory s `import "server-only"`)**

| Modul | Úloha |
|---|---|
| `auth.ts` | Better Auth: e-mail/heslo s ověřením, Google, role, blokace, `getSession`, `signupOpen` |
| `db` (`src/db/`) | schéma Drizzle a připojení přes Hyperdrive (pool na požadavek, max 4 dotazy souběžně) |
| `listing-store.ts` | inzeráty: vytvoření, úpravy, stavy, fotky v R2, automatická kontrola, oznámení |
| `moderation.ts` | pravidla robota (podezřelé fráze, odkazy a kontakty v textu, cena, nový účet) |
| `user-listings.ts` | převod inzerátu z databáze na společný typ `Listing` pro hledání a karty |
| `reports.ts` | hlášení podle DSA: příjem, skrytí po 3 hlášeních, rozhodnutí, vyrozumění |
| `chat.ts` | konverzace, zprávy, nepřečtené, oznámení (`notify`, `notifyStaff`), push do Inboxu |
| `watchdog.ts` | hlídací pes: shoda uložených hledání s novými inzeráty |
| `account-lists.ts` | oblíbené a uložená hledání uživatele |
| `mail.ts` | odeslání e-mailu (Cloudflare Email Service; lokálně jen výpis) |

**Sdílené (prohlížeč i server)**: `listing-draft.ts` (typ a kontrola formuláře inzerátu — stejná pravidla
v prohlížeči i na serveru), `listing-catalog.ts` (karoserie, paliva, mapování katalogu), `listing-status.ts`
(popisky stavů, komunikátory), `catalog.ts`/`makes.ts`/`modelCards.ts` (katalog), `market.ts` (odhad ceny),
`format.ts`, `geo.ts`.

**Jen prohlížeč**: `auth-client.ts`, `chat-client.ts` (WebSocket, počet nepřečtených), `photo-resize.ts`
(zmenšení fotek a odstranění EXIF před nahráním), `storage.ts` (localStorage).

## Přihlášení a role

Better Auth ukládá uživatele, relace a účty do Postgresu. Role: `user`, `dealer` (zatím bez zvláštních práv),
`moderator` (administrace kromě uživatelů), `admin` (vše). `/admin` vidí jen moderátoři a admini, ostatní
dostanou 404. Registraci lze vypnout proměnnou `SIGNUP_OPEN`.

## Tok inzerátu

1. Formulář `/pridat/` drží rozpracovaná data v `localStorage`; „Pokračovat k fotkám“ je uloží jako `draft`.
2. Na `/ucet/inzerat/[id]` se přidají fotky (zmenšené v prohlížeči na WebP ≤ 1920 px) a telefon.
3. „Zveřejnit“ spustí robota (`moderation.ts`): čistý inzerát je hned `published`, podezřelý `pending`
   s důvody pro moderátora. Úprava zveřejněného inzerátu projde robotem znovu.
4. Moderátor schválí/zamítne v `/admin/inzeraty/`; autor dostane oznámení do vlákna „Vozodrom“.

Podrobně stavy a tabulky v [Data](data.md).

## Chat a oznámení

- Zprávy se ukládají do Postgresu; databáze je zdroj pravdy.
- Po uložení zprávy server odpoví hned a teprve potom (`waitUntil`) aktualizuje konverzaci, rozešle událost
  přes Inbox a přepočítá nepřečtené.
- Prohlížeč (`ChatConnection` v layoutu) si vyžádá token, otevře WebSocket a při výpadku se znovu připojuje;
  když WebSocket nejde, jednou za minutu se ptá na počet nepřečtených.
- Oznámení (stav inzerátu, hlášení, hlídací pes) jsou zprávy bez odesílatele ve vlákně `s-<uživatel>`.

## Bezpečnost a soukromí

- Tajné hodnoty jen ve Worker secrets a GitHub secrets, nikdy v repozitáři (`.dev.vars` je ignorovaný).
- Fotky: v prohlížeči se překódují (zmizí EXIF včetně GPS), server ověřuje typ podle prvních bajtů
  (JPEG/WebP), velikost ≤ 3 MB, max. 20 fotek.
- WAF blokuje skenery (`/wp-*`, `*.php`, `/.env`, `/.git`) a omezuje pokusy o přihlášení (viz [provoz](provoz.md)).
- Telefon prodejce se zobrazí až po kliknutí; e-mail se kupujícím neukazuje.
- Moderátor nevidí soukromé konverzace; chat nemá administrátorský náhled.
