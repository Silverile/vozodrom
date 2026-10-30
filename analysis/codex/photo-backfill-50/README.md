# Photo backfill50

Selected15 previously empty generation/family targets: Citroën10, Daihatsu3, BMW2. Each selected thumbnail was viewed for actual vehicle identity, whole-car framing, approximately5% margins and a front three-quarter view. Selected aspect ratios are in1.4–1.7. No picture was downloaded into product assets; temporary review thumbnails are removed at handoff.

Metadata comes either from exact-file Commons imageinfo or, after intermittent HTTP429, the exact file page's Author row and named licence templates. The latter is explicitly marked `metadataMethod` in candidates.json. Page-footer licences are never used as photo licences. Alternative offered licences may differ from the API's preferred licence; the chosen explicit licence is retained with its URL.

Category roots and subcategories were explored. Wrong initial category names forC1/C3 returned404 and were corrected forC1. Category discovery and all candidate metadata remain in structured JSON. This is a partial search, not proof that a suitable image is absent.

Rejected examples: BMW02Front was visibly modified; M1Procar depicts a racing derivative; E3 root candidates included scenery and an art object rather than a usable road-car portrait. C1II candidate130 and Opti137 are too tight despite their preferred aspect. C6 root includes a historic C6 not matching the2005-era card. Open bonnets, close-ups, damaged vehicles and obstructed pictures were not selected.

Help wanted: clean full-car pictures at preferred aspect for C1II, C6(2005), BMW02/E3 and DaihatsuOpti. Searches for these remain incomplete. Other Citroën and Daihatsu families still have null photos; see live card files.

Apply using `node analysis/codex/merge-photo-patches-50.mjs`; validation: `node analysis/codex/photo-backfill-50/validate.mjs`. The merger also replays earlier reviewed batches and checks exact generation names to reject stale patches.
