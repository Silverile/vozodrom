# Provoz

## Prostředí

| | Lokálně | Produkce |
|---|---|---|
| Web | `npm run dev` (Next.js) nebo `npm run cf:preview` (workerd) | Worker `vozodrom` na vozodrom.cz a www.vozodrom.cz |
| Databáze | PGlite `npm run db:local` (127.0.0.1:5433, data v `.local/`) | Neon projekt `vozodrom`, větev `production`, AWS Frankfurt, přes Hyperdrive `vozodrom-db` (bez cache) |
| Fotky | lokální R2 ve workerd | R2 `vozodrom-photos`, jurisdikce EU |
| E-maily | jen výpis do konzole (`MAIL_FROM` prázdné) | Cloudflare Email Service, `noreply@vozodrom.cz` |
| Chat (Durable Objects) | jen v `cf:preview` | `Inbox` |
| Cron | ručně `POST /api/cron/hlidaci-pes/` s hlavičkou | denně 06:00 UTC |

Konfigurace Workeru je v `wrangler.jsonc` (bindingy, domény, proměnné, cron). Typy bindingů:
`npm run cf:types` → `cloudflare-env.d.ts`.

## Proměnné a tajné hodnoty

| Název | Kde | Poznámka |
|---|---|---|
| `BETTER_AUTH_URL` | `wrangler.jsonc` vars | `https://vozodrom.cz` |
| `SIGNUP_OPEN` | vars | `"false"` vypne registraci (např. když nefungují e-maily) |
| `MAIL_FROM` | vars | prázdné = e-maily jen do logu |
| `BETTER_AUTH_SECRET` | Worker secret | podpis relací a tokenů WebSocketu/cronu; změna odhlásí všechny |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Worker secrets | přihlášení přes Google (projekt „vozodrom“ v Google Cloud, redirect `https://vozodrom.cz/api/auth/callback/google`) |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secrets | nasazení (šablona tokenu „Edit Cloudflare Workers“, platnost 1 rok) |
| `NEXT_PUBLIC_GA_ID` | workflow | GA4 `G-2D6CJ8T7NY`, načte se jen se souhlasem |

Worker secret se nastaví příkazem `npx wrangler secret put NÁZEV --name vozodrom` (hodnota se zadá interaktivně).
Lokální hodnoty jsou v `.dev.vars` (vzor `.dev.vars.example`, soubor se necommituje).

## Nasazení

Každý push do `main` spustí `.github/workflows/deploy-cloudflare.yml`: `npm ci` → `opennextjs-cloudflare build`
→ `deploy` (nahrají se jen změněné assety). Trvá 3–12 minut. Výsledek: GitHub → Actions.

Postup změny:

1. Pracovat ve vlastní větvi, ověřit `npm run typecheck` a `npm run cf:build`.
2. Mění-li se schéma: **nejdřív migrace na Neon** (níže), pak teprve push.
3. Fast-forward do `main` a push.
4. Po nasazení zkontrolovat hlavní stránky a API (`/`, `/inzeraty/`, `/api/inzeraty/verejne/`).

Vrácení: `npx wrangler rollback --name vozodrom` (předchozí verze Workeru) nebo revert commitu v `main`.
Migrace databáze se automaticky nevracejí.

## Migrace na Neon

V terminálu projektu (PowerShell), s **přímým** připojovacím řetězcem z Neonu (Connect → Connection pooling vypnuto):

```powershell
$env:DATABASE_URL="postgresql://..."; npm run db:migrate; Remove-Item Env:DATABASE_URL
```

Výpis končí varováním o `sslmode`, to je v pořádku. Ověření: v Neonu Tables musí být nová tabulka/sloupec.
Řetězec obsahuje heslo — nevkládat ho do chatu ani do souborů v repozitáři.

## Administrátoři

```powershell
$env:DATABASE_URL="postgresql://..."; npm run admin:create -- e-mail "Jméno"; Remove-Item Env:DATABASE_URL
```

