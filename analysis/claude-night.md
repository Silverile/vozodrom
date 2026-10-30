# Claude night log (Z→A helper)

Claude writes `src/data/model-cards/<make>.json`, starting from the end of the alphabet. Codex works A→Z in `src/data/catalog/model-cards/`.
Nothing is committed or published. Everything is left for the morning review.

## Check-in 2026-10-27 ~02:00 (Prague time)

- Usage: 5-hour limit 0% (resets 06:50Z), weekly 18%.
- Codex: alive. Delivery 7d86a4c0a3 running (task #50); 2 codex.exe processes; progress log says NEXT: dodge. It has done the letters A–D (≈66 makes in catalog/model-cards).
- Started 4 agents (Z→A): zotye-auto, zeekr, zaz, zastava.

## Makes done

| make | lines | generations | versions | photos | notes |
|---|---|---|---|---|---|
| zotye-auto | 22 (all isAddition) | 24 | 16 | 21/24 | Thin sources (China only). Photos to check: Z700 aspect 1.72, E200 door open. Not added: E20 EV, Traum Meet 5, Jiangnan TT, Wink Y01. models-auto lists "Hawtai Lusheng E70" under zotye, which is wrong. |
| zastava | 7 (all isAddition) | 7 | 26 | 7/7 | Photos for 128 and 10 have aspect 1.38–1.39. Not added: AR51/55 Campagnola, 1100T/620B vans, 1400BJ. The catalogue has duplicate slugs yugo-q15781 and yugo-q21205906. |
| zeekr | 9 (all isAddition; mix is a new slug) | 9 | 44 | 8/9 | 007 GT kept inside the 007 card. No photo for 8X (only 4:3 photos). Conflicts on 9X boot and 009 power. |
| xpeng | 14 (all isAddition; p7 and p7-plus are short slugs; the catalogue has p7-q…) | 15 | 62 | 10/15 | No photo for L03, G9L, GX, L05, IDENTY X. P7+ and M03 filed as sedan because liftback is missing from the types file. |
| wolseley-motors | 54 (all isAddition) | 71 | 91 | 32/71 | Pre-war data mostly from de.wiki (Culshaw & Horrobin), with little power data. Top speeds are The Motor road tests. Hornet Mk III end year 1969 kept despite a conflict (in needsReview). |
| zaz | 11 (all isAddition; new: tavria-pick-up, sens, lanos, chance) | 14 | 38 | 8/14 | Tavria Nova put inside tavria, though the catalogue also has zaz-1102-tavria-nova. Forza and Vida photos have a logo overlay. Lanos photo not searched because Commons rate-limited. 65 needsReview entries. |
| willys | 18 (10 isAddition) | 27 | 42 | 21/27 | Wikipedia rate-limited, so there was little cross-checking. CJ-5 and CJ-6 run to the 1980s under the Jeep brand. Not covered: Overland, Ford GPW, IKA Estanciera. |
| wiesmann | 7 (roadster-mf4, roadster-mf5 and project-thunderball are isAddition) | 7 | 16 | 5/7 | MF28 is a version inside mf30. Many years conflict (null). No photo for GT MF5 or Thunderball. |
| wuling-motors | 39 (all isAddition) | 49 | 85 | 28/49 | Specs come almost only from en.wiki. **Uses transmission "cvt" and "e-cvt", which are not in types.ts** (like Toyota). EREV filed as petrol-phev. binguo vs the catalogue's wuling-bingo. Sunshine is under saic-motor in models-auto. |
| wey | 13 (all isAddition; 7 new slugs) | 14 | 49 | 10/14 | EU versions from ADAC. Tank 300 covers only its Wey period (2020–21). Conflicts on Wey 05 and 03 mass. |
| wartburg | 6 (motorwagen is isAddition; the others come from models-auto) | 7 | 26 | 6/7 | auto-data.net is unreliable for Wartburg. 353-tourist and 353-de-luxe are covered inside 353. |
| wanderer | 12 (w14, w15 and w245 are isAddition) | 30 | 63 | 10/30 | de.wiki (Oswald). No torque or acceleration. W 24 photo has aspect 1.39. |
| voyah | 6 (all isAddition; courage and passion-s are new) | 9 | 37 | 4/9 | EU data from fdrive.cz and swisscarinfo. EREV filed as petrol-phev. Dreamer facelift power conflicts between en.wiki and auto-data.net. |
| venturi | 4 (all isAddition) | 4 | 12 | 3/4 | Concepts and race cars left out. Many conflicts on 400 GT and Fétish data. |
| vinfast | 16 (all isAddition; vf-e34 used instead of models-auto's vf31) | 16 | 28 | 12/16 | EU sales of VF 7 and VF 9 not confirmed (only VF 6 and VF 8). VinFast EU site blocks automated access. |
| uaz | 18 (4 isAddition: uaz-69, hunter, pickup, profi) | 22 | 51 | 18/22 | No EU data (ru/en wiki, auto-data.net). The catalogue has uaz-300 and uaz-456 (a truck prototype and an obscure model), which got minimal cards. Hunter status unknown. |
| tvr | 17 (all isAddition) | 29 | 79 | 22/29 | Mostly en/de wiki. Trim kind is "technical-version" (Toyota, Ford and Volvo also use it; the code doesn't care). 0–60 mph not converted to 0–100. |
| volvo | 47 (17 isAddition: ov-4, pv444, amazon, p1800, 140-series, 164, 66, 260, v50, ex60, em90 and others) | 64 | 411 | 63/64 | Mostly de.wiki technical tables. PHEV power is the petrol engine only. V60 D6 PHEV filed as diesel. Variomatic filed as automatic. kind "technical-version". |
| trabant | 4 (all from models-auto) | 4 | 19 | 4/4 | 601 S is covered inside 601. The 600 photo shows a Kombi with stripes. |
| vauxhall | 57 (all isAddition) | 108 | 495 | 89/108 | Modern specs from auto-data.net only (single source). Opel data used where no Vauxhall entry exists. Liftback filed as hatchback. Movano C, Brava and Arena not covered. |
| triumph | 39 (scorpion and twelve are isAddition) | 59 | 100 | 46/59 | en/de wiki only. Several photos have aspect 1.39–1.71. No cards for catalogue slugs tr and fury. |
| tesla | 7 (cybertruck and cybercab are isAddition) | 7 | 49 | 7/7 | Each model is one generation with facelifts. Mostly auto-data.net; ev-database returned 429. Model X photo shows a pre-2021 car; Cybercab photo is the show car. |
| tatra | 18 (10 is isAddition; the others come from models-auto) | 27 | 43 | 25/27 | cs/de wiki and tatraportal.sk (via web.archive). 613-5 treated as a prototype on the way to the 700. No cards for 602, 603 B5, 623, Beta and similar. The 2-603 photo needs checking. |
| tata-motors | 21 (all isAddition) | 25 | 120 | 17/25 | Mostly auto-data.net. EVs kept inside their parent lines. The Safari II photo is the Buzzard show car. Telcoline and Tatamobile not added. |
| talbot | 22 (14 isAddition) | 25 | 76 | 20/25 | Thin per-version data (en/de/fr wiki). Not covered: Matra Bagheera, 1609/1610, 110, Talbot 10. |
| tagaz | 11 (7 isAddition) | 11 | 16 | 6/11 | auto-data.net and auto.ru. Corda and C-30 have no versions. Licensed assembly mentioned in text only. |
| sunbeam | 21 (14 isAddition) | 24 | 30 | 14/24 | en.wiki only (rate-limited, no cross-check). Pre-war cards are thin. Venezia, Vogue and Arrow have almost no data. |
| suzuki | 24 (suzulight, fronte and cervo are isAddition) | 72 | 198 | 50/72 | Versions from auto-data.net only. Carry, Fronte, Cervo and the JDM Alto have no versions. Not covered: XL-7, Ertiga, Wagon R (JDM), Solio, Hustler and other kei cars. |
| studebaker | 22 (6 isAddition) | 39 | 23 | 29/39 | en.wiki only, thin. 10 generations have no versions. Not covered: flight-hawk, sky-hawk, wagonaire, conestoga, speedster. |

**Morning:** the new makes need to go into `src/data/model-cards-index.json` (via `scripts/model-cards-index.mjs`) before the site shows them.

- ~02:11: usage 4%. Codex NEXT: e-go-mobile. Started xpeng.
- ~02:23: usage 7%. Codex NEXT: faw. Started wolseley-motors.
- ~02:36: Started willys.
- ~02:46: usage 14%. Codex NEXT: gaz (83 files in catalog/model-cards). Started wiesmann.
- ~03:00: Started wey.
- ~03:05: usage 16%. Codex alive (delivery 50eb9421ff, task #56, NEXT: geely). Started wartburg.
- ~03:10: Started wanderer.
- ~03:15: usage 20%. Codex NEXT: geely. Started voyah.
- ~03:25: Started volvo (big make).
- ~03:35: usage 23%. Codex NEXT: haval. Started vinfast.
- ~03:40: Started venturi.
- ~03:47: usage 27%. Started vauxhall.
- ~03:55: Started uaz.
- ~04:05: usage 35%. Codex NEXT: isuzu. Started tvr.
- ~04:10: Started triumph.
- ~04:25: Started trabant.
- ~04:10Z+: usage 47% (resets 06:50Z). Codex NEXT: lada. Started tesla.
- Started tatra.
- usage 50%. Codex NEXT: lada. Started tata-motors.
- Started talbot.
- usage 56%. Codex NEXT: li-auto. Started tagaz.
- Started suzuki (big make).
- usage 64%. Codex alive (delivery af0c3bb604, task #70, NEXT: lucid-motors). Started sunbeam, the last new make for this window; talbot, tagaz and suzuki still running.
- usage 70%. Started subaru, the last make (stopping at ~85%).
- usage 72%. Started studebaker (the very last make).

## Summary of the window (~06:00 Prague)
- 30 makes done from Z back to S: zotye-auto, zeekr, zaz, zastava, xpeng, wuling-motors, wolseley-motors, willys, wiesmann, wey, wartburg, wanderer, voyah, volvo, vinfast, venturi, vauxhall, uaz, tvr, triumph, trabant, tesla, tatra, tata-motors, talbot, tagaz, suzuki, sunbeam, subaru, studebaker.
- All 34 files in src/data/model-cards/ pass JSON.parse.
- Usage: 5-hour limit 77% (resets 06:50Z), weekly 30%. Stopped taking new makes near the 85% limit.
- Codex: alive, delivery 557b81a590 (task #74), NEXT: mitsubishi. A→Z queue has reached M.
- Next for Claude (Z→A): ssangyong-kgm, spyker, sono-motors, smart, simca, seres, seat, scion, saturn, …
- Nothing committed or published. No processes killed. Codex-owned files were not touched.

### Morning checklist
1. Rebuild `src/data/model-cards-index.json` with `scripts/model-cards-index.mjs`; the new makes aren't visible without it.
2. Trim `kind`: most files use "version". tvr and volvo use "technical-version", as do parts of toyota and ford. types.ts allows only technical-version/engine-version, and the code doesn't check the field. Pick one value and normalise.
3. Values missing from types.ts: transmission "cvt"/"e-cvt" (wuling) and body type "liftback" (the brief lists it, types.ts doesn't).
4. Almost all lines are isAddition:true, because model-lines-auto.json doesn't have these makes (the slugs come from models-auto.json). Codex/root must merge them into the line lists.
5. Every photo has visualReview:"pending". The questionable ones are noted in the table above.
