# Mazda photo pass 78

Merge **batch001.json only**. Six selected Commons photographs, keyed to the exact existing line/generation name. Selection JSON files are intermediate evidence, not additional merge patches.

All six candidates were visually inspected for full-car framing, approximately 5% or greater margins and preferred front three-quarter angle; all use original aspect 1.4–1.7. Author/licence and non-null licence URL come directly from exact-file API extmetadata, with no footer inference or invented licence. Root remains the only catalogue writer.

MX-6 uses a different credited photograph from the rejected photographer-missing source. MX-30's 2024 R-EV photo illustrates the model generation, not all versions or the original EV powertrain. Search matches that were CX-5/MX-5, rear-only, obstructed or too tight were not accepted. Commons search was bounded; no absence claim is made.

Offline verification: `node analysis/codex/mazda-photos-78/validate.mjs`. This checks the six exact generation keys, unique destinations, strict CatalogModelCardPhoto shape, metadata author/licence presence and aspect, without editing the catalogue. Search/sheet/choose scripts are optional online research tools. Temporary image previews and type fixtures are removed before handoff.