Vytvoří ověřený účet s rolí admin (heslo se zadá skrytě). `admin:grant` povýší existující účet. Další role
(moderátor, prodejce) nastaví admin v `/admin/uzivatele/`.

## Doména a DNS

- **vozodrom.cz** — registrátor WEDOS (CZ.NIC), DNS v Cloudflare (NS `jakub` a `ruth.ns.cloudflare.com`,
  NSSET u WEDOS). DNSSEC: klíč z Cloudflare (KSK, alg. 13, tag 2371) jako KEYSET u WEDOS.
  Změna DNS serverů nebo DNSSEC: **nejdřív zrušit KEYSET**, počkat na zmizení DS z `.cz` + 1 h TTL, pak měnit NS.
- **vozodrom.cz a www** jsou custom domains Workeru (DNS záznamy typu „Worker“ spravuje Cloudflare).
  `www` → holá doména pravidlem Redirect Rules (301, zachová query). Zapnuto Always Use HTTPS.
- **vozodrom.com** — registrátor Cloudflare, přesměrování na vozodrom.cz.

## E-maily

Cloudflare Email Service, doména vozodrom.cz onboardovaná (SPF/DKIM na `cf-bounce`, DMARC `p=reject` —
jiný odesílatel za vozodrom.cz neprojde). Limit **200 e-mailů denně** (roste s reputací). Posíláme jen:
ověření registrace, reset hesla a potvrzení/výsledek hlášení nepřihlášeným oznamovatelům. Vše ostatní jde
do vlákna „Vozodrom“ na webu. Doména nemá příjem pošty (žádné MX pro holou doménu).

## Zabezpečení na Cloudflare

- Security rules → **Block scanners**: `/wp-*`, `*.php`, `/.env*`, `/.git*` → 403.
- Rate limiting → **Auth rate limit**: POST na `/api/auth/sign-in*`, `sign-up*`, `request-password-reset*`,
  5 za 10 s na IP → blok 10 s. Better Auth má navíc vlastní limit přihlášení.
- 2FA na účtu Cloudflare, autoprodlužování vozodrom.com.

## Logy a ladění

- Logy Workeru: Cloudflare → Workers → vozodrom → Logs (zapnuto `observability`), nebo `npx wrangler tail vozodrom`.
- Nasazení: GitHub Actions. E-maily: Cloudflare → Email Sending → Activity log.
- V logu se objevuje `This socket has been closed` z `pg-cloudflare` při zavírání spojení — neškodné.

## Náklady a limity

| Služba | Tarif | Limit, na který dát pozor |
|---|---|---|
| Cloudflare Workers | Paid, $5/měs. | Worker ~5,8 MiB gzip (limit 10 MiB), 10 M požadavků/měs. v ceně |
| Durable Objects, R2, Hyperdrive, Email | v rámci účtu | R2 10 GB zdarma; e-maily 3 000/měs. v ceně, 200/den |
| Neon | Free | 100 CU-hodin/měs.; **databáze po 5 min nečinnosti usíná, první dotaz pak trvá 1–3 s** |
| vozodrom.com | Cloudflare Registrar | ~$10,46/rok |
| vozodrom.cz | WEDOS | do 25. 10. 2027 |

Proti usínání Neonu: doplatek k Free ($10/měs., 250 CU-hodin, „jeden projekt 24/7“) nebo tarif Launch
(~$19/měs. za trvale běžící nejmenší výpočet).

## Známé limity

- Pod `next dev` nefungují Durable Objects (chat bez okamžitého doručení) ani skutečné R2.
- Inzeráty uživatelů zatím nejsou ve „Výběr“/„Oblíbené“ (zobrazují jen testovací inzeráty).
- Podávat inzeráty lze jen v rubrice Auta; ostatní rubriky jsou náhled.
- Chat nemá hlášení zpráv ani blokování uživatele.
- Odhad ceny vůči trhu počítá z testovacích inzerátů.
