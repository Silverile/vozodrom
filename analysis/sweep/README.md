# Catalogue sweep 2026-10-29 (Claude + Codex)

User's request: "With codex please one more time sweep our catalog for mistakes. Starting with car manufacturers and their models. Both of you release swarm of agents to gather data about each model and write it to our catalog. Sweep all sources for data."

Scope: the 217 makes in `src/data/catalog/makes.json` with `sections` containing `"auto"`.

## Split (by make slug, first letter)

| who | makes | writes |
|---|---|---|
| Codex | a–l | `src/data/catalog/model-cards/<a–l>*.json`, `analysis/codex/**`, `analysis/sweep/codex/**` |
| Claude | m–z | `src/data/model-cards/**`, `src/data/catalog/model-cards/<m–z>*.json`, `analysis/sweep/claude/**`, `analysis/sweep/README.md` |

- Shared catalogue files are **not edited directly by either side** during the sweep: `makes.json`, `models-auto.json`, `model-lines-auto.json`, `model-line-additions.json`, `types.ts`, the indexes. Corrections to them go into the per-make sweep file below; they are applied in one reviewed pass at the end.
- `ford`, `hyundai`, `toyota`, `volkswagen` have cards in both folders (`src/data/model-cards/` wins in the index). The letter owner reviews both copies; Codex logs fixes for ford/hyundai in its sweep file, Claude applies them.

## What to check per make

1. **Make** (`makes.json`): name, country, founded/dissolved year, `status` (defunct or not), aliases, whether it is really a car make (not a coachbuilder-only, truck-only or tuner entry that should not be in "auto"), duplicates of another make entry.
2. **Model list** (`models-auto.json`, `model-lines-auto.json` + additions): wrong make attribution, duplicates (same car under two slugs), non-cars (concepts, race cars, trucks, buses, engines) listed as models, wrong names/years/body types, and **missing** models that a Czech buyer could plausibly meet (sold in Europe, or common imports/classics).
3. **Model cards** (`model-cards/<make>.json`): generation boundaries and codes, facelift years, production status (current vs ended as of 2026-10), body types, engines/fuel, trims (power kW, torque, displacement, mass, top speed, 0–100), dimensions, Czech summary text (`summaryCs`) factual accuracy, photo actually showing that model/generation (file name / Commons description), types allowed by `src/data/catalog/types.ts`.
4. **Gaps**: makes with no card file yet (renault, rimac, rivian, roewe, rolls-royce, rover, saab, saic-motor, salmson, santana-motor, saturn, scion, seat, seres, simca, smart, sono-motors, spyker, ssangyong-kgm) get cards in the same shape as the existing ones.

## Sources

Use as many independent sources as reach: Wikidata, Wikipedia in several languages (en, de, cs, fr, it, ja, zh, ru as relevant; fixed `oldid` revision links preferred), manufacturer sites and press releases/media sites, ADAC Autokatalog, auto-data.net, ev-database.org, carfolio, Czech sources (auto.cz, autorevue.cz, auto-mania), national type-approval data. A changed value needs at least one source URL; when sources conflict, keep the better-sourced value and record the conflict. Unknown stays `null`; never invent numbers.

Respect rate limits and robots; do not disguise as a browser to get past bot blocks. No customer PII. No commits, pushes, publishing, sign-ups or paid services.

## Output per make: `analysis/sweep/<claude|codex>/<make>.json`

```json
{
  "make": "seat",
  "checkedAt": "2026-10-29",
  "by": "claude|codex",
  "makeFixes":   [{"field": "foundedYear", "from": 1951, "to": 1950, "sources": ["..."], "confidence": "high|medium|low"}],
  "modelFixes":  [{"file": "models-auto|model-lines-auto|model-line-additions", "slug": "ibiza", "field": "to", "from": null, "to": 2024, "sources": ["..."], "confidence": "high"}],
  "removeModels":[{"file": "models-auto", "slug": "...", "reason": "concept car / duplicate of X / belongs to make Y", "sources": ["..."]}],
  "missingModels":[{"name": "...", "from": 1999, "to": 2008, "bodyTypes": ["hatchback"], "sources": ["..."]}],
  "cardFixesApplied": [{"lineSlug": "ibiza", "path": "generations[2].from", "from": 2001, "to": 2002, "sources": ["..."]}],
  "cardsAdded": ["lineSlug", "..."],
  "conflicts":   [{"where": "...", "values": {"src A": 1, "src B": 2}, "kept": 1}],
  "openQuestions": ["..."],
  "summary": "one or two sentences"
}
```

Card fixes are applied directly to the card file you own and logged in `cardFixesApplied`. Everything else is a proposal.

Progress: one line per finished make appended to `analysis/sweep/<claude|codex>/PROGRESS.md`:
`2026-10-29T18:40Z seat — 3 make/model fixes proposed, 12 card fixes applied, 2 models missing`.

## Year convention (user decision 2026-10-29)

Generation `from`/`to` = **series production** years (as de.wikipedia "Bauzeitraum" gives them), not pre-series or first-build dates. If a source only gives a pre-series date, leave the field null and say so.
