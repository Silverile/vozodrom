# Kia initial historic and technical pass — 2026-10-27

55 model families and108 scoped generation/body records retain all27 existing line slugs. This is a broad first pass, **not complete model-version coverage**. Historical regional production, facelifts and local extensions are not fully enumerated. Most generations still have no technical version rows.

The17 selected version rows cover: historic Brisa pickup; CeedIII launch hatchback; PicantoIII; SportageIV facelift; Venga; SportageV HEV/PHEV; SorentoIV diesel/HEV. Exact gaps by era are in `night-kia-report.json.highPriorityFollowup`.

Identity decisions: historic Pride is separate from later Rio using Pride in Korea; Cerato/Forte/K3 refers to the compact family, while the smaller new K3BL7 is separate. Older ChinaK4PF is separate from new globalK4CL4. ProCeed remains under Ceed with separate body records. Original KX3KC is separate, later KX3SP2c belongs under Seltos. KX5 is a Sportage name, not another card. Bongo/Besta historical body and generation divisions remain incomplete; three-wheelers, large buses and military specials were deferred.

Technical fields are drawn from individual OEM European releases and brochures, whose exact URLs are attached to the corresponding rows. PicantoUK0–60mph is deliberately not converted into0–100km/h. Published minimum weights retain their stated basis and optional maximum range. Missing cycle names stay explicitly unspecified rather than being guessed as NEDC.

Current Sportage scope correction: the two selected HEV rows contain only the UK-sheet configuration facts, with unknown edition/model year. The UK publication gives226bhp; kW remains null rather than inserting a SlovakMY2022 number. The PHEV row uses the SlovakMY2022 system output and European2022 release; its unknown-edition UK weight is excluded. HEV/PHEV values are explicitly system output, not combustion-engine-only output. SorentoMY2021 AWD configurations are supported by the contemporaneous Slovak list and OEM2020 releases; exact displacement incc and mass remain null where those scoped sources do not settle them.

Photographs are partial inspected Commons references, with exact imageinfo author/licence. No complete photograph search has been performed for the108 records.

## Offline rebuild order

Run from the repository root, with dependencies already installed. No research script or network request is needed:

1. `node analysis/codex/night-jetour-build.mjs`
2. `node analysis/codex/night-kia-build.mjs`
3. `node analysis/codex/night-kia-refine.mjs` — refines identities and adds cards for **both** makes.
4. `node analysis/codex/night-kia-current-versions.mjs`
5. `node analysis/codex/night-kia-scope-correction.mjs`
   Then reproduce the final Jetour T2 scope-note clarification with this offline Node snippet (its mass fields are already null in the current builder):

   ```js
   const fs = require("fs");
   const path = "src/data/catalog/model-cards/jetour.json";
   const cards = JSON.parse(fs.readFileSync(path, "utf8"));
   for (const generation of cards.find(card => card.lineSlug === "t2").generations) {
     for (const version of generation.trims || []) {
       version.massKg = null;
       version.massBasis = null;
       version.specificationScope.noteCs += " Přesný význam a metodika hmotnostního řádku globální stránky nebyly nezávisle potvrzeny; hmotnost se proto nezobrazuje.";
     }
   }
   fs.writeFileSync(path, JSON.stringify(cards, null, 2) + "\n");
   ```

6. `node analysis/codex/night-jetour-photos/finalize.mjs` — applies retained batches001–003 to both rebuilt files; it expects their photo fields to be null and is not intended to rerun directly on already-final files.
7. `node analysis/codex/night-jetour-validate.mjs`
8. `node analysis/codex/night-kia-validate.mjs`

This reproduces the worker checkpoint using retained factual decisions and photo metadata. Parent integration may subsequently adjust addition flags or line identities; those integration changes are outside these worker builders. The exact complete sequence has **not** been rerun after freeze; its individual build/refinement/correction/photo stages and final validators were run during creation. Do not run builders on integrated files merely to validate them, because that would replace later edits.
