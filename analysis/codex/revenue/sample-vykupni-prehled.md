# Výkupní přehled ojetin — ukázka podle generací

Pracovní ukázka k posouzení; neposílat jako certifikovaný podklad pro ocenění či pojistnou sazbu. Žádný údaj není odhadem budoucích nákladů na opravy.

Zdroj: IS TP + registr silničních vozidel (Ministerstvo dopravy ČR). Prohlídky 2023-10-12 až 2026-10-11; agregát registru sestaven 2026-10-31, referenční datum výpisu neověřeno.
[Dokumentace IS TP](https://istp.data.md.gov.cz/resources/istp/opendata/documentation/istp-opendata-schemas-ProhlidkaSeznam-v1.pdf) · [Registr](https://www.dataovozidlech.cz/)

JSON obsahuje všechny dostupné věky a top 5 závad každé generace. Nájezd níže vybírá věk nejbližší 10 letům (při shodě mladší); jde o kvartily odečtů při prohlídkách.

## Octavia

| Generace | Období karty | Vozů v provozu* | Prohlídek | Nájezd: věk / p25 / medián / p75 km |
|---|---|---:|---:|---|
| Octavia I (I (1U)) | 1996–2010 | 198 188 | 407 997 | 13 / 145 000 / 195 000 / 265 000 |
| Octavia II (II (1Z)) | 2004–2013 | 242 624 | 734 848 | 10 / 175 000 / 215 000 / 255 000 |
| Octavia III (III (5E)) | 2012–2020 | 204 868 | 572 765 | 10 / 155 000 / 205 000 / 255 000 |
| Octavia IV (IV (NX)) | 2019–… | 109 660 | 150 486 | 7 / 125 000 / 165 000 / 215 000 |

*Počty podle stávajícího modelového přiřazení; nezaručují přesnou VIN identifikaci.

| Generace | 0–4 | 5–9 | 10–14 | 15–19 | 20–24 | 25–29 | 30+ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Octavia I | — | — | 5,66 % (n=6 251) | 7,69 % (n=17 693) | 8,19 % (n=253 308) | 9,71 % (n=130 695) | 6,00 % (n=50) |
| Octavia II | — | — | 5,17 % (n=132 102) | 7,42 % (n=448 593) | 8,40 % (n=154 153) | — | — |
| Octavia III | 1,07 % (n=8 604) | 2,15 % (n=267 893) | 3,24 % (n=296 268) | — | — | — | — |
| Octavia IV | 1,39 % (n=79 657) | 1,77 % (n=70 829) | — | — | — | — | — |

Míry nevyhovujících prohlídek (výsledek 2/3); vážená aproximace ze zaokrouhlených vstupů. „—“ znamená chybějící vzorek.

Top závady — podíl pravidelných prohlídek s daným kódem (každý kód jednou za prohlídku); všechny věky dané generace:

- **Octavia I:** 4.1.1 Stav a funkce světlometů (16,58 %); 2.1.3 Stav pákového mechanismu řízení (12,95 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (11,63 %); 1.1.12 Brzdové hadice (10,89 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (8,74 %). Řádek věku 30 zahrnuje i všechna starší vozidla.
- **Octavia II:** 4.1.1 Stav a funkce světlometů (12,93 %); 2.1.3 Stav pákového mechanismu řízení (8,60 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (6,68 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (6,01 %); 1.1.12 Brzdové hadice (5,30 %).
- **Octavia III:** 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (4,05 %); 4.1.1 Stav a funkce světlometů (2,19 %); 2.1.3 Stav pákového mechanismu řízení (1,45 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (0,97 %); 6.2.10 Kryty kol a systémy proti rozstřiku (0,65 %).
- **Octavia IV:** 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (2,58 %); 4.1.1 Stav a funkce světlometů (0,38 %); 5.2.3 Kola a pneumatiky – pneumatiky (0,30 %); 2.1.3 Stav pákového mechanismu řízení (0,27 %); 5.2.2 Disky / ráfky kola (0,20 %).

## Fabia

| Generace | Období karty | Vozů v provozu* | Prohlídek | Nájezd: věk / p25 / medián / p75 km |
|---|---|---:|---:|---|
| Fabia I (I (6Y)) | 1999–2009 | 266 053 | 724 052 | 15 / 135 000 / 175 000 / 215 000 |
| Fabia II (II (5J)) | 2007–2014 | 147 065 | 441 518 | 10 / 75 000 / 125 000 / 175 000 |
| Fabia III (III (NJ)) | 2014–2022 | 104 854 | 307 724 | 10 / 75 000 / 115 000 / 165 000 |
| Fabia IV (IV (PJ)) | 2021–… | 48 922 | 34 759 | 5 / 35 000 / 65 000 / 95 000 |

*Počty podle stávajícího modelového přiřazení; nezaručují přesnou VIN identifikaci.

| Generace | 0–4 | 5–9 | 10–14 | 15–19 | 20–24 | 25–29 | 30+ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Fabia I | — | — | — | 8,32 % (n=137 332) | 8,12 % (n=540 927) | 8,29 % (n=45 768) | — |
| Fabia II | — | 2,21 % (n=497) | 4,88 % (n=153 833) | 7,72 % (n=287 188) | — | — | — |
| Fabia III | 1,24 % (n=26 107) | 2,23 % (n=200 572) | 3,26 % (n=81 045) | — | — | — | — |
| Fabia IV | 1,50 % (n=34 001) | 2,43 % (n=740) | — | — | — | — | — |

Míry nevyhovujících prohlídek (výsledek 2/3); vážená aproximace ze zaokrouhlených vstupů. „—“ znamená chybějící vzorek.

Top závady — podíl pravidelných prohlídek s daným kódem (každý kód jednou za prohlídku); všechny věky dané generace:

- **Fabia I:** 4.1.1 Stav a funkce světlometů (23,50 %); 1.1.12 Brzdové hadice (9,79 %); 2.1.3 Stav pákového mechanismu řízení (9,24 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (7,08 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (6,33 %).
- **Fabia II:** 4.1.1 Stav a funkce světlometů (8,51 %); 2.1.3 Stav pákového mechanismu řízení (5,08 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (4,59 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (4,10 %); 1.1.6 Ovladač parkovací brzdy, ovládací páka, západka parkovací brzdy, elektrická parkovací… (3,17 %).
- **Fabia III:** 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (2,07 %); 4.1.1 Stav a funkce světlometů (1,21 %); 1.1.6 Ovladač parkovací brzdy, ovládací páka, západka parkovací brzdy, elektrická parkovací… (0,71 %); 2.1.3 Stav pákového mechanismu řízení (0,63 %); 8.2.1 Emise zážehových motorů (0,59 %).
- **Fabia IV:** 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (1,60 %); 1.1.6 Ovladač parkovací brzdy, ovládací páka, západka parkovací brzdy, elektrická parkovací… (0,36 %); 4.1.1 Stav a funkce světlometů (0,35 %); 8.2.1 Emise zážehových motorů (0,27 %); 2.1.3 Stav pákového mechanismu řízení (0,20 %).

## Golf

| Generace | Období karty | Vozů v provozu* | Prohlídek | Nájezd: věk / p25 / medián / p75 km |
|---|---|---:|---:|---|
| Golf I (I (Typ 17)) | 1974–1993 | 1 956 | 506 | 30+ / 85 000 / 195 000 / 275 000 |
| Golf II (II (Typ 19E / 1G)) | 1983–1992 | 4 229 | 2 470 | 30+ / 155 000 / 215 000 / 275 000 |
| Golf III (III (1H)) | 1991–2002 | 7 503 | 6 034 | 26 / 65 000 / 215 000 / 235 000 |
| Golf IV (IV (1J)) | 1997–2006 | 43 202 | 95 398 | 17 / 245 000 / 285 000 / 375 000 |
| Golf V (V (1K)) | 2003–2009 | 40 154 | 105 831 | 14 / 135 000 / 185 000 / 215 000 |
| Golf VI (VI (5K)) | 2008–2016 | 26 583 | 94 500 | 12 / 125 000 / 165 000 / 215 000 |
| Golf VII (VII (5G / AU)) | 2012–2020 | 54 171 | 134 136 | 10 / 105 000 / 155 000 / 205 000 |
| Golf VIII (VIII (CD)) | 2019–… | 24 737 | 21 998 | 7 / 85 000 / 135 000 / 195 000 |

*Počty podle stávajícího modelového přiřazení; nezaručují přesnou VIN identifikaci.

| Generace | 0–4 | 5–9 | 10–14 | 15–19 | 20–24 | 25–29 | 30+ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Golf I | — | — | — | — | — | — | 4,35 % (n=506) |
| Golf II | — | — | — | — | — | — | 5,83 % (n=2 470) |
| Golf III | — | — | — | — | — | 8,03 % (n=2 366) | 7,66 % (n=3 640) |
| Golf IV | — | — | — | 7,69 % (n=442) | 7,93 % (n=48 293) | 9,02 % (n=46 663) | — |
| Golf V | — | — | 4,89 % (n=818) | 7,54 % (n=53 795) | 8,04 % (n=51 218) | — | — |
| Golf VI | — | — | 4,91 % (n=27 159) | 6,10 % (n=67 340) | — | — | — |
| Golf VII | — | 1,87 % (n=57 752) | 3,21 % (n=76 384) | — | — | — | — |
| Golf VIII | 1,17 % (n=11 127) | 1,16 % (n=10 837) | — | — | — | — | — |

Míry nevyhovujících prohlídek (výsledek 2/3); vážená aproximace ze zaokrouhlených vstupů. „—“ znamená chybějící vzorek.

Top závady — podíl pravidelných prohlídek s daným kódem (každý kód jednou za prohlídku); všechny věky dané generace:

- **Golf I:** 2.1.3 Stav pákového mechanismu řízení (8,10 %); 1.1.12 Brzdové hadice (7,91 %); 4.1.1 Stav a funkce světlometů (6,72 %). Řádek věku 30 zahrnuje i všechna starší vozidla. Zveřejněný agregát obsahuje jen 3 kódy závad nad minimálním počtem; chybějící pořadí nedoplňujeme.
- **Golf II:** 1.1.12 Brzdové hadice (8,70 %); 2.1.3 Stav pákového mechanismu řízení (8,50 %); 4.1.1 Stav a funkce světlometů (7,98 %); 1.1.11 Brzdová potrubí (6,60 %); 1.1.6 Ovladač parkovací brzdy, ovládací páka, západka parkovací brzdy, elektrická parkovací… (6,60 %). Řádek věku 30 zahrnuje i všechna starší vozidla.
- **Golf III:** 2.1.3 Stav pákového mechanismu řízení (11,39 %); 1.1.12 Brzdové hadice (11,04 %); 4.1.1 Stav a funkce světlometů (10,47 %); 1.1.11 Brzdová potrubí (8,17 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (7,94 %). Řádek věku 30 zahrnuje i všechna starší vozidla.
- **Golf IV:** 2.1.3 Stav pákového mechanismu řízení (12,39 %); 4.1.1 Stav a funkce světlometů (10,59 %); 1.1.12 Brzdové hadice (10,49 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (9,84 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (8,29 %).
- **Golf V:** 4.1.1 Stav a funkce světlometů (16,73 %); 2.1.3 Stav pákového mechanismu řízení (10,04 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (6,90 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (6,79 %); 1.1.12 Brzdové hadice (5,96 %).
- **Golf VI:** 4.1.1 Stav a funkce světlometů (11,94 %); 2.1.3 Stav pákového mechanismu řízení (5,28 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (5,00 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (3,46 %); 6.2.10 Kryty kol a systémy proti rozstřiku (2,66 %).
- **Golf VII:** 4.1.1 Stav a funkce světlometů (3,56 %); 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (3,01 %); 2.1.3 Stav pákového mechanismu řízení (1,11 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (0,57 %); 6.2.10 Kryty kol a systémy proti rozstřiku (0,53 %).
- **Golf VIII:** 3.2.1 Prasklé nebo poškrábané zasklení nebo některé zasklení chybí (2,01 %); 4.1.1 Stav a funkce světlometů (0,40 %); 2.1.3 Stav pákového mechanismu řízení (0,30 %); 4.7.1 Stav a funkce osvětlení zadní tabulky registrační značky (0,25 %); 5.2.3 Kola a pneumatiky – pneumatiky (0,22 %).

## JSON pro B2B i průvodce Kupuji ojetinu 2026

Dosavadní kořen lines → generations a pole ageBuckets, failureByExactAge, mileageByExactAge zůstávají. Přidána audiences, defectMetric a deprecatedFields; jde o aditivní rozšíření schemaVersion 1.
topDefects[].share je nyní podíl prohlídek s jedinečným třístupňovým kódem; starší occurrencesPerInspection zůstává jako kompatibilní alias téže hodnoty. unit popisuje novou správnou jednotku.
mileageForGuide obsahuje přesně věky 5, 8, 10, 12 a 15 let. Chybějící věk má null a missingReason; nedosazujeme nejbližší věk. facelifts, engines a technicalSources pocházejí z karty generace a jejích zdrojů, nikoli ze STK.
Pro B2C použít generační srovnání a náměty na fyzickou kontrolu; STK data nepřevádět na individuální verdikt, opravu konkrétního motoru ani jistotu nájezdu. Výběr vhodných pokynů a technických údajů před publikací ověřit.

## Metodika a omezení

- Ukázka pro odborné posouzení. Data jsou agregace českého registru a pravidelných technických prohlídek; nejde o ocenění vozidla, individuální VIN historii ani pravděpodobnost budoucí poruchy.
- Generace přiřazuje stávající matcher podle značky, modelu, roku a dostupného typového označení. Nejde o nezávisle ověřenou VIN klasifikaci; souběžné generace a karoserie mohou být přiřazeny chybně. Před placenou dodávkou ověřit vzorek přiřazení.
- Výsledek 2 nebo 3 znamená nevyhovující výsledek prohlídky. Jednotkou jsou prohlídky, nikoli unikátní vozidla. Souhrnný výsledek není měřením všech servisních poruch.
- Věk = kalendářní rok prohlídky minus rok první registrace; pipeline omezuje věk na 30, proto 30 znamená 30 a více let. Nejde o přesný věk v den prohlídky.
- Věkové skupiny jsou vážené počtem prohlídek ze zveřejněných řádků byAge. Míry vstupují zaokrouhlené na 4 desetinná místa: výsledek skupiny je aproximace, nikoli podíl z přesných původních počtů neúspěchů. Nezveřejněné malé/neurčené věkové skupiny nejsou dopočítávány.
- Kvartily nájezdu jsou středy 10 000km intervalů. Počty platných odečtů pro konkrétní věk nejsou ve finálním agregátu uchovány; uvádíme null. Kvartily různých věků neslučujeme, nelze z nich vypočítat kvartil věkové skupiny.
- Top závady: podíl pravidelných prohlídek, při kterých byl daný třístupňový kód zjištěn. Každý kód se v jedné prohlídce počítá právě jednou; pro rozdělení A/B/C se ponechává nejvyšší závažnost. Jedno vozidlo může mít v období více prohlídek, nejde o podíl unikátních vozů.
- Datum built u registru je datum sestavení agregátu, nikoli prokázané datum referenčního výpisu. Referenční datum registru zůstává neověřeno. Žádné osobní údaje ani jednotlivá VIN nejsou součástí ukázky.
- Nesrovnávat hrubé míry různě starých generací jako žebříček spolehlivosti. Nejmladší vozy s časnou pravidelnou prohlídkou mohou být zvláštní, nereprezentativní skupinou.

Před placenou dodávkou: audit generačního přiřazení, ověření referenčního data registru a dohoda o použití s odběratelem.
