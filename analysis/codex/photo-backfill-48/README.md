# Delivery 48 photo handoff

2026-10-27, approximately 01:43–01:57 UTC. Final patches: `batch-001.json` through `batch-011.json`, **35 targets**: Daewoo 22, Dacia 3, Daihatsu 10. This worker wrote only this evidence folder; root merges the shared model cards.

## Completed targets

- Dacia: 1320, Sport (1410 Sport), 2000. The 1320 photograph is a museum view with a thin barrier; the car's body is visible. The 2000 is the specifically identified Dacia example, not a substitute Renault 20 photograph from the same category.
- Daewoo: Lanos, Nexia, Nubira J100/J150/J200, Kalos, Lacetti, Tacuma/Rezzo, Tico, Evanda/Magnus, Damas, Labo, Arcadia, Tosca, Winstorm, Lacetti Premiere, Chairman, Veritas, Matiz M200, Musso, Korando and Lublin. The family records remain family illustrations; photographs do not assert a precise trim, engine, gearbox or model year.
- Daihatsu: Cuore/Mira (L250 example), Terios second branch (J200), Trevis/Mira Gino II (L650), Sirion/Boon branch (M300 international example), Mira Gino I (L700), Rocky F70, modern Rocky, Naked, Midget II and Esse. No rally car was substituted for a production Sirion photograph: the useful production images were in the international Sirion subcategory rather than the Boon category root.

Each selected thumbnail was viewed. Every licence comes from Commons `imageinfo.extmetadata`, along with author credit and original/file-page URLs. No author was inferred from the site footer or merely from an uploader's name. Older Dacia pickup and Tico files had no usable machine-readable author; the pickup was left unresolved and a different credited Tico photograph was selected. The original missing-author evidence is retained in `credits-check.json`; it is not an author assertion.

## Help wanted / incomplete searches

- Dacia 1325, Nova, SuperNova, 500 Lăstun, Pick-Up and D6. Relevant category files were found, but this short pass did not identify a clean full-car front view at the requested preferred aspect with complete credit. The only 500 Lăstun candidate has a tightly cropped rear edge; 1325 examples have obstruction or tight framing; eligible Nova/SuperNova candidates were rear views or had open panels. D6 files were outside the preferred aspect. Roomy 4:3 examples may deserve a separate decision against the site's actual frame treatment; none were silently selected here.
- Daewoo G2X, Prince, Statesman, Winstorm MaXX, Matiz Creative M300, Maepsy, Honker, Imperial and Istana. Some retrieved images were cropped, too tight or had unresolved brand identity. Maepsy search found Saehan-badged museum examples, not a confirmed Daewoo-badged example for the brand-restricted card. Rebadged Chevrolet/Saturn/SsangYong photographs were not substituted simply because their body looked similar.
- Other Daihatsu families remain. Charmant, Compagno, Move and Opti category roots mostly led to generation/body subcategories; these were discovered but not fully worked through before the handoff. `category-files-006.json` retains the leads. They are not exhausted sources.

Commons occasionally returned HTTP 429, including some category HTML. This means incomplete retrieval, never proof that a photograph is unavailable. Category names/files and API metadata are preserved in the JSON evidence. The selection validator checks unique targets, current generation names, API-backed metadata references, credited author/licence, reviewed flags, and aspect 1.4–1.7. It does not prove exhaustive model coverage or validate every visual identity automatically.

Validation command: `node analysis/codex/photo-backfill-48/validate.mjs`. Binary thumbnail/contact-sheet caches are deleted at handoff. No commits, shared-card writes, or product image downloads.
