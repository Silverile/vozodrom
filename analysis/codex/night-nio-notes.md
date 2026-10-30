# NIO — delivery 78

Ten sourced road-model lines and fourteen generation records. ES8/EL8, ES6/EL6 and ES7/EL7 are aliases, not duplicate lines. ET5 Touring/ET5T is a separate body line from the ET5 sedan. ES8 has three generations, ES6 and EC6 two. 2025 and 2026 equipment updates are grouped with their corresponding technical generations pending a detailed facelift chronology.

Dates refer to the first delivered production-car year confirmed by manufacturer releases/investor reports, not an exact assembly-start date or an earlier announcement/model-year label. ES9 actual deliveries from May 2026 are confirmed in NIO's September 2026 investor report. Exact historical production end dates remain null, rather than inferring them from successor announcements. Detailed generation-code/end reconciliation remains open.

EP9 is excluded from this road catalogue: a direct Q&A with NIO says the limited-sale car is track-only. Other contemporary press called it road-legal while reporting lap records, so those headlines are not sufficient evidence of registration approval. No claim is made that a prototype's public-road testing permit homologates the EP9. EVE, rumours and announced concepts are excluded. ONVO and firefly are separately named brands in the investor report, not NIO line entries.

Selected technical coverage is partial. Battery-specific ET5 Touring EU manual rows are corroborated by the Dutch 06/2023 OEM price list for identical masses/dimensions and battery labels; that brochure also gives 360 kW/700 Nm and maximum WLTP ranges. Manufacturer manual mass is **unladen excluding driver**; MRO including driver is explicitly separate. The China-hosted manual returns a different mass table, which is not substituted into the EU specification. Model year remains null because brochure publication date is not model year. Do not transfer these specifications into the China 2025 ET5T update.

ET5 sedan Greek OEM price-list rows keep Standard/Long Range names, actual source scopes and unknown year. Published WLTP consumption and range intervals are described in the scope note, not collapsed to an arbitrary scalar. EL7 battery-specific rows use the German 06/2023 price list; scalar range is explicitly its published maximum, not every configuration's result. EL6 European launch row has an unidentified battery: this is labelled, not guessed. The ES8 84kWh row uses the 2019 manufacturer report and NEDC rather than applying its range to a European EL8.

PowerStandard, unsupported gear counts, consumption cycles, mass and 0–100 remain null where the exact selected source does not establish them. No hp, imperial speed or 0–60 conversion was used.

Commons exact-file API author/licence metadata was retained. Every chosen photo was visually inspected; erroneous ET5 Touring matches were remapped from sedan, and ES8 II / ES6 II photographs from broad-name queries were matched to the correct generation. Four selections are explicitly declared **4:3 aspect fallbacks**, outside the preferred 1.4–1.7: ES8 I, EC6 II, EC7 and ES9. They retain the whole vehicle with approximately 5% or greater margins. Tight matches were rejected. ES8 III's inspected candidates were too tight; its photo remains null pending a better file. Missing photo is not a source-exhaustion claim.

Offline rebuild:

1. `node analysis/codex/night-nio-build.mjs`
2. `node analysis/codex/night-nio-refine.mjs`
3. `node analysis/codex/night-nio-eu-versions.mjs`
4. `node analysis/codex/night-nio-photos/finalize.mjs`
5. `node analysis/codex/night-nio-validate.mjs`

Search and thumbnail scripts are optional online research tools; reviewed batch JSON is sufficient for offline rebuilding. Binaries are removed before handoff. Main gaps: most EL8/ET7/ET9/ES9 and Chinese engine/battery tables, power standards, exact model years, facelift dates, consumption/weight details and ES8 III photograph. Not a complete version-table claim or proof that further sources cannot be found.
