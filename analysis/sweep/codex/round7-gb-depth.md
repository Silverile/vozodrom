# Round 7: selected BYD / GAZ depth, 2026-10-29

This is bounded work on three card lines, three generation rows and three existing technical trims. Neither make is completely verified.

- BYD Atto 3 EU 10/2022: populated the missing generation-level electric engine descriptor (150 kW) and FWD metadata, marking coverage partial. Existing 150 kW / 310 Nm / 7.3 s / 160 km/h trim agrees with the European manufacturer leaflet and EV Database. No worldwide motor-range claim.
- BYD Dolphin EU 2025: populated the same selected 150 kW electric/FWD descriptor and partial flag; filled both existing Comfort / Design top-speed nulls with 160 km/h. Irish MY25 Q3 manufacturer guide and EV Database MY25 agree. No production-year change, new trim, transmission assumption or photo change.
- GAZ-31105: resolved `to: null` to **2008**. NIANN's contemporary 26 January 2009 report directly attributes December 2008 cessation to the GAZ president; Kolesa's independent history confirms late-2008 cessation and distinguishes 2009 paperwork. The existing `ended` status is unchanged. Exact final month/day remains outside the catalog claim.

26 audit entries: BYD 20, GAZ 6. Of these, 9 change non-metadata fields: 6 BYD technical specifications, 2 coverage flags and 1 GAZ production endpoint. The other 17 attach sources, field provenance, clear resolved review placeholders or update the GAZ discrepancy note. Existing report arrays are retained and appended.

Sources read: European BYD Atto 3 10/2022 leaflet; EV Database Atto 3 MY23–24; Irish BYD Dolphin MY25 Q3 guide; EV Database Dolphin MY24 and MY25; BYD UK media Dolphin; NIANN 26 January 2009 manufacturer-president statement; Kolesa GAZ-31105 history; Za Rulem GAZ-3102 history. Search also exposed a Dolphin luggage-volume discrepancy: Irish MY25 guide 364/1329 L versus EV Database MY25 and UK media 345/1310 L. Prior supported 345 L retained and conflict appended; market/measurement basis unresolved.

Limits: Dolphin kerb mass and EU unladen mass differ by convention, so mass nulls were retained without arithmetic conversion. GAZ-3102 endpoint, other GAZ models, worldwide BYD generations, facelift/SOP boundaries, transmission details and photos need further work. No photos were newly inspected or certified. No publication, paid service or Git writes.

Validation: `round7-gb-verify.cjs` passed exact replay of all 26 new card audit entries from `round7-gb-baseline.json`, prior report-array prefix preservation and strict isolated TypeScript assignment of both complete card files to `CatalogModelCard[]`. Temporary typing file removed by verifier. `python` and the prompt-provided Python executable were unavailable; absolute Node executable was used successfully.
