# Exact Wikidata queries

Retrieved 2026-10-25 UTC. The compressed snapshot contains matching JSON results and HTTP retrieval logs. Prefixes use the Wikidata Query Service defaults. Connectivity probes below were exploratory and are not catalogue evidence.

## connectivity-labels

```sparql
SELECT ?item ?itemLabel WHERE { VALUES ?item { wd:Q29637 wd:Q190464 } SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } }
```

## connectivity-item

```sparql
SELECT ?x WHERE { VALUES ?x {wd:Q29637} }
```

## dates-auto

```sparql
SELECT DISTINCT ?item ?property ?date WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381} ?item wdt:P31 ?class.
 VALUES ?property {wdt:P571 wdt:P580 wdt:P582 wdt:P2669} ?item ?property ?date.
}
```

## dates-moto

```sparql
SELECT DISTINCT ?item ?property ?date WHERE {
 VALUES ?class {wd:Q23866334 wd:Q71310524} ?item wdt:P31 ?class.
 VALUES ?property {wdt:P571 wdt:P580 wdt:P582 wdt:P2669} ?item ?property ?date.
}
```

## explicit-generations

```sparql
SELECT DISTINCT ?item ?description ?series WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381 wd:Q23866334 wd:Q71310524} ?item wdt:P31 ?class.
 ?item schema:description ?description. FILTER(LANG(?description)="en" && REGEX(?description,"generation","i"))
 OPTIONAL {?item wdt:P179 ?series.}
}
```

## followup-labels

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
VALUES ?seed {"smart"@en "Peugeot"@en "Tesla"@en "Lexus"@en "Land Rover"@en "Trabant"@en "Tatra"@en "Moskvitch"@en "Moskvitč"@en "SSangYong Motor"@en "SsangYong"@en "KG Mobility"@en "Fabryka Samochodów Osobowych"@en "Fabryka Samochodów Małolitrażowych"@en "Austin"@en "Fisker"@en "Wey"@en "JAC Group"@en "Voyah"@en "Skyworth Auto"@en "Zotye"@en "Proton"@en "Tata Motors Limited"@en "Bugatti"@en "Pininfarina S.p.A."@en "Borgward Group"@en "Borgward"@en "Aston Martin Lagonda"@en "Briggs Automotive Company"@en "Seres Auto"@en "Maxus"@en "Royal Enfield (India)"@en "John Deere"@en "Deere & Company"@en "Ursus SA"@en "Minsk Tractor Works"@en "TGB Scooters"@en "Taiwan Golden Bee"@en "Hyosung Motors"@en "Develon"@en "Doosan Infracore"@en "Wacker Neuson SE"@en "Kögel Trailer"@en "Sava Tires"@en "JAWA Moto"@en "Jawa Motors"@en "JAWA"@en "Jawa"@en "Babetta"@en "MV Agusta Motor"@en "MV Agusta"@en "KYMCO"@en "Sanyang Motor"@en "CFMOTO"@en "Zongshen"@en "Zontes"@en "Scania"@en "JCB"@en "Liebherr Group"@en "Pirelli & C."@en "Pirelli"@en "Hankook"@en "Barum (company)"@en "Mitas (company)"@en} ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## generation-schema

```sparql
SELECT ?item ?itemLabel WHERE { VALUES ?label {"car model generation"@en "automobile model generation"@en "car generation"@en "vehicle model generation"@en "concept car"@en "race car"@en "car body style"@en} ?item rdfs:label ?label. SERVICE wikibase:label {bd:serviceParam wikibase:language "en".} }
```

## makes-auto

```sparql
SELECT DISTINCT ?item ?itemLabel ?country ?countryLabel ?founded ?dissolved WHERE {
 ?item wdt:P31/wdt:P279* wd:Q786820.
 OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item
```

## makes-buses

```sparql
SELECT DISTINCT ?item ?itemLabel ?country ?countryLabel ?founded ?dissolved WHERE {
 ?item wdt:P31/wdt:P279* wd:Q4380190.
 OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item
```

## makes-direct

```sparql
SELECT DISTINCT ?item ?itemLabel ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?class { wd:Q786820 wd:Q15081030 wd:Q108460239 wd:Q4380190 wd:Q20032039 wd:Q10429667 }
 ?item wdt:P31 ?class. OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item
```

## makes-moto

```sparql
SELECT DISTINCT ?item ?itemLabel ?country ?countryLabel ?founded ?dissolved WHERE {
 ?item wdt:P31/wdt:P279* wd:Q15081030.
 OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item
```

## makes-trucks

```sparql
SELECT DISTINCT ?item ?itemLabel ?country ?countryLabel ?founded ?dissolved WHERE {
 ?item wdt:P31/wdt:P279* wd:Q108460239.
 OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item
```

## makes-tyres

```sparql
SELECT DISTINCT ?item ?itemLabel ?country ?countryLabel ?founded ?dissolved WHERE {
 ?item wdt:P31/wdt:P279* wd:Q20032039.
 OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item
```

## model-brand-identities

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381 wd:Q23866334 wd:Q71310524} ?model wdt:P31 ?class; wdt:P1716 ?item.
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## model-maker-evidence

```sparql
SELECT ?item ?itemLabel ?description WHERE { VALUES ?item {wd:Q17025504 wd:Q98579635 wd:Q763622 wd:Q341139 wd:Q534944 wd:Q1507823 wd:Q2668720 wd:Q483190 wd:Q497254} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".} }
```

## model-schema-sample

```sparql
SELECT ?item ?itemLabel ?p ?v ?vLabel WHERE { VALUES ?item {wd:Q223696 wd:Q9008} ?item ?p ?v. FILTER(STRSTARTS(STR(?p),STR(wdt:))) SERVICE wikibase:label {bd:serviceParam wikibase:language "en".} }
```

## models-auto

