# Structural review of 84 signals

Baseline 6adfe58e7dece1984aa511c6e26c4d2b6afd0fff. Reviewed all 84 queued lines. Corrected **54 generation entries across 45 lines**. Consolidated eight same-chassis body/wheelbase/drivetrain families, retiring 11 duplicate generation entries. No engine or facelift facts were added or discarded; declared index maps accompany each consolidation. Existing engines, trims, photos, facelifts, codes and drawing stages are preserved. Sources/proofs per changed field are in structure-pass-6-plan.mjs and report.json; raw source observations are in research.json.

| Line | Index and production dates before → after |
|---|---|
| ac-cars/cobra | 3: ?–1969 → 1966–1969 |
| acura/legend | 0: ?–1990 → 1985–1990 |
| adler/favorit | 0: ?–1933 → 1929–1933 |
| alfa-romeo/8c-historic | 0: 1931–? → 1931–1935; 1: ?–1939 → 1937–1938 |
| alpina/b10 | 3: ?–2003 → 1997–2003 |
| alpina/b8 | 0: ?–1998 → 1995–1998 |
| amc/matador | 1: ?–1978 → 1973–1978; 2: ?–1978 → 1973–1978 |
| auto-union/1000 | 0: ?–1963 → 1958–1963; 1: 1960–? → 1960–1969 |
| baic/senova-x55 | 1: ?–2025 → 2017–2025 |
| baic/u5 | 0: ?–2017 → 2013–2017; 1: 2018–? → 2017–? |
| brilliance/bs2 | 1: ?–2013 → 2009–2013 |
| brilliance/h230 | 2: ?–2020 → 2017–2020 |
| bristol-cars/blenheim | 0: ?–1997 → 1993–1997 |
| chery/eastar | 0: ?–2011 → 2004–2011 |
| ds-automobiles/ds-4 | 0: ?–2018 → 2015–2018 |
| force-motors/gurkha | 0: ?–2019 → 2008–2019 |
| geely/mk | 1: ?–2017 → 2008–2017 |
| ginetta/g4 | 0: ?–1968 → 1961–1969 |
| haval/h5 | 0: ?–2020 → 2010–2020 |
| hillman/minx | 0: 1932–1939 → 1931–1939; 1: ?–1948 → 1945–1948 |
| hindustan-motors/ambassador | 0: ?–1963 → 1957–1963 |
| hudson/wasp | 0: ?–1954 → 1952–1954 |
| infiniti/i | 0: 1995–? → 1995–1999; 1: ?–2004 → 1999–2004 |
| infiniti/m30 | 1: ?–1992 → 1991–1992 |
| infiniti/q60 | 0: ?–2015 → 2013–2015; 1: ?–2015 → 2013–2015 |
| infiniti/q70 | 1: ?–2019 → 2014–2019 |
| innocenti/mini-bertone | 1: ?–1990 → 1982–1990 |
| izh/2126 | 1: ?–2005 → 2000–2005 |
| jaguar/e-type | 2: ?–1968 → 1966–1968 |
| jaguar/f-type | 1: ?–2024 → 2014–2024 |
| jaguar/xf | 4: 2016–? → 2016–2025 |
| jeep/commando | 0: ?–1971 → 1966–1971 |
| jeep/wagoneer | 0: ?–1983 → 1962–1983 |
| lamborghini/countach | 0: ?–1990 → 1974–1990 |
| land-rover/freelander | 1: ?–2006 → 1997–2006 |
| ligier/js4 | 1: ?–1987 → 1982–1987 |
| lotus/evora | 0: ?–2021 → 2009–2015 |
| maruti-suzuki/800 | 0: 1983–? → 1983–1986; 1: ?–2014 → 1986–2014 |
| nissan/interstar | 0: ?–2010 → 2002–2010 |
| ram/1500 | 0: ?–2024 → 2008–2024 |
| ram/2500 | 0: ?–2018 → 2009–2018 |
| ram/3500 | 0: ?–2018 → 2009–2018 |
| ford/explorer | 1: 1994–2001 → 1994–2003; 2: 2001–2005 → 2000–2005 |
| wuling-motors/rongguang | 1: 2025–? → 2026–? |
| geely/okavango | 0: 2020–? → 2020–2025 |

## Same-chassis body consolidations

