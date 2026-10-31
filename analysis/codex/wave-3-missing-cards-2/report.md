# wave-3 missing-card batch 2

Baseline 1cc5c24e4d83082af9c5af90581512b6f4917227. Added **63 cards, 88 generation/parallel-model entries, 57 engine rows and 7 facelift stages**. 15 missing cards remain from the original queue. No existing card or generation was edited, removed or reindexed; all old listing generation IDs remain unchanged.

| Line | Entries | Engines | Facelifts |
|---|---:|---:|---:|
| ac-cars/378-gt-zagato | 1 | 0 | 0 |
| automobili-pininfarina/b95 | 1 | 1 | 0 |
| daewoo/gentra-uzbekistan-2013-introduction | 1 | 0 | 0 |
| fiat/qubo-l | 1 | 2 | 0 |
| ford/f-150 | 9 | 0 | 0 |
| ford/maverick | 1 | 0 | 0 |
| mahindra/scorpio-pik-up-goa-pik-up-getaway | 2 | 0 | 0 |
| maruti-suzuki/esteem | 1 | 3 | 2 |
| maruti-suzuki/grand-vitara-xl-7-import | 1 | 0 | 0 |
| maruti-suzuki/kizashi-import | 1 | 0 | 0 |
| maruti-suzuki/s-cross | 1 | 0 | 0 |
| maruti-suzuki/super-carry | 1 | 0 | 0 |
| maxus/edeliver-5 | 1 | 1 | 0 |
| mclaren/788hs | 1 | 1 | 0 |
| mitsubishi/delica-d-3 | 1 | 0 | 0 |
| mitsubishi/diamante-magna | 5 | 0 | 0 |
| mitsubishi/pajero-junior-pajero-mini | 3 | 0 | 0 |
| morgan/plus-four-cx-t | 1 | 0 | 0 |
| moskvic/2901-van-on-2141-base | 1 | 0 | 0 |
| moskvic/5-crossover | 1 | 0 | 0 |
| nio/et5-touring-et5t | 1 | 1 | 1 |
| omoda/omoda-7-c7 | 1 | 0 | 0 |
| packard/light-eight | 1 | 0 | 0 |
| plymouth/champ | 1 | 0 | 0 |
| plymouth/tc3 | 1 | 0 | 0 |
| plymouth/trail-duster | 2 | 0 | 0 |
| pontiac/sunrunner-canada-geo-tracker-twin | 1 | 0 | 0 |
| ram/promaster-van-in-models-auto-no-line-fiat-ducato-rebadge-for-north-america | 1 | 0 | 0 |
| renault/duster-renault-badged-non-eu | 3 | 19 | 0 |
| renault/logan-renault-badged-non-eu | 2 | 3 | 0 |
| renault/sandero-renault-badged-non-eu | 2 | 8 | 0 |
| scion/im | 1 | 1 | 0 |
| scion/ia | 1 | 0 | 0 |
| scion/iq | 1 | 0 | 0 |
| tata-motors/tata-aeris-alias-of-tigor | 1 | 2 | 0 |
| tata-motors/tata-spacio | 1 | 0 | 0 |
| tata-motors/tata-yodha-alias-of-xenon | 1 | 0 | 1 |
| uaz/hunter-315195 | 1 | 0 | 0 |
| uaz/pickup-23632 | 1 | 0 | 0 |
| uaz/profi-2360 | 1 | 0 | 0 |
| venturi/coupe-transcup-200-210-260 | 1 | 0 | 0 |
| vinfast/limo-green-vf-mpv-7 | 1 | 1 | 0 |
| vinfast/minio-green-vf-2 | 1 | 1 | 0 |
| wolseley-motors/wolseley-viper | 1 | 0 | 0 |
| wuling-motors/wuling-almaz | 1 | 0 | 0 |
| wuling-motors/wuling-cloud-ev | 1 | 1 | 0 |
| wuling-motors/wuling-cortez | 1 | 1 | 0 |
| wuling-motors/wuling-sunshine-zhiguang | 4 | 1 | 0 |
| zaz/tavria-pick-up-11055 | 1 | 0 | 0 |
| zotye-auto/z360-alias-of-z300 | 1 | 0 | 0 |
| mitsubishi/asx-vr-e-foxtron-based-bev | 1 | 0 | 0 |
| mercedes-benz/eqt | 1 | 1 | 0 |
| maruti-suzuki/zen-estilo-estilo | 1 | 0 | 0 |
| maserati/2-24v-4-24v-4-18v | 3 | 2 | 2 |
| salmson/2300-s | 1 | 0 | 0 |
| salmson/grand-sport-gs | 1 | 1 | 0 |
| studebaker/2r-3r-truck | 1 | 3 | 1 |
| studebaker/power-hawk | 1 | 2 | 0 |
| plymouth/arrow | 1 | 0 | 0 |
| plymouth/scamp-pickup | 1 | 0 | 0 |
| uaz/uaz-69-gaz-69-built-in-ulyanovsk | 1 | 0 | 0 |
| wartburg/wartburg-motorwagen-eisenach-decauville-licence | 1 | 1 | 0 |
| santana-motor/santana-2500-series-iv-super-cazorla | 1 | 0 | 0 |

