# Donkervoort handoff

2026-10-27: 8 cards, 13 generation/family records, 20 selected technical versions, 6 inspected Commons photographs. All models currently appear only in the owned catalogue folder; the Claude folder was checked before work and contained no matching make file. `night-donkervoort-report.json` contains proposed registry lines; shared registry and progress files were not edited.

Manufacturer history and heritage pages were read, including the current P24 RS programme. S8A and S8AT are grouped inside S8; Ford/Audi powertrain chapters stay in D8; GT and GTO are separate families. GTO-S/GTO-40 and F22 Bare Naked/Final Five are aliases/editions, not duplicate model cards. Not all editions have a completed version row. D10's small-series status is documented; individual road-registration details remain unverified.

Unresolved factory-page inconsistencies are recorded rather than copied blindly: D10's kW/hp pairing, Cosworth's power pairing, the original GTO's 380 bhp/240 kW, JD70's units, RS headline versus detailed mass, and Individual Series's 695 versus 680 kg. Rounded nominal capacity was not treated as exact cubic centimetres. Combined consumption remains labelled as combined with unspecified test cycle: a nearby WLTP emissions label alone does not prove the consumption cycle.

Photos: S8AT, D8 Audi AGU, D8 E-gas/270 RS, D8 GT, D8 GTO-40 and F22. Category roots and powertrain subcategories were searched; original/file-page URLs, exact API licence and author metadata remain in `donkervoort-photos/`. Each selected thumbnail was viewed individually. No generational identity was guessed for S7/S8A/D10 or the Ford D8 chapters. Cache binaries were deleted at handoff.

To regenerate data, run the build and then the photo merge script; the build alone intentionally recreates the initial unillustrated records. Validation: `night-donkervoort-validate.mjs` performs strict TypeScript assignment for cards and proposed lines plus unique-slug, chronological and indexed-null checks. The Duesenberg finalize script additionally validates the two makes' photo metadata and aspect bounds. No commits or paid actions.