| Line | Before | After | Index map |
|---|---|---|---|
| infiniti/m30 | F31 – kupé 1989-1992 / F31 – kabriolet null-1992 | M30 (F31) 1989-1992 | {"0":0,"1":0} |
| infiniti/q60 | V36 – přejmenované kupé null-2015 / V36 – přejmenovaný kabriolet null-2015 / CV37 – nové kupé 2016-2022 | Q60 I (V36) 2013-2015 / CV37 – nové kupé 2016-2022 | {"0":0,"1":0,"2":1} |
| infiniti/q70 | Y51 – Q70 2013-2019 / Y51 – Q70L null-2019 | Q70 / Q70L (Y51) 2013-2019 | {"0":0,"1":0} |
| izh/2126 | 2126 – zadní pohon 1990-2005 / 2126 – 4×4 null-2005 | 2126 Oda 1990-2005 | {"0":0,"1":0} |
| jaguar/e-type | Series1 – kupé 1961-1968 / Series1 – roadster 1961-1968 / Series1 –2+2 null-1968 / Series2 1968-1971 / Series3 –V12 1971-1974 | E-Type Series 1 1961-1968 / Series2 1968-1971 / Series3 –V12 1971-1974 | {"0":0,"1":0,"2":0,"3":1,"4":2} |
| jaguar/f-type | X152 –roadster 2012-2024 / X152 –kupé null-2024 | F-Type (X152) 2012-2024 | {"0":0,"1":0} |
| jaguar/xf | X250 – sedan 2007-2015 / X250 –Sportbrake 2012-2015 / X260 – sedan 2015-2024 / X260 –Sportbrake 2017-2024 / XFL – dlouhý rozvor 2016-null | XF I (X250) 2007-2015 / XF II (X260 / XFL) 2015-2025 | {"0":0,"1":0,"2":1,"3":1,"4":1} |
| land-rover/freelander | L314 – pětidveřový 1997-2006 / L314 – třídveřový softback/hardback null-2006 / L359 – Freelander 2 2006-2014 | Freelander I (L314) 1997-2006 / L359 – Freelander 2 2006-2014 | {"0":0,"1":0,"2":1} |

Body-specific dates, dimensions, photos and source notes remain in source-card bodyVariants; full original records are in body-merge-originals.json. This prevents year-only data from becoming invented coup?/roadster/4x4 cohorts.

## Parallel histories retained

- retained-parallel-production: 33
- corrected: 45
- retained-with-explicit-scope: 4
- identified-calendar-boundary-unresolved: 2

A successor launch does not end a separately produced body, powertrain, export or commercial derivative. Examples: C3 Europe/India, MINI J01/ICE, Land Cruiser J70/station-wagon/light-duty branches, GLE SUV/coupe, Chinese Tayron I, Niro Plus, MG5/Roewe i5 badges, HiAce H200/H300, regional Haval/Hongqi and multiple Wuling branches. W463 is an officially reused code, not a duplicate technical-sheet shell. The remaining mechanical scan has 41 signals; it intentionally still flags documented overlaps and explicit unknown/prototype periods. It is not a count of unreviewed lines.

Calendar caveats: DS 4 and Interstar use their own badge periods, not parent Citroën/Master starts. RAM DS starts 2008 before the standalone Ram brand; Heavy Duty starts actual October 2009, not MY2010. Explorer II includes the three-door continuation to 2003 while the four-door ended 2000. Ginetta G3 dates are excluded from G4; Countach prototype 1971 is excluded from 1974 series. Hudson's specific production infobox gives 1952 while its family envelope says 1951; the discrepancy is explicitly noted. XFL end 2025 follows JLR's published Chinese production plan. Alfa 2900B uses its regular 1937–1938 series, excluding the separately parts-assembled 1941 car.

## Coupled data and validation

All index maps are explicit in changes[].oldToNew. Freelander II drawing moves 2 -> 1 with its SHA-256 verified; five external engine-evidence records move 2 -> 1. Holds follow their surviving drawing. Updated 7 front-index date envelopes. There are 47 year-based listing-ID changes; see changes[].idChanges. Existing chassis code IDs are preserved. No stored listings were queried or migrated.