## Scope and source decisions

- Source URLs are on every added generation and engine. Infobox/prose evidence is in survey.json and report.json; independently reviewed web-source facts are explicitly marked in plan.mjs. Table engine provenance is in engine-evidence.json.
- F-150 starts with the actual F-150 badge in 1975, not the 1948 F-Series. The US tenth generation starts at its November 1995 production date; 1997 is its model year. Heavy-duty and regional F-Series continuations were excluded from main F-150 dates. The ninth-generation end is noted as inferred from its F-150 replacement, rather than copying the later heavy-duty end.
- Indian S-Cross and Super Carry, Renault-badged Duster/Logan/Sandero, Pontiac Sunrunner and Ulyanovsk GAZ-69 keep their regional/badge periods; parent-model dates are not blindly copied. Imported Kizashi/XL-7 use the identified underlying generation production dates and do not claim Indian availability throughout that period.
- Diamante/Magna, Junior/Mini and the combined Maserati submodels retain separately identified concurrent streams within the existing combined line. No existing card structure was split or merged.
- Announced B95, Scorpio Lifestyler and ASX VR-e are marked announcement-only. AC 378 and cancelled Moskvich 5 have no asserted serial-production years. Power Hawk retains its known model year in its name, with unknown calendar production dates. Open ends marked unknown are not assertions of continuing production. See remaining-and-partial.json.
- Added dates/facelifts are representative sourced coverage. Venturi Transcup and several other histories remain partial; creation of a card does not certify all generations, body variants or engines.

## Validation

Run: node analysis/codex/validate-missing-cards.mjs --root=analysis/codex/wave-3-missing-cards-2

PASS: all 4707 existing source/public cards unchanged; 837 drawing files and 1806 statistics generation keys valid. Drawings, holds, stats and listing-stats are unchanged. Source-line generation selectors match the new cards. Existing generations did not move or change dates, so this batch did not require a raw-statistics rebuild. Previously unmatched raw records have not been silently reassigned.

Card index: +51955 raw bytes / +6236 gzip bytes. Compiled worker size, build, typecheck and page rendering were not checked.

## Remaining missing cards

- mazda/cx-5e
- microcar/m-go-models-auto-has-0-microcar-rows
- moskvic/2315-pickup-on-2140-base
- omoda/omoda-9-c9
- opel/rocks-e-rocks-electric-model-line-l6e-quadricycle-decide-whether-it-belongs-in-auto
- packard/packard-1958-sedan-hardtop-station-wagon-packardbaker
- plymouth/suburban
- pontiac/strato-chief-canada
- pontiac/wave-canada-rebadged-chevrolet-aveo-t200
- salmson/al
- santana-motor/santana-cajal
- santana-motor/santana-series-ii-iia-iii-88-109-licensed-land-rover
- studebaker/lark-cruiser-cruiser
- studebaker/lark-daytona-daytona
- venturi/atlantique-260-300-300-biturbo

These need another model-specific source/curation pass; an unsuccessful source request or ambiguous parent article is not proof that facts do not exist. Original 84 structural signals have not yet been processed. The refreshed 85-line signal scan includes newly sourced parallel regional streams and must not automatically close their open ends.
