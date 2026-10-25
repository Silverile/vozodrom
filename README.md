# vozodrom

Prototyp českého autoportálu: inzeráty, katalog modelů, data z technických kontrol a porovnání ceny s trhem
na jednom místě. **Všechna data v prototypu jsou smyšlená.**

## Stack
- Next.js (App Router) se statickým exportem (`output: "export"`) pro GitHub Pages
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
(`/vozodrom/`). V nastavení repozitáře: **Settings → Pages → Source: GitHub Actions**.

GitHub Pages je jen pro prototyp: jeho podmínky nepovolují komerční provoz. Před spuštěním pro veřejnost
přejdeme na hosting s backendem.
