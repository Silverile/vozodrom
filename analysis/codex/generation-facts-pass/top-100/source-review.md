# Source and scope review

The selection is frozen before any edits: 100 incomplete generations ranked by **their own** Czech registered fleet (`gens[index].fleet.n`). The last selected generation has 11,699 vehicles. Filled generations do not cause replacements from the larger queue.

`facts.json` contains one source URL, a locator and a method for each individual value/list member. Original manufacturer catalogues remain manufacturer sources when hosted by a dealer or brochure/manual archive. Original contemporary road tests are marked separately. The Valeo application identifies the exact first-generation Berlingo model. Thirty-six facts reuse existing reviewed technical versions of the same generation: the validator checks their original SHA-256 and exact transmission/drive value. This does not imply a new independent reading of every historical version source in this turn.

Lists mean documented options, not an exhaustive production-year/market matrix. CVT and Multitronic simulated ratios are never physical forward gear counts. C3's conventional automatic is confirmed by the April 2004 Citroën UK price list; that source does not give a gear count, so it remains null.

Scalar references are deliberately narrow:

- Fabia I and III widths are explicitly common across the bodies tabulated by the manufacturer. Different body lengths/heights/boots stay empty.
- Kodiaq I uses the standard 2017 factory body table; the height is not a guessed 5/7-seat boot conversion.
- Karoq receives only the documented standard body length. VarioFlex boot capacity, drive-dependent wheelbase and remaining height are held.
- Scala and Kamiq use the 2024 standard European petrol body and upright rear-seat boot.
- Citigo uses the dominant petrol configuration (84.58% of its generation fleet in the unchanged public aggregate). The 2017 factory table distinguishes petrol wheelbase 2420 from G-TEC 2421, and petrol boot 251 from G-TEC 213. The source note explicitly excludes CNG/EV boot values. Door-dependent width and suspension-dependent height remain empty.
- Tucson NX4 uses the **short European** body, wheelbase 2680, not the longer overseas version. Height is the standard body without roof bars/N Line.
- Yaris XP130 uses the 2011 European standard hatch, excluding lowered SR; boot is the 286-litre upright-seat VDA figure, not roof-loaded 347. XP90 receives height only; its sliding-seat boot range 272–363 is held.
- S-Max I uses Ford's 2006 standard European body; width 1884 excludes mirrors, whereas 1854 is the bare body-in-white measurement. Seat-dependent capacity remains empty.
- Touran II uses the 2016 standard European factory body matching its existing length/width.
- ASX I uses Mitsubishi's UK MY2011 standard body: all four petrol/diesel 2WD/4WD columns give the same dimensions and minimum VDA boot. These are a dated reference, not the dimensions of every later facelift.
- Škoda 130/135/136 uses the original manufacturer historical sedan profile; a wheelbase absent from that profile is not invented.

Multi-body lines, commercial lengths/wheelbases/roofs, seating layouts and unmatched reference conditions are recorded per remaining field in `review.json`. One body key does not necessarily mean one geometry: Rapid Liftback/Spaceback share a listing key, and vans/MPVs often have several lengths. The existing Fusion length4020 conflicts with Ford UK's 2007 catalogue4013; its missing geometry remains empty pending a coherent reference correction.

`source-access.json` records local PDF download/extraction attempts. Several direct URLs return403 or fail local certificate validation. Alternative primary copies or web-indexed original tables were used where explicitly documented. C3's2002 German factory drive table was visible in search extraction despite direct403. The48 downloaded PDF/text copies are retained in the ignored local directory `final-rebuild/source-copies/`; they are outside the publication artifacts. Source locators and facts remain in the reviewable files. No TLS validation was disabled.

No generation structure, engine row, technical version, body key, prose, drawing, alias or statistics is changed. The old line-fleet technical queues are outside the new100-generation scope.
