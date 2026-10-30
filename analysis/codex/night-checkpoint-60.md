# Night checkpoint60

Elapsed 16.4 minutes. NEXT: isuzu; 100 makes remain. Saved means source-backed partial coverage.

| Make | Cards | Generation/family records | Selected technical rows | Photos |
| --- | ---: | ---: | ---: | ---: |
| horch | 29 | 39 | 3 | 4 |
| hotchkiss | 36 | 36 | 6 | 2 |
| hudson | 21 | 29 | 1 | 4 |
| hummer | 4 | 4 | 11 | 4 |
| infiniti | 23 | 45 | 7 | 7 |
| innocenti | 14 | 22 | 2 | 5 |
| international-harvester | 14 | 21 | 7 | 5 |

Cumulative: {"makes":94,"cards":2067,"generations":2674,"versions":776,"photos":543} -> {"makes":101,"cards":2208,"generations":2870,"versions":813,"photos":600}. Honda photographs6 ->32; Fiat unchanged35.

- Three parallel make researchers plus root Honda photo review and integration; all seven makes frozen. No commits, publishing or application index generation.
- Added141 cards,196 generation/family records,37 selected technical rows,31 make photographs and26 Honda references. Coverage remains partial.
- Honda photos increased6 to32. Of117 generation records,85 still lack photos. Retained360 metadata candidates from categories, subcategories and file searches, using descriptive User-Agent,maxlag5,50-result batches and1.1-second pacing.
- Corrected the1986 Accord photo to generationIII after checking its file identification and body. Regional photos illustrate global generations rather than exact European technical rows. CR-Z uses an elevated front/side view; Hudson HornetII rear three-quarter and Jet frontal views are documented fallbacks.
- CR-VI photo permission is an explicit worldwide public-domain dedication by Mpd0043. The exact file licensing section was checked; its link is the permission URL. No CC0 licence was invented. The600x355 original is modest resolution.
- Removed QX4 wheelbase2700 from card and seed: the source described the related Pathfinder R50, not QX4 specifically. The parent review script preserves this correction after rebuilding.
- Infiniti Q30 rows cover Europe; three Q50 configurations explicitly cover South Africa. They are not represented as Czech or European versions. Model years and production boundaries remain distinct.
- Horch badge dates retain conflicts as null. Hummer has photos for all four lines, but early engine versions remain incomplete. International Harvester covers passenger and light commercial branches without borrowing heavy-truck dates.
- Hotchkiss AM73/614 aliases are merged; civil JH101/JH102 retain conflicting dates as null. Innocenti Porter is limited to the passenger MPV. Engine-scope rows are not full annual price lists.
- The shared Hotchkiss make entry still has country:null and defunct:false. Reported for Claude review; ownership boundary preserved.
- Removed372 root review images; workers removed their own images and temporary checks. Structured metadata, credits, patches and source evidence remain.
- Original883 line objects and protected Skoda/Claude files passed preservation checks. NEXT: isuzu. Fifteen Claude-owned makes are skipped, including newly present Volvo.

## Help wanted

Horch:851periods,853production/delivery endpoints,853Amass/speed,P240badge-transitiondates and coachbuilder specifications. Hotchkiss:originalearlycatalogues,Gregoire/civilJeep enddates and fullconfigurationbrochures. Hudson:annualseries/model-year boundaries and completeversiontables. Hummer:pre-AlphaH1,H2Vortec6.0,H3early3.5andbody-specificfaceliftdata. Infiniti:QX4-specific dimensions,olderEUengines,Q30directbrochureavailability,clearQ50European tables. Innocenti:C/Regent/Mini boundaryconflictsand originaltechnicalbrochures. InternationalHarvester:earlypickupbranch productiondates andbroaderScout/Travelallversions. Honda:JazzIV,EuropeanAccordVII/VIII,CivicV/VI,CR-VIII/Vandremaining85generationphotos; furtherqueriesare warranted andsearchesarenotexhausted.

Rebuild make-specific pipelines, then  night-infiniti-parent-review.mjs,integrate-night-cards.mjs,merge-photo-patches-60.mjs,night-honda-validate.mjs,night-progress.mjs,write-night-review.mjs. Earlier make builders can overwrite enrichment; finish with integration and the latest photo merger. Application index and build remain Claude-owned.
