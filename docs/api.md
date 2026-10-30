# API

Všechny cesty končí lomítkem (web má `trailingSlash`); bez něj Next přesměruje (308). Chyby vracejí
`{ "error": "česká zpráva" }` se stavem 400/401/404/409/413/415/422/429.

## Účty

| Metoda a cesta | Kdo | Co |
|---|---|---|
| `GET/POST /api/auth/*` | kdokoli | Better Auth: registrace, přihlášení (e-mail, Google), odhlášení, ověření e-mailu, reset hesla, admin (role, blokace). Router Better Auth nezná lomítko na konci, handler ho odstraní. |
| `GET /api/ucet/seznamy/` | přihlášený | oblíbené a uložená hledání |
| `PUT /api/ucet/seznamy/[?merge=1]` | přihlášený | `{ favorites?, searches? }` nahradí (nebo s `merge=1` přidá) seznamy |

## Inzeráty

| Metoda a cesta | Kdo | Co |
|---|---|---|
| `POST /api/inzeraty/` | přihlášený | `{ data }` → nový koncept `{ id }` |
| `GET /api/inzeraty/[id]/` | autor, moderátor | inzerát |
| `PATCH /api/inzeraty/[id]/` | autor | `{ data?, phone?, messengers?, order? }` — údaje, kontakt, pořadí fotek |
| `DELETE /api/inzeraty/[id]/` | autor | smaže inzerát i fotky |
| `POST /api/inzeraty/[id]/stav/` | autor / moderátor | `{ action }`: autor `submit` · `cancel` · `withdraw`, moderátor `approve` · `reject` (+ `reason`) |
| `POST /api/inzeraty/[id]/fotky/?w=&h=` | autor | tělo = JPEG/WebP ≤ 3 MB → `{ key, width, height }` |
| `DELETE /api/inzeraty/[id]/fotky/?klic=` | autor | smaže fotku |
| `GET /api/inzeraty/verejne/` | kdokoli | zveřejněné inzeráty uživatelů jako `Listing[]` (cache 60 s) |
| `GET /foto/inzeraty/<id>/<klíč>` | kdokoli | fotka z R2 (cache 1 rok) |
| `GET /api/katalog/[značka]/[řada]/` | kdokoli | generace řady pro formulář: roky, karoserie, motory, převodovky, foto (cache 1 den) |

## Hlášení (DSA)

| Metoda a cesta | Kdo | Co |
|---|---|---|
| `POST /api/hlaseni/` | kdokoli kromě autora | `{ listingId, category, explanation, name, email, goodFaith }`; max. 5 za hodinu z jednoho e-mailu |
| `POST /api/admin/hlaseni/` | moderátor | `{ listingId, decision: "remove" \| "dismiss", reason }` — rozhodne všechna otevřená hlášení inzerátu |

## Zprávy

| Metoda a cesta | Kdo | Co |
|---|---|---|
| `GET /api/zpravy/` | přihlášený | konverzace a počet nepřečtených |
| `POST /api/zpravy/` | přihlášený | `{ listingId }` → `{ id }` konverzace s prodejcem (ne vlastní inzerát) |
| `GET /api/zpravy/[id]/[?pred=ISO]` | člen | 50 zpráv před časem (nejnovější na konci) |
| `POST /api/zpravy/[id]/` | člen | `{ body }` ≤ 2000 znaků; max. 30 zpráv za 10 minut; do vlákna oznámení nelze psát |
| `POST /api/zpravy/[id]/precteno/` | člen | označí jako přečtené |
| `GET /api/zpravy/token/` | přihlášený | token pro WebSocket (60 s) + počet nepřečtených |
| `GET /ws/zpravy?token=` (WebSocket) | držitel tokenu | události `{ type: "message", conversationId, message }` a `{ type: "unread", total }`; klient posílá `ping` |

## Interní

| Metoda a cesta | Kdo | Co |
|---|---|---|
| `POST /api/cron/hlidaci-pes/` | cron (hlavička `x-cron-secret`) | spustí hlídacího psa; bez tajné hlavičky 404 |