```sparql
SELECT DISTINCT ?item ?itemLabel ?class ?make ?brand ?series ?body ?bodyLabel ?start ?end ?code WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381} ?item wdt:P31 ?class.
 OPTIONAL { ?item wdt:P176 ?make. } OPTIONAL { ?item wdt:P1716 ?brand. } OPTIONAL { ?item wdt:P179 ?series. }
 OPTIONAL { ?item wdt:P279 ?body. } OPTIONAL { ?item wdt:P2754 ?start. } OPTIONAL { ?item wdt:P2669 ?end. } OPTIONAL { ?item wdt:P528 ?code. }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## models-moto

```sparql
SELECT DISTINCT ?item ?itemLabel ?class ?make ?brand ?series ?body ?bodyLabel ?start ?end ?code WHERE {
 VALUES ?class {wd:Q23866334 wd:Q71310524} ?item wdt:P31 ?class.
 OPTIONAL { ?item wdt:P176 ?make. } OPTIONAL { ?item wdt:P1716 ?brand. } OPTIONAL { ?item wdt:P179 ?series. }
 OPTIONAL { ?item wdt:P279 ?body. } OPTIONAL { ?item wdt:P2754 ?start. } OPTIONAL { ?item wdt:P2669 ?end. } OPTIONAL { ?item wdt:P528 ?code. }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## nonproduction-types

```sparql
SELECT DISTINCT ?item ?type ?typeLabel WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381 wd:Q23866334 wd:Q71310524} ?item wdt:P31 ?class.
 ?item wdt:P31 ?type. ?type rdfs:label ?typeLabel.
 FILTER(LANG(?typeLabel) IN ("en","mul") && REGEX(?typeLabel,"concept car|race car|racing car|racing motorcycle","i"))
}
```

## production-auto

```sparql
SELECT DISTINCT ?item ?make ?start ?end WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381} ?item wdt:P31 ?class. ?item p:P176 ?statement. ?statement ps:P176 ?make.
 { ?statement pq:P580 ?start. } UNION { ?statement pq:P582 ?end. }
 OPTIONAL {?statement pq:P580 ?start.} OPTIONAL {?statement pq:P582 ?end.}
}
```

## production-moto

```sparql
SELECT DISTINCT ?item ?make ?start ?end WHERE {
 VALUES ?class {wd:Q23866334 wd:Q71310524} ?item wdt:P31 ?class. ?item p:P176 ?statement. ?statement ps:P176 ?make.
 { ?statement pq:P580 ?start. } UNION { ?statement pq:P582 ?end. }
 OPTIONAL {?statement pq:P580 ?start.} OPTIONAL {?statement pq:P582 ?end.}
}
```

## sample-model-properties

```sparql
SELECT ?item ?itemLabel ?p ?v ?vLabel WHERE { VALUES ?make { wd:Q29637 } ?item wdt:P176 ?make. ?item ?p ?v. FILTER(STRSTARTS(STR(?p),STR(wdt:))) SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } } ORDER BY ?item LIMIT 300
```

## search-moto

```sparql
SELECT ?seed ?item ?itemLabel ?description WHERE {
 VALUES ?seed { "CFMoto" "Jawa Moto" "SYM Motors" "Ural motorcycles" "Royal Enfield India" "BSA Motorcycles" "MRF tyres" }
 SERVICE wikibase:mwapi {bd:serviceParam wikibase:endpoint "www.wikidata.org"; wikibase:api "EntitySearch"; mwapi:search ?seed; mwapi:language "en"; mwapi:limit "3". ?item wikibase:apiOutputItem mwapi:item.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## selected-aliases-0

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"SsangYong Motor"@en "ssangyong motor"@en "SSANGYONG MOTOR"@en "KGM"@en "kgm"@en "KGM"@en "FSO"@en "fso"@en "FSO"@en "FSM"@en "fsm"@en "FSM"@en "Austin Motor Company"@en "austin motor company"@en "AUSTIN MOTOR COMPANY"@en "Fisker Inc."@en "fisker inc."@en "FISKER INC."@en "WEY"@en "wey"@en "WEY"@en "JAC Motors"@en "jac motors"@en "JAC MOTORS"@en "Voyah"@en "voyah"@en "VOYAH"@en "Skywell"@en "skywell"@en "SKYWELL"@en "Zotye Auto"@en "zotye auto"@en "ZOTYE AUTO"@en "Proton Holdings"@en "proton holdings"@en "PROTON HOLDINGS"@en "Tata Motors"@en "tata motors"@en "TATA MOTORS"@en "Bugatti Automobiles"@en "bugatti automobiles"@en "BUGATTI AUTOMOBILES"@en "Pininfarina"@en "pininfarina"@en "PININFARINA"@en "Santana"@en "santana"@en "SANTANA"@en "Chatenet"@en "chatenet"@en "CHATENET"@en "Microlino"@en "microlino"@en "MICROLINO"@en "Tazzari EV"@en "tazzari ev"@en "TAZZARI EV"@en "e.GO Mobile"@en "e.go mobile"@en "E.GO MOBILE"@en "Artega"@en "artega"@en "ARTEGA"@en "Apollo Automobil"@en "apollo automobil"@en "APOLLO AUTOMOBIL"@en "Wolseley Motors"@en "wolseley motors"@en "WOLSELEY MOTORS"@en "Wanderer"@en "wanderer"@en "WANDERER"@en "AMC"@en "amc"@en "AMC"@en "Jawa Moto"@en "jawa moto"@en "JAWA MOTO"@en "Babetta"@en "babetta"@en "BABETTA"@en "MV Agusta"@en "mv agusta"@en "MV AGUSTA"@en "SWM"@en "swm"@en "SWM"@en "BSA Motorcycles"@en "bsa motorcycles"@en "BSA MOTORCYCLES"@en "Ariel Motorcycles"@en "ariel motorcycles"@en "ARIEL MOTORCYCLES"@en "Kymco"@en "kymco"@en "KYMCO"@en "SYM Motors"@en "sym motors"@en "SYM MOTORS"@en "CFMoto"@en "cfmoto"@en "CFMOTO"@en "Keeway"@en "keeway"@en "KEEWAY"@en "Zongshen"@en "zongshen"@en "ZONGSHEN"@en "Loncin"@en "loncin"@en "LONCIN"@en "Zontes"@en "zontes"@en "ZONTES"@en "Kove Moto"@en "kove moto"@en "KOVE MOTO"@en "QJMotor"@en "qjmotor"@en "QJMOTOR"@en}
 {?item skos:altLabel ?seed.} UNION {?item rdfs:label ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-aliases-1

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Mash Motors"@en "mash motors"@en "MASH MOTORS"@en "Benda"@en "benda"@en "BENDA"@en "Yezdi"@en "yezdi"@en "YEZDI"@en "Ural"@en "ural"@en "URAL"@en "NIU Technologies"@en "niu technologies"@en "NIU TECHNOLOGIES"@en "Silence"@en "silence"@en "SILENCE"@en "Segway"@en "segway"@en "SEGWAY"@en "Talaria"@en "talaria"@en "TALARIA"@en "Can-Am"@en "can-am"@en "CAN-AM"@en "Polaris Inc."@en "polaris inc."@en "POLARIS INC."@en "Access Motor"@en "access motor"@en "ACCESS MOTOR"@en "Goes"@en "goes"@en "GOES"@en "Hisun"@en "hisun"@en "HISUN"@en "Kayo"@en "kayo"@en "KAYO"@en "Segway Powersports"@en "segway powersports"@en "SEGWAY POWERSPORTS"@en "Adiva"@en "adiva"@en "ADIVA"@en "Daelim Motor"@en "daelim motor"@en "DAELIM MOTOR"@en "Motron"@en "motron"@en "MOTRON"@en "Scania AB"@en "scania ab"@en "SCANIA AB"@en "MAZ"@en "maz"@en "MAZ"@en "ZIL"@en "zil"@en "ZIL"@en "Fuso"@en "fuso"@en "FUSO"@en "SOR Libchavy"@en "sor libchavy"@en "SOR LIBCHAVY"@en "VDL Bus & Coach"@en "vdl bus & coach"@en "VDL BUS & COACH"@en "Temsa"@en "temsa"@en "TEMSA"@en "New Holland Agriculture"@en "new holland agriculture"@en "NEW HOLLAND AGRICULTURE"@en "Same"@en "same"@en "SAME"@en "JCB"@en "jcb"@en "JCB"@en "Liebherr"@en "liebherr"@en "LIEBHERR"@en "Doosan"@en "doosan"@en "DOOSAN"@en "Hyundai Construction Equipment"@en "hyundai construction equipment"@en "HYUNDAI CONSTRUCTION EQUIPMENT"@en "Kobelco"@en "kobelco"@en "KOBELCO"@en "Sany"@en "sany"@en "SANY"@en "XCMG"@en "xcmg"@en "XCMG"@en "Zoomlion"@en "zoomlion"@en "ZOOMLION"@en "Bomag"@en "bomag"@en "BOMAG"@en "Manitou"@en "manitou"@en "MANITOU"@en "Jungheinrich"@en "jungheinrich"@en "JUNGHEINRICH"@en "Still GmbH"@en "still gmbh"@en "STILL GMBH"@en "Toyota Material Handling"@en "toyota material handling"@en "TOYOTA MATERIAL HANDLING"@en}
 {?item skos:altLabel ?seed.} UNION {?item rdfs:label ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-aliases-2

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Hyster"@en "hyster"@en "HYSTER"@en "Yale Materials Handling Corporation"@en "yale materials handling corporation"@en "YALE MATERIALS HANDLING CORPORATION"@en "Krone"@en "krone"@en "KRONE"@en "Fliegl"@en "fliegl"@en "FLIEGL"@en "Böckmann"@en "böckmann"@en "BÖCKMANN"@en "Agados"@en "agados"@en "AGADOS"@en "Vezeko"@en "vezeko"@en "VEZEKO"@en "Brenderup"@en "brenderup"@en "BRENDERUP"@en "Pongratz"@en "pongratz"@en "PONGRATZ"@en "Goldhofer"@en "goldhofer"@en "GOLDHOFER"@en "Kässbohrer"@en "kässbohrer"@en "KÄSSBOHRER"@en "Schwarzmüller Group"@en "schwarzmüller group"@en "SCHWARZMÜLLER GROUP"@en "Pirelli"@en "pirelli"@en "PIRELLI"@en "Hankook Tire"@en "hankook tire"@en "HANKOOK TIRE"@en "Barum"@en "barum"@en "BARUM"@en "Uniroyal"@en "uniroyal"@en "UNIROYAL"@en "Kleber"@en "kleber"@en "KLEBER"@en "Vredestein"@en "vredestein"@en "VREDESTEIN"@en "MRF"@en "mrf"@en "MRF"@en "Sailun"@en "sailun"@en "SAILUN"@en "Cheng Shin Rubber"@en "cheng shin rubber"@en "CHENG SHIN RUBBER"@en "Mitas"@en "mitas"@en "MITAS"@en "Petlas"@en "petlas"@en "PETLAS"@en "Alliance Tire Company"@en "alliance tire company"@en "ALLIANCE TIRE COMPANY"@en "Trelleborg AB"@en "trelleborg ab"@en "TRELLEBORG AB"@en "Titan International"@en "titan international"@en "TITAN INTERNATIONAL"@en}
 {?item skos:altLabel ?seed.} UNION {?item rdfs:label ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-0

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Škoda"@mul "Škoda"@cs "Volkswagen"@mul "Volkswagen"@cs "Audi"@mul "Audi"@cs "BMW"@mul "BMW"@cs "Mercedes-Benz"@mul "Mercedes-Benz"@cs "Ford Motor Company"@mul "Ford Motor Company"@cs "Toyota"@mul "Toyota"@cs "Hyundai Motor Company"@mul "Hyundai Motor Company"@cs "Kia"@mul "Kia"@cs "Renault"@mul "Renault"@cs "Dacia"@mul "Dacia"@cs "Peugeot"@mul "Peugeot"@cs "Citroën"@mul "Citroën"@cs "Opel"@mul "Opel"@cs "Vauxhall Motors"@mul "Vauxhall Motors"@cs "Fiat"@mul "Fiat"@cs "Alfa Romeo"@mul "Alfa Romeo"@cs "Lancia"@mul "Lancia"@cs "SEAT"@mul "SEAT"@cs "SEAT CUPRA"@mul "SEAT CUPRA"@cs "Mini"@mul "Mini"@cs "Smart"@mul "Smart"@cs "Volvo Cars"@mul "Volvo Cars"@cs "Saab Automobile"@mul "Saab Automobile"@cs "Polestar"@mul "Polestar"@cs "Tesla, Inc."@mul "Tesla, Inc."@cs "Honda"@mul "Honda"@cs "Mazda"@mul "Mazda"@cs "Nissan"@mul "Nissan"@cs "Mitsubishi Motors"@mul "Mitsubishi Motors"@cs "Subaru"@mul "Subaru"@cs "Suzuki Motor Corporation"@mul "Suzuki Motor Corporation"@cs "Lexus"@mul "Lexus"@cs "Infiniti"@mul "Infiniti"@cs "Acura"@mul "Acura"@cs "Chevrolet"@mul "Chevrolet"@cs "Daewoo Motors"@mul "Daewoo Motors"@cs "Daihatsu"@mul "Daihatsu"@cs "SsangYong Motor"@mul "SsangYong Motor"@cs "KGM"@mul "KGM"@cs "Land Rover"@mul "Land Rover"@cs "Jaguar Cars"@mul "Jaguar Cars"@cs "Porsche"@mul "Porsche"@cs "Jeep"@mul "Jeep"@cs "Chrysler"@mul "Chrysler"@cs "Dodge"@mul "Dodge"@cs "Ram Trucks"@mul "Ram Trucks"@cs "Cadillac"@mul "Cadillac"@cs "Buick"@mul "Buick"@cs "GMC"@mul "GMC"@cs "Lincoln Motor Company"@mul "Lincoln Motor Company"@cs "Pontiac"@mul "Pontiac"@cs "Oldsmobile"@mul "Oldsmobile"@cs "Mercury"@mul "Mercury"@cs "Plymouth"@mul "Plymouth"@cs "Hummer"@mul "Hummer"@cs "Saturn Corporation"@mul "Saturn Corporation"@cs "Scion"@mul "Scion"@cs "Isuzu"@mul "Isuzu"@cs "Iveco"@mul "Iveco"@cs "AvtoVAZ"@mul "AvtoVAZ"@cs "Moskvitch"@mul "Moskvitch"@cs "Tatra"@mul "Tatra"@cs "Trabant"@mul "Trabant"@cs "Wartburg"@mul "Wartburg"@cs "ARO"@mul "ARO"@cs "Zastava Automobiles"@mul "Zastava Automobiles"@cs "Yugo"@mul "Yugo"@cs "FSO"@mul "FSO"@cs "FSM"@mul "FSM"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-1

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"UAZ"@mul "UAZ"@cs "GAZ"@mul "GAZ"@cs "ZAZ"@mul "ZAZ"@cs "LuAZ"@mul "LuAZ"@cs "Barkas"@mul "Barkas"@cs "Rover"@mul "Rover"@cs "MG Motor"@mul "MG Motor"@cs "Austin Motor Company"@mul "Austin Motor Company"@cs "Morris Motors"@mul "Morris Motors"@cs "Triumph Motor Company"@mul "Triumph Motor Company"@cs "Hillman"@mul "Hillman"@cs "Talbot"@mul "Talbot"@cs "Simca"@mul "Simca"@cs "Sunbeam"@mul "Sunbeam"@cs "Datsun"@mul "Datsun"@cs "Fisker Inc."@mul "Fisker Inc."@cs "Fisker Automotive"@mul "Fisker Automotive"@cs "Lucid Motors"@mul "Lucid Motors"@cs "Rivian"@mul "Rivian"@cs "VinFast"@mul "VinFast"@cs "BYD Auto"@mul "BYD Auto"@cs "Geely Auto"@mul "Geely Auto"@cs "Chery"@mul "Chery"@cs "Great Wall Motor"@mul "Great Wall Motor"@cs "Haval"@mul "Haval"@cs "WEY"@mul "WEY"@cs "ORA"@mul "ORA"@cs "SAIC Motor"@mul "SAIC Motor"@cs "Maxus"@mul "Maxus"@cs "Hongqi"@mul "Hongqi"@cs "Dongfeng Motor Corporation"@mul "Dongfeng Motor Corporation"@cs "FAW Group"@mul "FAW Group"@cs "JAC Motors"@mul "JAC Motors"@cs "BAIC Motor"@mul "BAIC Motor"@cs "Changan Automobile"@mul "Changan Automobile"@cs "Lynk & Co"@mul "Lynk & Co"@cs "Zeekr"@mul "Zeekr"@cs "Nio Inc."@mul "Nio Inc."@cs "XPeng"@mul "XPeng"@cs "Li Auto"@mul "Li Auto"@cs "Leapmotor"@mul "Leapmotor"@cs "Aiways"@mul "Aiways"@cs "Seres"@mul "Seres"@cs "Omoda"@mul "Omoda"@cs "Jaecoo"@mul "Jaecoo"@cs "Denza"@mul "Denza"@cs "Voyah"@mul "Voyah"@cs "Forthing"@mul "Forthing"@cs "Skywell"@mul "Skywell"@cs "Arcfox"@mul "Arcfox"@cs "Avatr Technology"@mul "Avatr Technology"@cs "Deepal"@mul "Deepal"@cs "Exeed"@mul "Exeed"@cs "Jetour"@mul "Jetour"@cs "Baojun"@mul "Baojun"@cs "Wuling Motors"@mul "Wuling Motors"@cs "Roewe"@mul "Roewe"@cs "Neta Auto"@mul "Neta Auto"@cs "Zotye Auto"@mul "Zotye Auto"@cs "Brilliance Auto"@mul "Brilliance Auto"@cs "Lifan Group"@mul "Lifan Group"@cs "Landwind"@mul "Landwind"@cs "Proton Holdings"@mul "Proton Holdings"@cs "Perodua"@mul "Perodua"@cs "Tata Motors"@mul "Tata Motors"@cs "Mahindra & Mahindra"@mul "Mahindra & Mahindra"@cs "Hindustan Motors"@mul "Hindustan Motors"@cs "Maruti Suzuki"@mul "Maruti Suzuki"@cs "Mahindra Electric"@mul "Mahindra Electric"@cs "Force Motors"@mul "Force Motors"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-2

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Ferrari"@mul "Ferrari"@cs "Lamborghini"@mul "Lamborghini"@cs "Maserati"@mul "Maserati"@cs "Bentley"@mul "Bentley"@cs "Rolls-Royce Motor Cars"@mul "Rolls-Royce Motor Cars"@cs "Aston Martin"@mul "Aston Martin"@cs "Lotus Cars"@mul "Lotus Cars"@cs "McLaren Automotive"@mul "McLaren Automotive"@cs "Morgan Motor Company"@mul "Morgan Motor Company"@cs "Caterham Cars"@mul "Caterham Cars"@cs "TVR"@mul "TVR"@cs "Noble Automotive"@mul "Noble Automotive"@cs "Ariel Motor Company"@mul "Ariel Motor Company"@cs "BAC"@mul "BAC"@cs "Ginetta Cars"@mul "Ginetta Cars"@cs "Donkervoort"@mul "Donkervoort"@cs "Spyker Cars"@mul "Spyker Cars"@cs "Koenigsegg"@mul "Koenigsegg"@cs "Pagani"@mul "Pagani"@cs "Bugatti Automobiles"@mul "Bugatti Automobiles"@cs "Rimac Automobili"@mul "Rimac Automobili"@cs "Automobili Pininfarina"@mul "Automobili Pininfarina"@cs "Alpine"@mul "Alpine"@cs "DS Automobiles"@mul "DS Automobiles"@cs "Abarth"@mul "Abarth"@cs "Alpina"@mul "Alpina"@cs "Brabus"@mul "Brabus"@cs "AC Cars"@mul "AC Cars"@cs "Bristol Cars"@mul "Bristol Cars"@cs "Jensen Motors"@mul "Jensen Motors"@cs "De Tomaso"@mul "De Tomaso"@cs "Autobianchi"@mul "Autobianchi"@cs "Innocenti"@mul "Innocenti"@cs "Bertone"@mul "Bertone"@cs "Pininfarina"@mul "Pininfarina"@cs "Izh"@mul "Izh"@cs "TagAZ"@mul "TagAZ"@cs "Derways"@mul "Derways"@cs "Aurus Motors"@mul "Aurus Motors"@cs "Marussia Motors"@mul "Marussia Motors"@cs "Santana Motor"@mul "Santana Motor"@cs "Santana"@mul "Santana"@cs "Dangel"@mul "Dangel"@cs "Matra"@mul "Matra"@cs "Venturi"@mul "Venturi"@cs "Ligier"@mul "Ligier"@cs "Aixam"@mul "Aixam"@cs "Microcar"@mul "Microcar"@cs "Chatenet"@mul "Chatenet"@cs "Casalini"@mul "Casalini"@cs "Grecav"@mul "Grecav"@cs "Bellier"@mul "Bellier"@cs "Estrima"@mul "Estrima"@cs "Microlino"@mul "Microlino"@cs "Tazzari EV"@mul "Tazzari EV"@cs "e.GO Mobile"@mul "e.GO Mobile"@cs "Sono Motors"@mul "Sono Motors"@cs "Borgward"@mul "Borgward"@cs "Wiesmann"@mul "Wiesmann"@cs "Artega"@mul "Artega"@cs "Gumpert"@mul "Gumpert"@cs "Apollo Automobil"@mul "Apollo Automobil"@cs "Maybach"@mul "Maybach"@cs "Daimler Company"@mul "Daimler Company"@cs "Wolseley Motors"@mul "Wolseley Motors"@cs "NSU Motorenwerke"@mul "NSU Motorenwerke"@cs "DKW"@mul "DKW"@cs "Horch"@mul "Horch"@cs "Auto Union"@mul "Auto Union"@cs "Adler"@mul "Adler"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-3

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Wanderer"@mul "Wanderer"@cs "Panhard"@mul "Panhard"@cs "Delage"@mul "Delage"@cs "Delahaye"@mul "Delahaye"@cs "Facel Vega"@mul "Facel Vega"@cs "Hotchkiss"@mul "Hotchkiss"@cs "Salmson"@mul "Salmson"@cs "Avions Voisin"@mul "Avions Voisin"@cs "Packard"@mul "Packard"@cs "Studebaker"@mul "Studebaker"@cs "Hudson Motor Car Company"@mul "Hudson Motor Car Company"@cs "Nash Motors"@mul "Nash Motors"@cs "AMC"@mul "AMC"@cs "Duesenberg"@mul "Duesenberg"@cs "DeLorean Motor Company"@mul "DeLorean Motor Company"@cs "Willys"@mul "Willys"@cs "International Harvester"@mul "International Harvester"@cs "Yamaha Motor Company"@mul "Yamaha Motor Company"@cs "Kawasaki Heavy Industries"@mul "Kawasaki Heavy Industries"@cs "Kawasaki Motors"@mul "Kawasaki Motors"@cs "BMW Motorrad"@mul "BMW Motorrad"@cs "KTM"@mul "KTM"@cs "Husqvarna Motorcycles"@mul "Husqvarna Motorcycles"@cs "Gas Gas"@mul "Gas Gas"@cs "Ducati"@mul "Ducati"@cs "Aprilia"@mul "Aprilia"@cs "Moto Guzzi"@mul "Moto Guzzi"@cs "Piaggio"@mul "Piaggio"@cs "Vespa"@mul "Vespa"@cs "Gilera"@mul "Gilera"@cs "Derbi"@mul "Derbi"@cs "Peugeot Motocycles"@mul "Peugeot Motocycles"@cs "Harley-Davidson"@mul "Harley-Davidson"@cs "Indian Motorcycle"@mul "Indian Motorcycle"@cs "Triumph Motorcycles Ltd"@mul "Triumph Motorcycles Ltd"@cs "Royal Enfield"@mul "Royal Enfield"@cs "Jawa Moto"@mul "Jawa Moto"@cs "Česká zbrojovka Strakonice"@mul "Česká zbrojovka Strakonice"@cs "Babetta"@mul "Babetta"@cs "Simson"@mul "Simson"@cs "MZ Motorrad- und Zweiradwerk"@mul "MZ Motorrad- und Zweiradwerk"@cs "Benelli"@mul "Benelli"@cs "MV Agusta"@mul "MV Agusta"@cs "Moto Morini"@mul "Moto Morini"@cs "Bimota"@mul "Bimota"@cs "Beta Motor"@mul "Beta Motor"@cs "Sherco"@mul "Sherco"@cs "Fantic Motor"@mul "Fantic Motor"@cs "SWM"@mul "SWM"@cs "Malaguti"@mul "Malaguti"@cs "Rieju"@mul "Rieju"@cs "Montesa"@mul "Montesa"@cs "Bultaco"@mul "Bultaco"@cs "Ossa"@mul "Ossa"@cs "Norton Motorcycle Company"@mul "Norton Motorcycle Company"@cs "BSA Motorcycles"@mul "BSA Motorcycles"@cs "Matchless"@mul "Matchless"@cs "AJS"@mul "AJS"@cs "Ariel Motorcycles"@mul "Ariel Motorcycles"@cs "Velocette"@mul "Velocette"@cs "Vincent Motorcycles"@mul "Vincent Motorcycles"@cs "Cagiva"@mul "Cagiva"@cs "Laverda"@mul "Laverda"@cs "Italjet"@mul "Italjet"@cs "Kymco"@mul "Kymco"@cs "SYM Motors"@mul "SYM Motors"@cs "PGO Scooters"@mul "PGO Scooters"@cs "TGB"@mul "TGB"@cs "CFMoto"@mul "CFMoto"@cs "Qianjiang Motorcycle"@mul "Qianjiang Motorcycle"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-4

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Keeway"@mul "Keeway"@cs "Zongshen"@mul "Zongshen"@cs "Loncin"@mul "Loncin"@cs "Voge"@mul "Voge"@cs "Zontes"@mul "Zontes"@cs "Kove Moto"@mul "Kove Moto"@cs "QJMotor"@mul "QJMotor"@cs "Brixton Motorcycles"@mul "Brixton Motorcycles"@cs "Mash Motors"@mul "Mash Motors"@cs "Benda"@mul "Benda"@cs "Bajaj Auto"@mul "Bajaj Auto"@cs "Hero MotoCorp"@mul "Hero MotoCorp"@cs "TVS Motor Company"@mul "TVS Motor Company"@cs "Yezdi"@mul "Yezdi"@cs "Ural"@mul "Ural"@cs "Dnepr"@mul "Dnepr"@cs "Minsk"@mul "Minsk"@cs "Zero Motorcycles"@mul "Zero Motorcycles"@cs "Energica Motor Company"@mul "Energica Motor Company"@cs "LiveWire"@mul "LiveWire"@cs "Super Soco"@mul "Super Soco"@cs "Vmoto"@mul "Vmoto"@cs "NIU Technologies"@mul "NIU Technologies"@cs "Silence"@mul "Silence"@cs "Segway"@mul "Segway"@cs "Sur-Ron"@mul "Sur-Ron"@cs "Talaria"@mul "Talaria"@cs "Electric Motion"@mul "Electric Motion"@cs "Stark Future"@mul "Stark Future"@cs "Can-Am"@mul "Can-Am"@cs "Polaris Inc."@mul "Polaris Inc."@cs "Arctic Cat"@mul "Arctic Cat"@cs "Linhai"@mul "Linhai"@cs "Access Motor"@mul "Access Motor"@cs "Aeon Motor"@mul "Aeon Motor"@cs "Goes"@mul "Goes"@cs "Hisun"@mul "Hisun"@cs "Kayo"@mul "Kayo"@cs "Segway Powersports"@mul "Segway Powersports"@cs "Adiva"@mul "Adiva"@cs "Daelim Motor"@mul "Daelim Motor"@cs "Hyosung"@mul "Hyosung"@cs "UM Motorcycles"@mul "UM Motorcycles"@cs "Motron"@mul "Motron"@cs "Blata"@mul "Blata"@cs "Praga"@mul "Praga"@cs "MAN Truck & Bus"@mul "MAN Truck & Bus"@cs "Scania AB"@mul "Scania AB"@cs "Volvo Trucks"@mul "Volvo Trucks"@cs "Renault Trucks"@mul "Renault Trucks"@cs "DAF"@mul "DAF"@cs "Avia"@mul "Avia"@cs "LIAZ"@mul "LIAZ"@cs "Kamaz"@mul "Kamaz"@cs "MAZ"@mul "MAZ"@cs "ZIL"@mul "ZIL"@cs "Fuso"@mul "Fuso"@cs "Hino Motors"@mul "Hino Motors"@cs "UD Trucks"@mul "UD Trucks"@cs "BMC"@mul "BMC"@cs "Ford Trucks"@mul "Ford Trucks"@cs "Otokar"@mul "Otokar"@cs "Ikarus"@mul "Ikarus"@cs "Karosa"@mul "Karosa"@cs "SOR Libchavy"@mul "SOR Libchavy"@cs "Solaris Bus & Coach"@mul "Solaris Bus & Coach"@cs "Iveco Bus"@mul "Iveco Bus"@cs "Setra"@mul "Setra"@cs "Van Hool"@mul "Van Hool"@cs "VDL Bus & Coach"@mul "VDL Bus & Coach"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-5

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Neoplan"@mul "Neoplan"@cs "Yutong"@mul "Yutong"@cs "King Long"@mul "King Long"@cs "Temsa"@mul "Temsa"@cs "Irizar"@mul "Irizar"@cs "Zetor"@mul "Zetor"@cs "John Deere"@mul "John Deere"@cs "CNH Industrial"@mul "CNH Industrial"@cs "New Holland Agriculture"@mul "New Holland Agriculture"@cs "Case IH"@mul "Case IH"@cs "Case Construction Equipment"@mul "Case Construction Equipment"@cs "Fendt"@mul "Fendt"@cs "Claas"@mul "Claas"@cs "Massey Ferguson"@mul "Massey Ferguson"@cs "Valtra"@mul "Valtra"@cs "Kubota"@mul "Kubota"@cs "Yanmar"@mul "Yanmar"@cs "Same"@mul "Same"@cs "Deutz-Fahr"@mul "Deutz-Fahr"@cs "Lamborghini Trattori"@mul "Lamborghini Trattori"@cs "Landini"@mul "Landini"@cs "McCormick Tractors"@mul "McCormick Tractors"@cs "Steyr Tractor"@mul "Steyr Tractor"@cs "Ursus"@mul "Ursus"@cs "Belarus"@mul "Belarus"@cs "JCB"@mul "JCB"@cs "Caterpillar Inc."@mul "Caterpillar Inc."@cs "Komatsu Limited"@mul "Komatsu Limited"@cs "Liebherr"@mul "Liebherr"@cs "Volvo Construction Equipment"@mul "Volvo Construction Equipment"@cs "Bobcat Company"@mul "Bobcat Company"@cs "Doosan"@mul "Doosan"@cs "Develon"@mul "Develon"@cs "Hyundai Construction Equipment"@mul "Hyundai Construction Equipment"@cs "Hitachi Construction Machinery"@mul "Hitachi Construction Machinery"@cs "Kobelco"@mul "Kobelco"@cs "Takeuchi Manufacturing"@mul "Takeuchi Manufacturing"@cs "Sany"@mul "Sany"@cs "XCMG"@mul "XCMG"@cs "Zoomlion"@mul "Zoomlion"@cs "Wacker Neuson"@mul "Wacker Neuson"@cs "Ammann Group"@mul "Ammann Group"@cs "Bomag"@mul "Bomag"@cs "Hamm AG"@mul "Hamm AG"@cs "Dynapac"@mul "Dynapac"@cs "Terex"@mul "Terex"@cs "Manitou"@mul "Manitou"@cs "Merlo"@mul "Merlo"@cs "Dieci"@mul "Dieci"@cs "Linde Material Handling"@mul "Linde Material Handling"@cs "Jungheinrich"@mul "Jungheinrich"@cs "Still GmbH"@mul "Still GmbH"@cs "Toyota Material Handling"@mul "Toyota Material Handling"@cs "Hyster"@mul "Hyster"@cs "Yale Materials Handling Corporation"@mul "Yale Materials Handling Corporation"@cs "Schmitz Cargobull"@mul "Schmitz Cargobull"@cs "Krone"@mul "Krone"@cs "Kögel"@mul "Kögel"@cs "Wielton"@mul "Wielton"@cs "Schwarzmüller"@mul "Schwarzmüller"@cs "Fliegl"@mul "Fliegl"@cs "Humbaur"@mul "Humbaur"@cs "Böckmann"@mul "Böckmann"@cs "Agados"@mul "Agados"@cs "Vezeko"@mul "Vezeko"@cs "Brenderup"@mul "Brenderup"@cs "Pongratz"@mul "Pongratz"@cs "Eduard"@mul "Eduard"@cs "Ifor Williams Trailers"@mul "Ifor Williams Trailers"@cs "Faymonville"@mul "Faymonville"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-defaults-6

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed {"Goldhofer"@mul "Goldhofer"@cs "Nooteboom"@mul "Nooteboom"@cs "Kässbohrer"@mul "Kässbohrer"@cs "Schwarzmüller Group"@mul "Schwarzmüller Group"@cs "Michelin"@mul "Michelin"@cs "Bridgestone"@mul "Bridgestone"@cs "Goodyear Tire and Rubber Company"@mul "Goodyear Tire and Rubber Company"@cs "Continental AG"@mul "Continental AG"@cs "Pirelli"@mul "Pirelli"@cs "Hankook Tire"@mul "Hankook Tire"@cs "Kumho Tire"@mul "Kumho Tire"@cs "Nexen Tire"@mul "Nexen Tire"@cs "Nokian Tyres"@mul "Nokian Tyres"@cs "Toyo Tire Corporation"@mul "Toyo Tire Corporation"@cs "Yokohama Rubber Company"@mul "Yokohama Rubber Company"@cs "Sumitomo Rubber Industries"@mul "Sumitomo Rubber Industries"@cs "Falken Tire"@mul "Falken Tire"@cs "Dunlop Tyres"@mul "Dunlop Tyres"@cs "Barum"@mul "Barum"@cs "Matador"@mul "Matador"@cs "Sava"@mul "Sava"@cs "Fulda"@mul "Fulda"@cs "Semperit"@mul "Semperit"@cs "Uniroyal"@mul "Uniroyal"@cs "BFGoodrich"@mul "BFGoodrich"@cs "Cooper Tire & Rubber Company"@mul "Cooper Tire & Rubber Company"@cs "General Tire"@mul "General Tire"@cs "Kleber"@mul "Kleber"@cs "Firestone Tire and Rubber Company"@mul "Firestone Tire and Rubber Company"@cs "Vredestein"@mul "Vredestein"@cs "Apollo Tyres"@mul "Apollo Tyres"@cs "CEAT"@mul "CEAT"@cs "MRF"@mul "MRF"@cs "JK Tyre"@mul "JK Tyre"@cs "Giti Tire"@mul "Giti Tire"@cs "Linglong Tire"@mul "Linglong Tire"@cs "Sailun"@mul "Sailun"@cs "Triangle Group"@mul "Triangle Group"@cs "Nankang Rubber Tire"@mul "Nankang Rubber Tire"@cs "Maxxis"@mul "Maxxis"@cs "Cheng Shin Rubber"@mul "Cheng Shin Rubber"@cs "Kenda Rubber Industrial Company"@mul "Kenda Rubber Industrial Company"@cs "Mitas"@mul "Mitas"@cs "Petlas"@mul "Petlas"@cs "Balkrishna Industries"@mul "Balkrishna Industries"@cs "Alliance Tire Company"@mul "Alliance Tire Company"@cs "Trelleborg AB"@mul "Trelleborg AB"@cs "Titan International"@mul "Titan International"@cs "Double Coin"@mul "Double Coin"@cs "Taurus"@mul "Taurus"@cs "CF Moto"@mul "CF Moto"@cs "CFMOTO"@mul "CFMOTO"@cs "JAWA Moto"@mul "JAWA Moto"@cs "SWM Motorcycles"@mul "SWM Motorcycles"@cs "Ursus SA"@mul "Ursus SA"@cs "Hankook"@mul "Hankook"@cs "New Holland"@mul "New Holland"@cs "Doosan Infracore"@mul "Doosan Infracore"@cs "HD Hyundai Infracore"@mul "HD Hyundai Infracore"@cs "IMZ-Ural"@mul "IMZ-Ural"@cs "Royal Enfield (India)"@mul "Royal Enfield (India)"@cs "Sanyang Motor"@mul "Sanyang Motor"@cs "Hankook Tire & Technology"@mul "Hankook Tire & Technology"@cs "MRF Tyres"@mul "MRF Tyres"@cs}
 {?item rdfs:label ?seed.} UNION {?item skos:altLabel ?seed.} FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL {?item wdt:P31 ?class.} OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-0-19bf622a

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q29637 wd:Q135700024 wd:Q246 wd:Q23317 wd:Q124983953 wd:Q26678 wd:Q796364 wd:Q36008 wd:Q44294 wd:Q53268 wd:Q55931 wd:Q35349 wd:Q6686 wd:Q98584518 wd:Q125544573 wd:Q27460 wd:Q131701890 wd:Q6742 wd:Q6746 wd:Q40966 wd:Q59187 wd:Q27597 wd:Q139960054 wd:Q26921 wd:Q124982078 wd:Q35896 wd:Q125097315 wd:Q188217 wd:Q8352675 wd:Q116232 wd:Q156490 wd:Q215293 wd:Q48957 wd:Q4047174 wd:Q478214 wd:Q9584 wd:Q35996 wd:Q125055033 wd:Q20165 wd:Q36033 wd:Q172741 wd:Q125214266 wd:Q181642 wd:Q35919 wd:Q29714 wd:Q53097 wd:Q29570 wd:Q27483 wd:Q27511 wd:Q221869 wd:Q35907 wd:Q30055 wd:Q40993 wd:Q124966804 wd:Q30113 wd:Q29610 wd:Q27564 wd:Q165708 wd:Q27436 wd:Q27415 wd:Q28993 wd:Q216796 wd:Q40990 wd:Q204327 wd:Q613883 wd:Q1124857 wd:Q213487 wd:Q569235 wd:Q503487 wd:Q29803 wd:Q29913 wd:Q2309 wd:Q36044 wd:Q45464 wd:Q134079386 wd:Q153681 wd:Q59181 wd:Q27061 wd:Q15770 wd:Q27786 wd:Q27760 wd:Q658242 wd:Q28616 wd:Q71233 wd:Q1635796 wd:Q27158 wd:Q848620 wd:Q1881443 wd:Q781156 wd:Q776997 wd:Q1140388 wd:Q1544816 wd:Q173151 wd:Q173357 wd:Q2165627 wd:Q27543 wd:Q1420893 wd:Q58762513 wd:Q28027517 wd:Q7338847}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-0

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q29637 wd:Q135700024 wd:Q246 wd:Q23317 wd:Q124983953 wd:Q26678 wd:Q36008 wd:Q44294 wd:Q53268 wd:Q55931 wd:Q35349 wd:Q6686 wd:Q98584518 wd:Q125544573 wd:Q27460 wd:Q131701890 wd:Q6742 wd:Q6746 wd:Q40966 wd:Q59187 wd:Q27597 wd:Q139960054 wd:Q26921 wd:Q124982078 wd:Q35896 wd:Q125097315 wd:Q188217 wd:Q8352675 wd:Q116232 wd:Q156490 wd:Q215293 wd:Q48957 wd:Q4047174 wd:Q478214 wd:Q9584 wd:Q35996 wd:Q125055033 wd:Q20165 wd:Q36033 wd:Q172741 wd:Q125214266 wd:Q181642 wd:Q35919 wd:Q29714 wd:Q53097 wd:Q29570 wd:Q27483 wd:Q27511 wd:Q221869 wd:Q35907 wd:Q30055 wd:Q40993 wd:Q124966804 wd:Q30113 wd:Q29610 wd:Q27564 wd:Q165708 wd:Q27436 wd:Q27415 wd:Q28993 wd:Q216796 wd:Q40990 wd:Q204327 wd:Q613883 wd:Q1124857 wd:Q213487 wd:Q569235 wd:Q503487 wd:Q29803 wd:Q29913 wd:Q2309 wd:Q36044 wd:Q45464 wd:Q134079386 wd:Q465457 wd:Q59181 wd:Q27061 wd:Q15770 wd:Q5390662 wd:Q27786 wd:Q27760 wd:Q658242 wd:Q28616 wd:Q71233 wd:Q1635796 wd:Q27158 wd:Q17017137 wd:Q1881443 wd:Q776997 wd:Q1140388 wd:Q1544816 wd:Q173151 wd:Q173357 wd:Q2165627 wd:Q27543 wd:Q58762513 wd:Q28027517 wd:Q125552500 wd:Q56660561 wd:Q27423}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-1-e29e9bca

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q125552500 wd:Q56660561 wd:Q27423 wd:Q55118127 wd:Q591001 wd:Q98172997 wd:Q1117001 wd:Q28223947 wd:Q31842448 wd:Q97014020 wd:Q910401 wd:Q3302845 wd:Q1611731 wd:Q1138452 wd:Q1124351 wd:Q545579 wd:Q33111848 wd:Q29366 wd:Q27555283 wd:Q106621124 wd:Q29921278 wd:Q63035278 wd:Q98139925 wd:Q99510294 wd:Q65158716 wd:Q43401513 wd:Q118646009 wd:Q124255702 wd:Q2381970 wd:Q107121376 wd:Q111943892 wd:Q95786931 wd:Q109616786 wd:Q112874951 wd:Q109546700 wd:Q98145436 wd:Q2883616 wd:Q3817853 wd:Q1637227 wd:Q120245578 wd:Q11705500 wd:Q917192 wd:Q1465351 wd:Q16241919 wd:Q827306 wd:Q1476369 wd:Q188514 wd:Q7687819 wd:Q848059 wd:Q1422710 wd:Q963718 wd:Q3595470 wd:Q1436646 wd:Q27586 wd:Q35886 wd:Q124966860 wd:Q35962 wd:Q124991042 wd:Q27224 wd:Q234803 wd:Q27074 wd:Q35935 wd:Q1351854 wd:Q1165625 wd:Q838832 wd:Q46937 wd:Q1542124 wd:Q202888 wd:Q132544044 wd:Q151310 wd:Q2500933 wd:Q167016 wd:Q27571 wd:Q1128836 wd:Q35594 wd:Q749239 wd:Q132560748 wd:Q2308012 wd:Q7334368 wd:Q59186515 wd:Q26944 wd:Q16040593 wd:Q26823 wd:Q203550 wd:Q321785 wd:Q26893 wd:Q27392 wd:Q30348 wd:Q173085 wd:Q125765830 wd:Q27110 wd:Q135773766 wd:Q1664128 wd:Q27325 wd:Q2185380 wd:Q1550700 wd:Q1141446 wd:Q647737 wd:Q265465 wd:Q787572}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-1

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q55118127 wd:Q591001 wd:Q98172997 wd:Q1117001 wd:Q28223947 wd:Q31842448 wd:Q97014020 wd:Q910401 wd:Q3302845 wd:Q1611731 wd:Q1138452 wd:Q1124351 wd:Q545579 wd:Q33111848 wd:Q29366 wd:Q27555283 wd:Q106621124 wd:Q29921278 wd:Q63035278 wd:Q98139925 wd:Q99510294 wd:Q65158716 wd:Q43401513 wd:Q118646009 wd:Q124255702 wd:Q2381970 wd:Q107121376 wd:Q111943892 wd:Q65046953 wd:Q95786931 wd:Q109616786 wd:Q112874951 wd:Q109546700 wd:Q98145436 wd:Q2883616 wd:Q3817853 wd:Q1637227 wd:Q120245578 wd:Q917192 wd:Q1465351 wd:Q16241919 wd:Q827306 wd:Q1476369 wd:Q188514 wd:Q7687819 wd:Q848059 wd:Q1422710 wd:Q963718 wd:Q3595470 wd:Q1436646 wd:Q27586 wd:Q35886 wd:Q124966860 wd:Q35962 wd:Q124991042 wd:Q27224 wd:Q234803 wd:Q63049904 wd:Q35935 wd:Q1351854 wd:Q1165625 wd:Q838832 wd:Q46937 wd:Q1542124 wd:Q202888 wd:Q132544044 wd:Q151310 wd:Q2500933 wd:Q167016 wd:Q27571 wd:Q1128836 wd:Q35594 wd:Q132560748 wd:Q7334368 wd:Q59186515 wd:Q26944 wd:Q16040593 wd:Q26823 wd:Q203550 wd:Q321785 wd:Q26893 wd:Q27392 wd:Q30348 wd:Q173085 wd:Q125765830 wd:Q27110 wd:Q135773766 wd:Q1664128 wd:Q27325 wd:Q2185380 wd:Q1550700 wd:Q1141446 wd:Q52834700 wd:Q647737 wd:Q265465 wd:Q787572 wd:Q35982 wd:Q137177484 wd:Q35931 wd:Q6751}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-2-46662566

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q35982 wd:Q137177484 wd:Q35931 wd:Q6751 wd:Q2299839 wd:Q1046770 wd:Q750047 wd:Q815969 wd:Q1370612 wd:Q39328518 wd:Q54709337 wd:Q27377 wd:Q694506 wd:Q706453 wd:Q688366 wd:Q35989 wd:Q27539 wd:Q530099 wd:Q39898 wd:Q639268 wd:Q29296 wd:Q27152 wd:Q53098 wd:Q59183 wd:Q731471 wd:Q27550 wd:Q783891 wd:Q743344 wd:Q17079025 wd:Q1630793 wd:Q2037004 wd:Q3498746 wd:Q40971 wd:Q938876 wd:Q1313428 wd:Q1081459 wd:Q202708 wd:Q4652565 wd:Q27582 wd:Q1241608 wd:Q1537825 wd:Q263800 wd:Q158888 wd:Q249033 wd:Q249173 wd:Q215657 wd:Q5493297 wd:Q1495046 wd:Q271812 wd:Q622062 wd:Q1149018 wd:Q841263 wd:Q217673 wd:Q745394 wd:Q1199957 wd:Q2081467 wd:Q192814 wd:Q1091034 wd:Q1140383 wd:Q2668720 wd:Q1507823 wd:Q763622 wd:Q341139 wd:Q4837811 wd:Q481622 wd:Q703243 wd:Q817107 wd:Q1139995 wd:Q1949745 wd:Q863478 wd:Q830950 wd:Q2342323 wd:Q2704677 wd:Q1256019 wd:Q968973 wd:Q761958 wd:Q1946170 wd:Q204022 wd:Q971537 wd:Q1150827 wd:Q45319396 wd:Q1428119 wd:Q278301 wd:Q369821 wd:Q1150857 wd:Q1483061 wd:Q1025726 wd:Q1808905 wd:Q1424713 wd:Q696338 wd:Q534944 wd:Q11039213 wd:Q1522507 wd:Q17025504 wd:Q2121562 wd:Q10544622 wd:Q219927 wd:Q6669689 wd:Q136933088 wd:Q110710109}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-2-912646f7

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q35982 wd:Q137177484 wd:Q35931 wd:Q6751 wd:Q2299839 wd:Q1046770 wd:Q750047 wd:Q815969 wd:Q1370612 wd:Q39328518 wd:Q54709337 wd:Q27377 wd:Q694506 wd:Q706453 wd:Q688366 wd:Q35989 wd:Q27539 wd:Q530099 wd:Q39898 wd:Q639268 wd:Q29296 wd:Q27152 wd:Q53098 wd:Q59183 wd:Q731471 wd:Q27550 wd:Q783891 wd:Q743344 wd:Q17079025 wd:Q1630793 wd:Q2037004 wd:Q3498746 wd:Q40971 wd:Q938876 wd:Q1313428 wd:Q1081459 wd:Q202708 wd:Q4652565 wd:Q27582 wd:Q1241608 wd:Q1537825 wd:Q263800 wd:Q158888 wd:Q748148 wd:Q249033 wd:Q249173 wd:Q215657 wd:Q5493297 wd:Q1495046 wd:Q271812 wd:Q622062 wd:Q1149018 wd:Q841263 wd:Q217673 wd:Q745394 wd:Q1199957 wd:Q2081467 wd:Q192814 wd:Q1091034 wd:Q1140383 wd:Q2668720 wd:Q1507823 wd:Q763622 wd:Q341139 wd:Q4837811 wd:Q481622 wd:Q703243 wd:Q817107 wd:Q1139995 wd:Q1949745 wd:Q863478 wd:Q830950 wd:Q2342323 wd:Q2704677 wd:Q1256019 wd:Q968973 wd:Q761958 wd:Q1946170 wd:Q204022 wd:Q971537 wd:Q1150827 wd:Q45319396 wd:Q1428119 wd:Q278301 wd:Q369821 wd:Q1150857 wd:Q1483061 wd:Q1025726 wd:Q1808905 wd:Q1424713 wd:Q696338 wd:Q534944 wd:Q11039213 wd:Q1522507 wd:Q2121562 wd:Q10544622 wd:Q219927 wd:Q6669689 wd:Q136933088 wd:Q110710109}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-2-d7be1268

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q35982 wd:Q137177484 wd:Q35931 wd:Q6751 wd:Q2299839 wd:Q1046770 wd:Q750047 wd:Q815969 wd:Q1370612 wd:Q39328518 wd:Q54709337 wd:Q27377 wd:Q694506 wd:Q706453 wd:Q688366 wd:Q35989 wd:Q27539 wd:Q530099 wd:Q39898 wd:Q639268 wd:Q29296 wd:Q27152 wd:Q53098 wd:Q59183 wd:Q731471 wd:Q27550 wd:Q783891 wd:Q743344 wd:Q17079025 wd:Q1630793 wd:Q2037004 wd:Q3498746 wd:Q40971 wd:Q938876 wd:Q1313428 wd:Q1081459 wd:Q202708 wd:Q4652565 wd:Q27582 wd:Q1241608 wd:Q1537825 wd:Q263800 wd:Q158888 wd:Q748148 wd:Q249033 wd:Q249173 wd:Q215657 wd:Q5493297 wd:Q1495046 wd:Q271812 wd:Q622062 wd:Q1149018 wd:Q841263 wd:Q217673 wd:Q745394 wd:Q1199957 wd:Q2081467 wd:Q192814 wd:Q1091034 wd:Q1140383 wd:Q2668720 wd:Q1507823 wd:Q763622 wd:Q341139 wd:Q4837811 wd:Q481622 wd:Q703243 wd:Q817107 wd:Q1139995 wd:Q1949745 wd:Q863478 wd:Q830950 wd:Q2342323 wd:Q2704677 wd:Q1256019 wd:Q968973 wd:Q761958 wd:Q1946170 wd:Q204022 wd:Q971537 wd:Q1150827 wd:Q45319396 wd:Q1428119 wd:Q278301 wd:Q369821 wd:Q1150857 wd:Q1483061 wd:Q1025726 wd:Q1808905 wd:Q1424713 wd:Q696338 wd:Q534944 wd:Q11039213 wd:Q1522507 wd:Q17025504 wd:Q2121562 wd:Q10544622 wd:Q219927 wd:Q6669689 wd:Q136933088}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-2

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q2299839 wd:Q1046770 wd:Q750047 wd:Q815969 wd:Q1370612 wd:Q54709337 wd:Q45144846 wd:Q694506 wd:Q688366 wd:Q35989 wd:Q27539 wd:Q39898 wd:Q639268 wd:Q29296 wd:Q27152 wd:Q53098 wd:Q731471 wd:Q27550 wd:Q783891 wd:Q743344 wd:Q17079025 wd:Q2037004 wd:Q3498746 wd:Q40971 wd:Q938876 wd:Q1313428 wd:Q1081459 wd:Q202708 wd:Q4652565 wd:Q27582 wd:Q1241608 wd:Q1537825 wd:Q263800 wd:Q158888 wd:Q748148 wd:Q249033 wd:Q249173 wd:Q215657 wd:Q5493297 wd:Q1495046 wd:Q271812 wd:Q622062 wd:Q1149018 wd:Q841263 wd:Q217673 wd:Q745394 wd:Q1199957 wd:Q2081467 wd:Q192814 wd:Q1091034 wd:Q1140383 wd:Q1507823 wd:Q341139 wd:Q481622 wd:Q703243 wd:Q817107 wd:Q1139995 wd:Q1949745 wd:Q863478 wd:Q830950 wd:Q2342323 wd:Q2704677 wd:Q882871 wd:Q968973 wd:Q761958 wd:Q1946170 wd:Q204022 wd:Q971537 wd:Q1150827 wd:Q1428119 wd:Q278301 wd:Q1150857 wd:Q1483061 wd:Q1025726 wd:Q1808905 wd:Q1424713 wd:Q696338 wd:Q11039213 wd:Q1522507 wd:Q2121562 wd:Q10544622 wd:Q136933088 wd:Q110710109 wd:Q10910065 wd:Q1613763 wd:Q3300084 wd:Q1232934 wd:Q2025413 wd:Q191945 wd:Q19903251 wd:Q107530675 wd:Q110192612 wd:Q104162895 wd:Q22059031 wd:Q118948241 wd:Q131652099 wd:Q111739831 wd:Q2935727 wd:Q1850587 wd:Q638036}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-3-11002f3e

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q10910065 wd:Q1613763 wd:Q3300084 wd:Q1543724 wd:Q1232934 wd:Q2025413 wd:Q191945 wd:Q19903251 wd:Q107530675 wd:Q110192612 wd:Q104162895 wd:Q104868523 wd:Q22059031 wd:Q7446425 wd:Q118948241 wd:Q131652099 wd:Q111739831 wd:Q2935727 wd:Q1850587 wd:Q638036 wd:Q3178595 wd:Q381000 wd:Q136081834 wd:Q109746209 wd:Q55736867 wd:Q483190 wd:Q28449130 wd:Q148859 wd:Q40996 wd:Q708667 wd:Q219960 wd:Q2033642 wd:Q840045 wd:Q27489 wd:Q27143 wd:Q35927 wd:Q30378 wd:Q1251215 wd:Q638156 wd:Q1190247 wd:Q867667 wd:Q1241339 wd:Q796295 wd:Q3077109 wd:Q206228 wd:Q756669 wd:Q35305 wd:Q2377690 wd:Q838369 wd:Q29755 wd:Q938615 wd:Q1339832 wd:Q2596757 wd:Q326013 wd:Q2389456 wd:Q3273406 wd:Q2094576 wd:Q2418054 wd:Q196868 wd:Q496302 wd:Q15238661 wd:Q1423217 wd:Q1046997 wd:Q1046940 wd:Q666948 wd:Q704756 wd:Q579509 wd:Q385867 wd:Q1514221 wd:Q520763 wd:Q1990758 wd:Q645697 wd:Q2362203 wd:Q2261849 wd:Q1819177 wd:Q667547 wd:Q2143828 wd:Q2502005 wd:Q592110 wd:Q1328890 wd:Q459965 wd:Q162257 wd:Q662090 wd:Q617322 wd:Q2061446 wd:Q131187811 wd:Q1581165 wd:Q451944 wd:Q1853060 wd:Q1353472 wd:Q5972314 wd:Q323802 wd:Q472782 wd:Q796860 wd:Q876312 wd:Q5319137 wd:Q1937503 wd:Q599791 wd:Q1921935 wd:Q31842700}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-3-120decf8

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q10910065 wd:Q1613763 wd:Q3300084 wd:Q1543724 wd:Q1232934 wd:Q2025413 wd:Q191945 wd:Q19903251 wd:Q107530675 wd:Q110192612 wd:Q104162895 wd:Q104868523 wd:Q22059031 wd:Q7446425 wd:Q118948241 wd:Q131652099 wd:Q111739831 wd:Q2935727 wd:Q1850587 wd:Q638036 wd:Q3178595 wd:Q381000 wd:Q136081834 wd:Q109746209 wd:Q55736867 wd:Q497254 wd:Q28449130 wd:Q148859 wd:Q40996 wd:Q708667 wd:Q219960 wd:Q2033642 wd:Q840045 wd:Q27489 wd:Q27143 wd:Q35927 wd:Q30378 wd:Q1251215 wd:Q638156 wd:Q1190247 wd:Q867667 wd:Q1241339 wd:Q796295 wd:Q3077109 wd:Q206228 wd:Q756669 wd:Q35305 wd:Q2377690 wd:Q838369 wd:Q29755 wd:Q938615 wd:Q1339832 wd:Q2596757 wd:Q326013 wd:Q2389456 wd:Q3273406 wd:Q2094576 wd:Q2418054 wd:Q196868 wd:Q496302 wd:Q15238661 wd:Q1423217 wd:Q1046997 wd:Q1046940 wd:Q666948 wd:Q704756 wd:Q579509 wd:Q385867 wd:Q1514221 wd:Q520763 wd:Q1990758 wd:Q645697 wd:Q2362203 wd:Q2261849 wd:Q1819177 wd:Q667547 wd:Q2143828 wd:Q2502005 wd:Q592110 wd:Q1328890 wd:Q459965 wd:Q162257 wd:Q662090 wd:Q617322 wd:Q2061446 wd:Q131187811 wd:Q1581165 wd:Q451944 wd:Q1853060 wd:Q1353472 wd:Q5972314 wd:Q323802 wd:Q472782 wd:Q796860 wd:Q876312 wd:Q5319137 wd:Q1937503 wd:Q599791 wd:Q1921935 wd:Q31842700}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-3-6542fe30

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q110710109 wd:Q10910065 wd:Q1613763 wd:Q3300084 wd:Q1543724 wd:Q1232934 wd:Q2025413 wd:Q191945 wd:Q19903251 wd:Q107530675 wd:Q110192612 wd:Q104162895 wd:Q104868523 wd:Q22059031 wd:Q7446425 wd:Q118948241 wd:Q131652099 wd:Q111739831 wd:Q2935727 wd:Q1850587 wd:Q638036 wd:Q3178595 wd:Q381000 wd:Q136081834 wd:Q109746209 wd:Q55736867 wd:Q483190 wd:Q28449130 wd:Q148859 wd:Q40996 wd:Q708667 wd:Q219960 wd:Q2033642 wd:Q840045 wd:Q27489 wd:Q27143 wd:Q35927 wd:Q30378 wd:Q1251215 wd:Q638156 wd:Q1190247 wd:Q867667 wd:Q1241339 wd:Q796295 wd:Q3077109 wd:Q206228 wd:Q756669 wd:Q35305 wd:Q2377690 wd:Q838369 wd:Q29755 wd:Q938615 wd:Q1339832 wd:Q2596757 wd:Q326013 wd:Q2389456 wd:Q3273406 wd:Q2094576 wd:Q2418054 wd:Q196868 wd:Q496302 wd:Q15238661 wd:Q1423217 wd:Q1046997 wd:Q1046940 wd:Q666948 wd:Q704756 wd:Q579509 wd:Q385867 wd:Q1514221 wd:Q520763 wd:Q1990758 wd:Q645697 wd:Q2362203 wd:Q2261849 wd:Q1819177 wd:Q667547 wd:Q2143828 wd:Q2502005 wd:Q592110 wd:Q1328890 wd:Q459965 wd:Q162257 wd:Q662090 wd:Q617322 wd:Q2061446 wd:Q131187811 wd:Q1581165 wd:Q451944 wd:Q1853060 wd:Q1353472 wd:Q5972314 wd:Q323802 wd:Q472782 wd:Q796860 wd:Q876312 wd:Q5319137 wd:Q1937503 wd:Q599791 wd:Q1921935}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-3

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q3178595 wd:Q381000 wd:Q131735664 wd:Q55736867 wd:Q497254 wd:Q28449130 wd:Q2438668 wd:Q40996 wd:Q708667 wd:Q219960 wd:Q2033642 wd:Q840045 wd:Q27489 wd:Q27143 wd:Q35927 wd:Q30378 wd:Q1251215 wd:Q1190247 wd:Q867667 wd:Q1241339 wd:Q796295 wd:Q3077109 wd:Q206228 wd:Q756669 wd:Q35305 wd:Q838369 wd:Q29755 wd:Q938615 wd:Q1339832 wd:Q326013 wd:Q2389456 wd:Q3273406 wd:Q2094576 wd:Q2418054 wd:Q130557671 wd:Q496302 wd:Q15238661 wd:Q1046997 wd:Q1046940 wd:Q666948 wd:Q704756 wd:Q579509 wd:Q385867 wd:Q1514221 wd:Q520763 wd:Q1990758 wd:Q645697 wd:Q2362203 wd:Q2261849 wd:Q1819177 wd:Q667547 wd:Q2502005 wd:Q592110 wd:Q1542317 wd:Q459965 wd:Q162257 wd:Q662090 wd:Q617322 wd:Q2061446 wd:Q131187811 wd:Q1581165 wd:Q451944 wd:Q1853060 wd:Q1353472 wd:Q30262104 wd:Q323802 wd:Q472782 wd:Q796860 wd:Q876312 wd:Q5319137 wd:Q1937503 wd:Q599791 wd:Q1921935 wd:Q31842700 wd:Q1316733 wd:Q320000 wd:Q279044 wd:Q535634 wd:Q1668901 wd:Q58219022 wd:Q1636772 wd:Q54942388 wd:Q54974295 wd:Q5340364 wd:Q5991246 wd:Q97293252 wd:Q1996504 wd:Q151107 wd:Q179433 wd:Q18011762 wd:Q620875 wd:Q163241 wd:Q207770 wd:Q493108 wd:Q625573 wd:Q1481634 wd:Q568406 wd:Q1471756 wd:Q1648148 wd:Q61055670}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-4-400bc46c

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q1316733 wd:Q536228 wd:Q875112 wd:Q16523399 wd:Q4040918 wd:Q1234640 wd:Q320000 wd:Q279044 wd:Q535634 wd:Q1668901 wd:Q58219022 wd:Q1428592 wd:Q1636772 wd:Q54942388 wd:Q54974295 wd:Q5991246 wd:Q97293252 wd:Q1996504 wd:Q151107 wd:Q179433 wd:Q18011762 wd:Q620875 wd:Q163241 wd:Q207770 wd:Q493094 wd:Q493108 wd:Q625573 wd:Q1481634 wd:Q568406 wd:Q1471756 wd:Q1648148 wd:Q61055670 wd:Q168241 wd:Q81510 wd:Q1908026 wd:Q13818978 wd:Q136786060 wd:Q446542 wd:Q3296074 wd:Q947913 wd:Q1129847 wd:Q369128 wd:Q420837 wd:Q1428298 wd:Q4780362 wd:Q3648653 wd:Q1789944 wd:Q126811070 wd:Q14915570 wd:Q48802850 wd:Q52850911 wd:Q7840066 wd:Q711934 wd:Q4215912 wd:Q6388831 wd:Q12038229 wd:Q19612269 wd:Q19321885 wd:Q420541 wd:Q1703203 wd:Q7809776 wd:Q5299680}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-4-f51793ce

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q31842700 wd:Q1316733 wd:Q536228 wd:Q875112 wd:Q16523399 wd:Q4040918 wd:Q1234640 wd:Q320000 wd:Q279044 wd:Q535634 wd:Q1668901 wd:Q58219022 wd:Q1428592 wd:Q1636772 wd:Q54942388 wd:Q54974295 wd:Q5991246 wd:Q97293252 wd:Q1996504 wd:Q151107 wd:Q179433 wd:Q18011762 wd:Q620875 wd:Q163241 wd:Q207770 wd:Q493094 wd:Q493108 wd:Q625573 wd:Q1481634 wd:Q568406 wd:Q1471756 wd:Q1648148 wd:Q61055670 wd:Q168241 wd:Q81510 wd:Q1908026 wd:Q13818978 wd:Q136786060 wd:Q446542 wd:Q3296074 wd:Q947913 wd:Q1129847 wd:Q369128 wd:Q420837 wd:Q1428298 wd:Q4780362 wd:Q3648653 wd:Q1789944 wd:Q126811070 wd:Q14915570 wd:Q48802850 wd:Q52850911 wd:Q7840066 wd:Q711934 wd:Q4215912 wd:Q6388831 wd:Q12038229 wd:Q19612269 wd:Q19321885 wd:Q420541 wd:Q1703203 wd:Q7809776 wd:Q5299680}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-facts-4

```sparql
SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {wd:Q168241 wd:Q81510 wd:Q1908026 wd:Q13818978 wd:Q136786060 wd:Q446542 wd:Q3296074 wd:Q947913 wd:Q1129847 wd:Q369128 wd:Q420837 wd:Q1428298 wd:Q4780362 wd:Q3648653 wd:Q30283437 wd:Q126811070 wd:Q14915570 wd:Q48802850 wd:Q7840066 wd:Q711934 wd:Q4215912 wd:Q6388831 wd:Q12038229 wd:Q19321885 wd:Q420541 wd:Q5299680}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-0

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "Škoda"@en "Volkswagen"@en "Audi"@en "BMW"@en "Mercedes-Benz"@en "Ford Motor Company"@en "Toyota"@en "Hyundai Motor Company"@en "Kia"@en "Renault"@en "Dacia"@en "Peugeot"@en "Citroën"@en "Opel"@en "Vauxhall Motors"@en "Fiat"@en "Alfa Romeo"@en "Lancia"@en "SEAT"@en "SEAT CUPRA"@en "Mini"@en "Smart"@en "Volvo Cars"@en "Saab Automobile"@en "Polestar"@en "Tesla, Inc."@en "Honda"@en "Mazda"@en "Nissan"@en "Mitsubishi Motors"@en "Subaru"@en "Suzuki Motor Corporation"@en "Lexus"@en "Infiniti"@en "Acura"@en "Chevrolet"@en "Daewoo Motors"@en "Daihatsu"@en "SsangYong Motor"@en "KGM"@en "Land Rover"@en "Jaguar Cars"@en "Porsche"@en "Jeep"@en "Chrysler"@en "Dodge"@en "Ram Trucks"@en "Cadillac"@en "Buick"@en "GMC"@en "Lincoln Motor Company"@en "Pontiac"@en "Oldsmobile"@en "Mercury"@en "Plymouth"@en "Hummer"@en "Saturn Corporation"@en "Scion"@en "Isuzu"@en "Iveco"@en "AvtoVAZ"@en "Moskvitch"@en "Tatra"@en "Trabant"@en "Wartburg"@en "ARO"@en "Zastava Automobiles"@en "Yugo"@en "FSO"@en "FSM"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-1

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "UAZ"@en "GAZ"@en "ZAZ"@en "LuAZ"@en "Barkas"@en "Rover"@en "MG Motor"@en "Austin Motor Company"@en "Morris Motors"@en "Triumph Motor Company"@en "Hillman"@en "Talbot"@en "Simca"@en "Sunbeam"@en "Datsun"@en "Fisker Inc."@en "Fisker Automotive"@en "Lucid Motors"@en "Rivian"@en "VinFast"@en "BYD Auto"@en "Geely Auto"@en "Chery"@en "Great Wall Motor"@en "Haval"@en "WEY"@en "ORA"@en "SAIC Motor"@en "Maxus"@en "Hongqi"@en "Dongfeng Motor Corporation"@en "FAW Group"@en "JAC Motors"@en "BAIC Motor"@en "Changan Automobile"@en "Lynk & Co"@en "Zeekr"@en "Nio Inc."@en "XPeng"@en "Li Auto"@en "Leapmotor"@en "Aiways"@en "Seres"@en "Omoda"@en "Jaecoo"@en "Denza"@en "Voyah"@en "Forthing"@en "Skywell"@en "Arcfox"@en "Avatr Technology"@en "Deepal"@en "Exeed"@en "Jetour"@en "Baojun"@en "Wuling Motors"@en "Roewe"@en "Neta Auto"@en "Zotye Auto"@en "Brilliance Auto"@en "Lifan Group"@en "Landwind"@en "Proton Holdings"@en "Perodua"@en "Tata Motors"@en "Mahindra & Mahindra"@en "Hindustan Motors"@en "Maruti Suzuki"@en "Mahindra Electric"@en "Force Motors"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-2

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "Ferrari"@en "Lamborghini"@en "Maserati"@en "Bentley"@en "Rolls-Royce Motor Cars"@en "Aston Martin"@en "Lotus Cars"@en "McLaren Automotive"@en "Morgan Motor Company"@en "Caterham Cars"@en "TVR"@en "Noble Automotive"@en "Ariel Motor Company"@en "BAC"@en "Ginetta Cars"@en "Donkervoort"@en "Spyker Cars"@en "Koenigsegg"@en "Pagani"@en "Bugatti Automobiles"@en "Rimac Automobili"@en "Automobili Pininfarina"@en "Alpine"@en "DS Automobiles"@en "Abarth"@en "Alpina"@en "Brabus"@en "AC Cars"@en "Bristol Cars"@en "Jensen Motors"@en "De Tomaso"@en "Autobianchi"@en "Innocenti"@en "Bertone"@en "Pininfarina"@en "Izh"@en "TagAZ"@en "Derways"@en "Aurus Motors"@en "Marussia Motors"@en "Santana Motor"@en "Santana"@en "Dangel"@en "Matra"@en "Venturi"@en "Ligier"@en "Aixam"@en "Microcar"@en "Chatenet"@en "Casalini"@en "Grecav"@en "Bellier"@en "Estrima"@en "Microlino"@en "Tazzari EV"@en "e.GO Mobile"@en "Sono Motors"@en "Borgward"@en "Wiesmann"@en "Artega"@en "Gumpert"@en "Apollo Automobil"@en "Maybach"@en "Daimler Company"@en "Wolseley Motors"@en "NSU Motorenwerke"@en "DKW"@en "Horch"@en "Auto Union"@en "Adler"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-3

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "Wanderer"@en "Panhard"@en "Delage"@en "Delahaye"@en "Facel Vega"@en "Hotchkiss"@en "Salmson"@en "Avions Voisin"@en "Packard"@en "Studebaker"@en "Hudson Motor Car Company"@en "Nash Motors"@en "AMC"@en "Duesenberg"@en "DeLorean Motor Company"@en "Willys"@en "International Harvester"@en "Yamaha Motor Company"@en "Kawasaki Heavy Industries"@en "Kawasaki Motors"@en "BMW Motorrad"@en "KTM"@en "Husqvarna Motorcycles"@en "Gas Gas"@en "Ducati"@en "Aprilia"@en "Moto Guzzi"@en "Piaggio"@en "Vespa"@en "Gilera"@en "Derbi"@en "Peugeot Motocycles"@en "Harley-Davidson"@en "Indian Motorcycle"@en "Triumph Motorcycles Ltd"@en "Royal Enfield"@en "Jawa Moto"@en "Česká zbrojovka Strakonice"@en "Babetta"@en "Simson"@en "MZ Motorrad- und Zweiradwerk"@en "Benelli"@en "MV Agusta"@en "Moto Morini"@en "Bimota"@en "Beta Motor"@en "Sherco"@en "Fantic Motor"@en "SWM"@en "Malaguti"@en "Rieju"@en "Montesa"@en "Bultaco"@en "Ossa"@en "Norton Motorcycle Company"@en "BSA Motorcycles"@en "Matchless"@en "AJS"@en "Ariel Motorcycles"@en "Velocette"@en "Vincent Motorcycles"@en "Cagiva"@en "Laverda"@en "Italjet"@en "Kymco"@en "SYM Motors"@en "PGO Scooters"@en "TGB"@en "CFMoto"@en "Qianjiang Motorcycle"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-4

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "Keeway"@en "Zongshen"@en "Loncin"@en "Voge"@en "Zontes"@en "Kove Moto"@en "QJMotor"@en "Brixton Motorcycles"@en "Mash Motors"@en "Benda"@en "Bajaj Auto"@en "Hero MotoCorp"@en "TVS Motor Company"@en "Yezdi"@en "Ural"@en "Dnepr"@en "Minsk"@en "Zero Motorcycles"@en "Energica Motor Company"@en "LiveWire"@en "Super Soco"@en "Vmoto"@en "NIU Technologies"@en "Silence"@en "Segway"@en "Sur-Ron"@en "Talaria"@en "Electric Motion"@en "Stark Future"@en "Can-Am"@en "Polaris Inc."@en "Arctic Cat"@en "Linhai"@en "Access Motor"@en "Aeon Motor"@en "Goes"@en "Hisun"@en "Kayo"@en "Segway Powersports"@en "Adiva"@en "Daelim Motor"@en "Hyosung"@en "UM Motorcycles"@en "Motron"@en "Blata"@en "Praga"@en "MAN Truck & Bus"@en "Scania AB"@en "Volvo Trucks"@en "Renault Trucks"@en "DAF"@en "Avia"@en "LIAZ"@en "Kamaz"@en "MAZ"@en "ZIL"@en "Fuso"@en "Hino Motors"@en "UD Trucks"@en "BMC"@en "Ford Trucks"@en "Otokar"@en "Ikarus"@en "Karosa"@en "SOR Libchavy"@en "Solaris Bus & Coach"@en "Iveco Bus"@en "Setra"@en "Van Hool"@en "VDL Bus & Coach"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-5

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "Neoplan"@en "Yutong"@en "King Long"@en "Temsa"@en "Irizar"@en "Zetor"@en "John Deere"@en "CNH Industrial"@en "New Holland Agriculture"@en "Case IH"@en "Case Construction Equipment"@en "Fendt"@en "Claas"@en "Massey Ferguson"@en "Valtra"@en "Kubota"@en "Yanmar"@en "Same"@en "Deutz-Fahr"@en "Lamborghini Trattori"@en "Landini"@en "McCormick Tractors"@en "Steyr Tractor"@en "Ursus"@en "Belarus"@en "JCB"@en "Caterpillar Inc."@en "Komatsu Limited"@en "Liebherr"@en "Volvo Construction Equipment"@en "Bobcat Company"@en "Doosan"@en "Develon"@en "Hyundai Construction Equipment"@en "Hitachi Construction Machinery"@en "Kobelco"@en "Takeuchi Manufacturing"@en "Sany"@en "XCMG"@en "Zoomlion"@en "Wacker Neuson"@en "Ammann Group"@en "Bomag"@en "Hamm AG"@en "Dynapac"@en "Terex"@en "Manitou"@en "Merlo"@en "Dieci"@en "Linde Material Handling"@en "Jungheinrich"@en "Still GmbH"@en "Toyota Material Handling"@en "Hyster"@en "Yale Materials Handling Corporation"@en "Schmitz Cargobull"@en "Krone"@en "Kögel"@en "Wielton"@en "Schwarzmüller"@en "Fliegl"@en "Humbaur"@en "Böckmann"@en "Agados"@en "Vezeko"@en "Brenderup"@en "Pongratz"@en "Eduard"@en "Ifor Williams Trailers"@en "Faymonville"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-labels-6

```sparql
SELECT DISTINCT ?seed ?item ?itemLabel ?description ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?seed { "Goldhofer"@en "Nooteboom"@en "Kässbohrer"@en "Schwarzmüller Group"@en "Michelin"@en "Bridgestone"@en "Goodyear Tire and Rubber Company"@en "Continental AG"@en "Pirelli"@en "Hankook Tire"@en "Kumho Tire"@en "Nexen Tire"@en "Nokian Tyres"@en "Toyo Tire Corporation"@en "Yokohama Rubber Company"@en "Sumitomo Rubber Industries"@en "Falken Tire"@en "Dunlop Tyres"@en "Barum"@en "Matador"@en "Sava"@en "Fulda"@en "Semperit"@en "Uniroyal"@en "BFGoodrich"@en "Cooper Tire & Rubber Company"@en "General Tire"@en "Kleber"@en "Firestone Tire and Rubber Company"@en "Vredestein"@en "Apollo Tyres"@en "CEAT"@en "MRF"@en "JK Tyre"@en "Giti Tire"@en "Linglong Tire"@en "Sailun"@en "Triangle Group"@en "Nankang Rubber Tire"@en "Maxxis"@en "Cheng Shin Rubber"@en "Kenda Rubber Industrial Company"@en "Mitas"@en "Petlas"@en "Balkrishna Industries"@en "Alliance Tire Company"@en "Trelleborg AB"@en "Titan International"@en "Double Coin"@en "Taurus"@en }
 ?item rdfs:label ?seed. FILTER(STRSTARTS(STR(?item),STR(wd:Q)))
 OPTIONAL { ?item wdt:P31 ?class. } OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 OPTIONAL { ?item schema:description ?description. FILTER(LANG(?description)="en") }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item
```

## selected-search-0

```sparql
SELECT ?seed ?item ?itemLabel ?description WHERE {
 VALUES ?seed {"ORA" "Aurus Motors" "Chatenet" "Microlino" "Tazzari EV" "e.GO Mobile" "Artega" "Apollo Automobil" "Wolseley Motors" "Wanderer" "Jawa Moto" "Babetta"}
 SERVICE wikibase:mwapi {bd:serviceParam wikibase:endpoint "www.wikidata.org"; wikibase:api "EntitySearch"; mwapi:search ?seed; mwapi:language "en"; mwapi:limit "3". ?item wikibase:apiOutputItem mwapi:item.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## selected-search-1

```sparql
SELECT ?seed ?item ?itemLabel ?description WHERE {
 VALUES ?seed {"BSA Motorcycles" "Ariel Motorcycles" "SYM Motors" "CFMoto" "Zontes" "Kove Moto" "Mash Motors" "Benda" "Yezdi" "Ural" "NIU Technologies" "Segway"}
 SERVICE wikibase:mwapi {bd:serviceParam wikibase:endpoint "www.wikidata.org"; wikibase:api "EntitySearch"; mwapi:search ?seed; mwapi:language "en"; mwapi:limit "3". ?item wikibase:apiOutputItem mwapi:item.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## selected-search-2

```sparql
SELECT ?seed ?item ?itemLabel ?description WHERE {
 VALUES ?seed {"Talaria" "Access Motor" "Goes" "Hisun" "Segway Powersports" "Motron" "SOR Libchavy" "VDL Bus & Coach" "New Holland Agriculture" "Doosan" "Kobelco" "Still GmbH"}
 SERVICE wikibase:mwapi {bd:serviceParam wikibase:endpoint "www.wikidata.org"; wikibase:api "EntitySearch"; mwapi:search ?seed; mwapi:language "en"; mwapi:limit "3". ?item wikibase:apiOutputItem mwapi:item.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## selected-search-3

```sparql
SELECT ?seed ?item ?itemLabel ?description WHERE {
 VALUES ?seed {"Yale Materials Handling Corporation" "Fliegl" "Böckmann" "Brenderup" "Pongratz" "Goldhofer" "Kässbohrer" "Schwarzmüller Group" "Kleber" "Sailun" "Cheng Shin Rubber" "Petlas"}
 SERVICE wikibase:mwapi {bd:serviceParam wikibase:endpoint "www.wikidata.org"; wikibase:api "EntitySearch"; mwapi:search ?seed; mwapi:language "en"; mwapi:limit "3". ?item wikibase:apiOutputItem mwapi:item.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## selected-search-4

```sparql
SELECT ?seed ?item ?itemLabel ?description WHERE {
 VALUES ?seed {"Trelleborg AB" "Titan International" "Ursus tractors" "Hyosung motorcycles" "MRF tyres" "Skywell automotive" "Trabant" "Eduard trailers" "Kayo motorcycles"}
 SERVICE wikibase:mwapi {bd:serviceParam wikibase:endpoint "www.wikidata.org"; wikibase:api "EntitySearch"; mwapi:search ?seed; mwapi:language "en"; mwapi:limit "3". ?item wikibase:apiOutputItem mwapi:item.}
 OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")} SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
}
```

## technical-classes

```sparql
SELECT ?item ?itemLabel WHERE { VALUES ?term { "tractor manufacturer"@en "agricultural machinery manufacturer"@en "construction equipment manufacturer"@en "trailer manufacturer"@en "automotive brand"@en "car brand"@en "body style"@en "production date"@en "production period"@en } ?item rdfs:label ?term. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }
```
