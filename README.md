# vozodrom

Prototyp českého autoportálu: inzeráty, katalog modelů, data z technických kontrol a porovnání ceny s trhem
na jednom místě. **Všechna data v prototypu jsou smyšlená.**

## Stack
- Next.js (App Router) na Cloudflare Workers přes OpenNext
- React, TypeScript, Tailwind CSS 4
- MiniSearch pro fulltextové hledání v prohlížeči

## Spuštění
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # kontrola buildu Next.js
```

## Struktura
- `src/lib/catalog.ts` — značky a modely (testovací čísla)
- `src/lib/listings.ts` — deterministický generátor testovacích inzerátů (smyšlená VIN `TESTVZD…`)
- `src/lib/market.ts` — odhad tržní ceny z podobných inzerátů
- `src/app/katalog/…` — katalog, stránky modelů (generace, motory, STK, nájezd, ceny)
- `src/app/inzeraty/…` — hledání s filtry a detail inzerátu

## Nasazení
Web běží na Cloudflare Workers přes adaptér OpenNext (`@opennextjs/cloudflare`) na doménách
**vozodrom.cz** a www.vozodrom.cz (custom domains ve `wrangler.jsonc`; www přesměrovává na holou doménu pravidlem Redirect Rules v Cloudflare).
Předrenderované stránky se servírují ze statických assetů Workeru (`open-next.config.ts`).
Vyžaduje tarif Workers Paid — worker má ~3,2 MiB gzip.

```bash
npm run cf:preview   # build + lokální běh ve workerd
npm run cf:deploy    # build + nasazení (po `npx wrangler login`)
```

Workflow `.github/workflows/deploy-cloudflare.yml` nasazuje při každém pushi do `main`. Potřebuje
secrets repozitáře `CLOUDFLARE_API_TOKEN` (šablona „Edit Cloudflare Workers“) a `CLOUDFLARE_ACCOUNT_ID`.
DNS zóna vozodrom.cz je v Cloudflare (DNSSEC zapnutý, KEYSET u WEDOS).