Raw IS TP (1,094 days) and register statistics recomputed for 260 makes: acura, adler, aeon-motor, agados, aixam, ajs, alfa-romeo, alpina, alpine, aprilia, arctic-cat, ariel, aro, aston-martin, audi, austin-motor-company, auto-union, avia, babetta, baic, barkas, belarus, benelli, bentley, beta, bimota, blata, bmc, bmw, bobcat, bsa, bugatti-automobiles, buick, byd, cadillac, cagiva, can-am, case-ih, caterham, caterpillar, cfmoto, chery, chevrolet, chrysler, citroen, claas, cupra, cz, dacia, daelim-motor, daewoo, daf, daihatsu, daimler-company, dangel, datsun, derbi, deutz-fahr, dieci, dkw, dnepr, dodge, dongfeng, ds-automobiles, ducati, fantic-motor, faymonville, fendt, ferrari, fiat, fisker, fliegl, ford, forthing, fuso, gas-gas, gaz, geely, gilera, gmc, great-wall, harley-davidson, hillman, hitachi-construction-machinery, honda, humbaur, hummer, husqvarna, hyosung, hyster, hyundai, ikarus, indian, infiniti, innocenti, international-harvester, irizar, isuzu, italjet, iveco, iveco-bus, izh, jac, jaecoo, jaguar, jawa, jcb, jeep, jensen-motors, john-deere, jungheinrich, kamaz, karosa, kawasaki, keeway, kia, kogel, komatsu, krone, ktm, kubota, kymco, lada, lamborghini, lancia, land-rover, landini, laverda, leapmotor, lexus, liaz, liebherr, lifan, ligier, lincoln, linhai, loncin, lotus, lynk-co, mahindra, malaguti, man-truck-bus, manitou, maruti-suzuki, maserati, massey-ferguson, matchless, matra, maxus, maz, mazda, mclaren, mercedes-benz, mercury, merlo, mg, microcar, mini, mitsubishi, montesa, morgan, morris, moskvic, moto-guzzi, moto-morini, mv-agusta, mz, neoplan, new-holland, nissan, nooteboom, norton, nsu, oldsmobile, omoda, opel, otokar, peugeot, piaggio, plymouth, polaris, polestar, pontiac, porsche, praga, proton, ram, renault, renault-trucks, rieju, rolls-royce, rover, royal-enfield, saab, same, santana-motor, sany, saturn, scania, schmitz-cargobull, schwarzmuller, seat, segway, setra, sherco, silence, simca, simson, skoda, smart, ssangyong-kgm, steyr-tractor, still-gmbh, subaru, super-soco, sur-ron, suzuki, swm, sym, talbot, tata-motors, tatra, temsa, terex, tesla, tgb, toyota, trabant, triumph, uaz, ural, ursus, valtra, van-hool, vauxhall, vespa, vezeko, vmoto, voge, volkswagen, volvo, voyah, wacker-neuson, wanderer, wartburg, wielton, willys, xcmg, xpeng, yale-materials-handling-corporation, yamaha, yanmar, zastava, zaz, zeekr, zero-motorcycles, zetor, zil, zongshen, zoomlion. The bare-code matcher fix triggers a single final global snapshot rebuild. Initial, Geely-only and body-only intermediate outputs were discarded. No mixed matching epochs were published. Bare J01 and longer CF510V now match complete type tokens; embedded fragments do not. All make totals and all publishable raw generation cohorts were checked before replacement. Empty published generation groups have explicit privacy/unknown-year explanations in statistics.json. Line-total deltas: 29; details in that file. Generation allocation uses production year and explicit chassis hints where present; unknown type records still use year heuristics. The eight common-chassis body groups are now single real generations, and no body-cohort totals were fabricated.

Run node analysis/codex/structure-pass-6.mjs --validate. PASS: 4708 untouched source/public cards unchanged, all existing engines retained, 837 drawing files, unchanged holds and 1836 statistics keys verified. Global engine audit also passes. Card-index delta 9096 raw bytes / 1722 gzip bytes. No build, live rendering or compiled Worker measurement was run.

## Consumer issue for Claude

listing-context.ts:74 chooses the first W463 match (1990–2018) even for year 2019; cardGeneration at listing-catalog.ts:49 also takes the first exact code match. Both need year/range-aware selection. The data retains the official code. See consumer-finding.json for a reproduced fixture. The matching aliases are prepared in src/data/catalog/generation-id-aliases.json; wire them into the listing consumer before year fallback: stale Freelander ID ?–2006 for year 2006 currently falls to Freelander II (index 1), but its declared alias is the merged Freelander I (index 0).

## Follow-ups and next batch

- abarth/1000: Identified concurrent Bialbero/Zagato derivative; generic 850/1000 article does not establish its exact last series-production year.
- bentley/batur: Distinct limited-run coupe/convertible bodies. Official source establishes 18 coupes, not an end year; no forced successor boundary.
- geely/emgrand: SS11/SS21 parallel production; FE-3 2014–2021 currently combines two Wikipedia-labelled evolutions, requiring a separate generation/facelift decision.
- mahindra/cj: Museum identifies overlapping CJ variants and starts, but exact ends of CJ3B/CJ4/CJ540DP/CJ640DP remain unconfirmed; no successor-year truncation.
- volkswagen/kaefer: KdF entry explicitly describes pre-series history; no series start copied from 1938 prototype. Post-war series starts December 1945.
- microcar/m-go: Previously sourced 2008–2014/2014–2024 split still needs current photo attribution and Microcar raw rebuild.
- toyota/land-cruiser: Existing line begins with J70 and omits earlier BJ/FJ/J20/J40/J50/J60 historical series; the present pass validates overlap only, not complete line history.
- mercedes-benz/trida-g: Official W463 code reused. Listing consumer selects first code match without checking year; Claude must fix listing-context.ts:74 and cardGeneration in listing-catalog.ts:49.

Ordinary wave 3 next: 3647 current no-published-fleet lines, 3551 entries without engine rows. Review in batches around 200 lines; the presence of a card does not certify all historical generations.
