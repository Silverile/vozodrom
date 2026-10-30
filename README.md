# vozodrom

Prototyp českého autoportálu: inzeráty, katalog modelů, data z technických kontrol a porovnání ceny s trhem
na jednom místě. **Všechna data v prototypu jsou smyšlená.**

## Stack
- Next.js (App Router) na Cloudflare Workers přes OpenNext; statický export (`STATIC_EXPORT=1`) pro GitHub Pages
- React, TypeScript, Tailwind CSS 4
- MiniSearch pro fulltextové hledání v prohlížeči

## Spuštění
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statický web do ./out
```

## Struktura
- `src/lib/catalog.ts` — značky a modely (testovací čísla)
- `src/lib/listings.ts` — deterministický generátor testovacích inzerátů (smyšlená VIN `TESTVZD…`)
- `src/lib/market.ts` — odhad tržní ceny z podobných inzerátů
- `src/app/katalog/…` — katalog, stránky modelů (generace, motory, STK, nájezd, ceny)
- `src/app/inzeraty/…` — hledání s filtry a detail inzerátu

## Nasazení
GitHub Actions (`.github/workflows/deploy.yml`) staví web a publikuje ho na GitHub Pages
na doméně **vozodrom.cz**. V nastavení repozitáře: **Settings → Pages → Source: GitHub Actions**,
Custom domain `vozodrom.cz`.

GitHub Pages je jen pro prototyp: jeho podmínky nepovolují komerční provoz. Před spuštěním pro veřejnost
přecházíme na Cloudflare Workers.

### Cloudflare Workers
Web běží přes adaptér OpenNext (`@opennextjs/cloudflare`). Předrenderované stránky se servírují
ze statických assetů Workeru (`open-next.config.ts`). Vyžaduje tarif Workers Paid — worker má ~3,2 MiB gzip.

```bash
npm run cf:preview   # build + lokální běh ve workerd
npm run cf:deploy    # build + nasazení (po `npx wrangler login`)
```

Workflow `.github/workflows/deploy-cloudflare.yml` nasazuje při každém pushi do `main`. Potřebuje
secrets repozitáře `CLOUDFLARE_API_TOKEN` (šablona „Edit Cloudflare Workers“) a `CLOUDFLARE_ACCOUNT_ID`.
Build pro GitHub Pages zapíná statický export proměnnou `STATIC_EXPORT=1`.
