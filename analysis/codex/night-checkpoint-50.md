# Night checkpoint50

Elapsed 16.5minutes. NEXT: estrima. Remaining 145; Claude-owned skips: zotye-auto.

| Make | Cards | Generation/family records | Selected versions | Photos |
| --- | ---: | ---: | ---: | ---: |
|dodge|82|132|14|15|
|dongfeng|23|24|8|3|
|donkervoort|8|13|20|6|
|ds-automobiles|9|11|3|3|
|duesenberg|3|3|7|3|
|e-go-mobile|1|1|2|1|

Cumulative: {"makes":64,"cards":1398,"generations":1772,"versions":469,"photos":369} → {"makes":70,"cards":1524,"generations":1956,"versions":523,"photos":415}.

- Three concurrent make researchers plus root photo/integration worker; all stopped cleanly.
- Saved means source-backed partial history and selected versions, not exhaustive production history or every configuration.
- Root15photo backfills: Citroën10,Daihatsu3,BMW2. ExactAPI or explicitfile-pageAuthor/licence fields retained; API429 led to incomplete searches, never an absence claim.
- Dodge factory sheet directly prints fractional millimetres; validator now accepts positive finite mm at generation and version level. No rounding or hidden inch conversion. Primary verification: nitro-units-50.json.
- e.GO Life only is asserted as series production; other announced programmes remain excluded/pending. One whole-car side-view fallback is explicitly marked as outside the preferred frontthree-quarter angle.
- Claude end-of-alphabet files are checked dynamically. Zotye skip observed in both JSON andMarkdown progress; no external files edited.
- All original883line objects and protected Skoda/Claude snapshots remain unchanged.

## Help wanted

- Historic and regional Dodge exact versions, production boundaries and missing generation photos.
- Dongfeng pending names and badge relationships in night-dongfeng-report.json; do not duplicate group/JV marques.
- Donkervoort missing S7/S8A/D10/FordD8 photo branches; Duesenberg later revivals not covered by the originalfactory snapshot.
- DS missing versions/photos and precise rebadge production boundaries; e.GO clean frontthree-quarter photo.
- C1II/C6(2005), BMW02/E3 and DaihatsuOpti clean full-car preferred-aspect pictures; searches incomplete.

Rebuild: per-make builders, integrate-night-cards.mjs, merge-photo-patches-50.mjs, night-progress.mjs, write-night-review.mjs. No product index generation, commits or publishing. Source/PDF/thumbnail temporary binaries removed; structured evidence retained.
