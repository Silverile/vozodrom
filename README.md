# vozodrom

Český autoportál: inzeráty aut, katalog modelů, data z technických kontrol a porovnání ceny s trhem na jednom
místě. Běží na **https://vozodrom.cz** (Cloudflare Workers). Inzeráty od uživatelů jsou skutečné; katalogová
čísla, recenze, fórum a část inzerátů jsou zatím **smyšlená testovací data** (stránky to uvádějí).

## Co web umí

- **Katalog** 200+ značek a tisíců modelových řad s generacemi, motory, fotkami a nákresy zepředu.
- **Inzeráty**: hledání s filtry a fulltextem (v prohlížeči), detail s odhadem ceny vůči trhu a historií STK.
- **Účty**: registrace e-mailem (s ověřením) nebo přes Google, obnovení hesla, oblíbená auta a hlídací psi
  synchronizované mezi zařízeními.
- **Podání inzerátu**: formulář řízený katalogem (značka → model → rok → generace → motor), fotky do R2,
  automatická kontrola (robot), ruční moderace podezřelých.
- **Zprávy**: chat kupující–prodejce s okamžitým doručením (WebSocket) a vlákno „Vozodrom“ s oznámeními.
- **Hlášení podle DSA** a **administrace**: uživatelé, role, blokace, moderace inzerátů, hlášení.

## Rychlý start (lokálně)

Potřeba: Node.js 24, npm. Docker ani Postgres instalovat nemusíte.

```bash
npm install
cp .dev.vars.example .dev.vars   # lokální proměnné; BETTER_AUTH_URL nastavte na adresu dev serveru
npm run db:local                 # lokální Postgres (PGlite) na 127.0.0.1:5433 — nechat běžet v jiném terminálu
npm run db:migrate               # vytvoří tabulky
npm run dev                      # http://localhost:3000
npm run admin:create -- vy@example.com "Jméno"   # první administrátor (zeptá se na heslo)
```

Lokálně se e-maily neposílají, odkazy pro ověření a reset hesla se vypíšou do konzole dev serveru.
Pod `npm run dev` neběží Durable Objects, chat se proto neaktualizuje okamžitě (počet nepřečtených se dotazuje).
Celé chování jako v produkci ukáže `npm run cf:preview`.

## Skripty

| Příkaz | Co dělá |
|---|---|
| `npm run dev` | vývojový server Next.js |
| `npm run typecheck` | kontrola typů (`tsc --noEmit`) |
| `npm run build` | build Next.js (kontrola) |
| `npm run cf:build` | build pro Cloudflare Workers (OpenNext) do `.open-next/` |
| `npm run cf:preview` | build + lokální běh ve workerd (Durable Objects, R2, cron jako v produkci) |
| `npm run cf:deploy` | build + nasazení z vlastního počítače (běžně nasazuje GitHub Actions) |
| `npm run cf:types` | vygeneruje `cloudflare-env.d.ts` z `wrangler.jsonc` (po změně bindingů) |
| `npm run db:local` | lokální Postgres (PGlite) |
| `npm run db:generate` | nová migrace podle `src/db/schema.ts` |
| `npm run db:migrate` | použije migrace; na Neon s `DATABASE_URL` (viz [provoz](docs/provoz.md)) |
| `npm run admin:create -- e-mail "Jméno"` | ověřený účet s rolí admin přímo v databázi |
| `npm run admin:grant -- e-mail` | existujícímu účtu přidá roli admin |

## Dokumentace

- [Architektura](docs/architektura.md) — z čeho se web skládá, jak teče požadavek, statické vs. dynamické stránky,
  přehled modulů.
- [Data](docs/data.md) — databázové tabulky, stavy inzerátu, moderace, chat, fotky, katalog a testovací data.
- [API](docs/api.md) — všechny serverové routy.
- [Provoz](docs/provoz.md) — prostředí, tajné hodnoty, nasazení, migrace, doména a DNS, e-maily, WAF, náklady
  a známé limity.
- [CHECKLIST.md](CHECKLIST.md) — stav spuštění a co zbývá.
- [qa/BUGS.md](qa/BUGS.md) — chyby z ručního testování.
- [legal/](legal/) — návrhy právních dokumentů.
- [src/data/catalog/SOURCES.md](src/data/catalog/SOURCES.md) — původ a licence katalogových dat.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · OpenNext pro Cloudflare · Cloudflare Workers,
Durable Objects, R2, Hyperdrive, Email Service · Postgres (Neon) · Drizzle ORM · Better Auth · MiniSearch.

> Next.js 16 má oproti starším verzím změny API (např. `proxy` místo `middleware`). Před úpravami čtěte
> dokumentaci v `node_modules/next/dist/docs/` (viz `AGENTS.md`).
