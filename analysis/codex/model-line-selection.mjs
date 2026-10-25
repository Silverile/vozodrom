// Manually selected European-market lines. h hatchback, k estate, s saloon,
import {batchOrder,batchSelection,batchAdditionalPages,batchAliases} from './model-line-batch-1.mjs';
// u SUV/crossover, m MPV, c coupe, r convertible, p pickup, v van.
// Each row: Czech display name | Wikipedia article | body codes | optional fixed slug.
export const order=['skoda','volkswagen','hyundai','kia','toyota','ford','dacia','bmw','tesla','renault','audi','mercedes-benz','peugeot','citroen','opel','fiat','seat','cupra','mini','volvo'];
export const selection={
skoda:`Favorit|Škoda Favorit|hk
Felicia|Škoda Felicia|hkp
Octavia|Škoda Octavia|hk|octavia
Fabia|Škoda Fabia|hks|fabia
Superb|Škoda Superb|hks|superb
Roomster|Škoda Roomster|mv
Yeti|Škoda Yeti|u
Rapid|Škoda Rapid (2012)|hk
Citigo|Škoda Citigo|h
Scala|Škoda Scala|h
Kamiq|Škoda Kamiq (Europe)|u
Karoq|Škoda Karoq|u|karoq
Kodiaq|Škoda Kodiaq|u|kodiaq
Enyaq|Škoda Enyaq|u|enyaq
Elroq|Škoda Elroq|u`,
volkswagen:`Polo|Volkswagen Polo|hs
Golf|Volkswagen Golf|hkr|golf
Passat|Volkswagen Passat|sk|passat
Jetta|Volkswagen Jetta|s
Corrado|Volkswagen Corrado|c
Scirocco|Volkswagen Scirocco|c
Lupo|Volkswagen Lupo|h
Fox|Volkswagen Fox|h
up!|Volkswagen Up|h|up
Beetle|Volkswagen New Beetle|hr
Eos|Volkswagen Eos|r
CC|Volkswagen CC|s
Phaeton|Volkswagen Phaeton|s
Arteon|Volkswagen Arteon|hk
Touran|Volkswagen Touran|m
Sharan|Volkswagen Sharan|m
Tiguan|Volkswagen Tiguan|u|tiguan
Touareg|Volkswagen Touareg|u
T-Roc|Volkswagen T-Roc|ur
T-Cross|Volkswagen T-Cross|u
Taigo|Volkswagen Taigo|u
Tayron|Volkswagen Tayron|u
ID.3|Volkswagen ID.3|h|id-3
ID.4|Volkswagen ID.4|u|id4
ID.5|Volkswagen ID.5|u|id-5
ID.7|Volkswagen ID.7|hk|id-7
ID. Buzz|Volkswagen ID. Buzz|mv|id-buzz
Caddy|Volkswagen Caddy|mv
Transporter|Volkswagen Transporter|mv
Multivan|Volkswagen Multivan|m
Amarok|Volkswagen Amarok|p`,
hyundai:`Atos|Hyundai Atos|h
i10|Hyundai i10|h
i20|Hyundai i20|h
i30|Hyundai i30|hk|i30
i40|Hyundai i40|sk
Accent|Hyundai Accent|hs
Elantra|Hyundai Elantra|hsk
Sonata|Hyundai Sonata|s
Getz|Hyundai Getz|h
Grandeur|Hyundai Grandeur|s
Ioniq|Hyundai Ioniq|h
Ioniq 5|Hyundai Ioniq 5|u
Ioniq 6|Hyundai Ioniq 6|s
Ioniq 9|Hyundai Ioniq 9|u
Kona|Hyundai Kona|u
Tucson|Hyundai Tucson|u|tucson
Santa Fe|Hyundai Santa Fe|u
ix20|Hyundai ix20|m
Matrix|Hyundai Matrix|m
Trajet|Hyundai Trajet|m
Terracan|Hyundai Terracan|u
Galloper|Hyundai Galloper|u
Coupé|Hyundai Tiburon|c|coupe
Veloster|Hyundai Veloster|c
Nexo|Hyundai Nexo|u
Staria|Hyundai Staria|mv
H-1|Hyundai Starex|mv|h-1
Inster|Hyundai Inster|u`,
kia:`Pride|Kia Pride|hk
Sephia / Shuma|Kia Sephia|hs|sephia
Clarus|Kia Credos|sk
Carens|Kia Carens|m
Carnival|Kia Carnival|m
Joice|Kia Joice|m
Optima|Kia Optima|sk
Picanto|Kia Picanto|h
Rio|Kia Rio|hsk
Ceed|Kia Ceed|hk|ceed
ProCeed|Kia ProCeed|k
XCeed|Kia XCeed|u
Cerato|Kia Cerato|hs
Venga|Kia Venga|m
Soul|Kia Soul|u
Stonic|Kia Stonic|u
Sportage|Kia Sportage|u|sportage
Sorento|Kia Sorento|u
Niro|Kia Niro|u
EV3|Kia EV3|u
EV4|Kia EV4|hs
EV5|Kia EV5|u
EV6|Kia EV6|u
EV9|Kia EV9|u
Stinger|Kia Stinger|h
Opirus|Kia Opirus|s
Retona|Kia Retona|u
PV5|Kia PV5|mv`,
toyota:`Aygo|Toyota Aygo|h
Aygo X|Toyota Aygo X|u
Yaris|Toyota Yaris|h|yaris
Yaris Cross|Toyota Yaris Cross|u
Corolla|Toyota Corolla|hskcr|corolla
Auris|Toyota Auris|hk
Carina|Toyota Carina|hsk
Avensis|Toyota Avensis|hsk
Camry|Toyota Camry|sk
Starlet|Toyota Starlet|h
Paseo|Toyota Paseo|cr
Celica|Toyota Celica|c
Supra|Toyota Supra|c
MR2|Toyota MR2|cr
GT86|Toyota 86|c|gt86
GR86|Toyota GR86|c|gr86
Prius|Toyota Prius|h
Prius+|Toyota Prius V|m|prius-plus
Urban Cruiser|Toyota Urban Cruiser|u
RAV4|Toyota RAV4|u|rav4
C-HR|Toyota C-HR|u
bZ4X|Toyota bZ4X|u|bz4x
Land Cruiser|Toyota Land Cruiser|u
4Runner|Toyota 4Runner|u|4runner
Highlander|Toyota Highlander|u
Verso|Toyota Verso|m
Corolla Verso|Toyota Corolla Verso|m
Verso-S|Toyota Ractis|m|verso-s
Previa|Toyota Previa|m
Picnic|Toyota Picnic|m
Proace|Toyota Proace|mv
Proace City|Toyota Proace City|mv
Proace Max|Toyota Proace Max|v
Hilux|Toyota Hilux|p
Mirai|Toyota Mirai|s
iQ|Toyota iQ|h|iq`,
ford:`Fiesta|Ford Fiesta|h
Focus|Ford Focus|hsk|focus
Escort|Ford Escort (Europe)|hskrv
Sierra|Ford Sierra|hsk
Scorpio|Ford Scorpio|hsk
Mondeo|Ford Mondeo|hsk
Ka|Ford Ka|hr
Fusion|Ford Fusion (Europe)|m
B-Max|Ford B-Max|m
C-Max|Ford C-Max|m
S-Max|Ford S-Max|m
Galaxy|Ford Galaxy|m
Puma|Ford Puma (coupé)|cu
Cougar|Ford Cougar|c
Probe|Ford Probe|c
Capri|Ford Capri (2024)|u
Mustang|Ford Mustang|cr
Mustang Mach-E|Ford Mustang Mach-E|u
EcoSport|Ford EcoSport|u
Kuga|Ford Kuga|u|kuga
Edge|Ford Edge|u
Explorer|Ford Explorer|u
Bronco|Ford Bronco|u
GT|Ford GT|c
Ranger|Ford Ranger (T6)|p
Tourneo Connect|Ford Tourneo Connect|m
Tourneo Courier|Ford Tourneo Courier|m
Tourneo Custom|Ford Tourneo Custom|m
Transit|Ford Transit|v
Transit Connect|Ford Transit Connect|v
Transit Courier|Ford Transit Courier|v
Transit Custom|Ford Transit Custom|v`,
dacia:`Logan|Dacia Logan|hskpv
Sandero|Dacia Sandero|h|sandero
Duster|Dacia Duster|u|duster
Jogger|Dacia Jogger|m
Lodgy|Dacia Lodgy|m
Dokker|Dacia Dokker|mv
Spring|Dacia Spring|h
Solenza|Dacia Solenza|h
SuperNova|Dacia SuperNova|h
Nova|Dacia Nova|h
1300 / 1310|Dacia 1300|sk|1300
Pick-Up|Dacia Pick-Up|p
Bigster|Dacia Bigster|u`,
bmw:`Řada 1|BMW 1 Series|hc|rada-1
Řada 2|BMW 2 Series|cr|rada-2
Řada 2 Active Tourer|BMW 2 Series Active Tourer|m|rada-2-active-tourer
Řada 2 Gran Tourer|BMW 2 Series Gran Tourer|m|rada-2-gran-tourer
Řada 3|BMW 3 Series|skchr|rada-3
Řada 4|BMW 4 Series|chr|rada-4
Řada 5|BMW 5 Series|skh|rada-5
Řada 6|BMW 6 Series|crs|rada-6
Řada 6 Gran Turismo|BMW 6 Series (G32)|h|rada-6-gran-turismo
Řada 7|BMW 7 Series|s|rada-7
Řada 8|BMW 8 Series|crs|rada-8
i3|BMW i3|h
i4|BMW i4|h
i5|BMW i5|sk
i7|BMW i7|s
i8|BMW i8|cr
iX|BMW iX|u
iX1|BMW iX1|u
iX2|BMW iX2|u
iX3|BMW iX3|u
X1|BMW X1|u
X2|BMW X2|u
X3|BMW X3|u
X4|BMW X4|u
X5|BMW X5|u
X6|BMW X6|u
X7|BMW X7|u
XM|BMW XM|u
Z1|BMW Z1|r
Z3|BMW Z3|cr
Z4|BMW Z4|cr
Z8|BMW Z8|r`,
tesla:`Roadster|Tesla Roadster (first generation)|r
Model S|Tesla Model S|h|model-s
Model X|Tesla Model X|u|model-x
Model 3|Tesla Model 3|s|model-3
Model Y|Tesla Model Y|u|model-y`,
renault:`Clio|Renault Clio|hk|clio
Mégane|Renault Mégane|hskcr|megane
Mégane E-Tech|Renault Mégane E-Tech|h|megane-e-tech
Twingo|Renault Twingo|h
4|Renault 4|hv|4
5|Renault 5|h|5
9|Renault 9 and 11|s|9
11|Renault 9 and 11|h|11
18|Renault 18|sk|18
19|Renault 19|hsr|19
21|Renault 21|sk|21
25|Renault 25|h|25
Safrane|Renault Safrane|h
Laguna|Renault Laguna|hkc
Talisman|Renault Talisman|sk
Fluence|Renault Fluence|s
Latitude|Renault Latitude|s
Vel Satis|Renault Vel Satis|h
Avantime|Renault Avantime|m
Modus|Renault Modus|m
Scénic|Renault Scénic|mu|scenic
Espace|Renault Espace|mu
Arkana|Renault Arkana|u
Captur|Renault Captur|u
Kadjar|Renault Kadjar|u
Austral|Renault Austral|u
Koleos|Renault Koleos|u
Rafale|Renault Rafale|u
Symbioz|Renault Symbioz|u
Wind|Renault Wind|r
Spider|Renault Sport Spider|r
Zoe|Renault Zoe|h
Twizy|Renault Twizy|h
Kangoo|Renault Kangoo|mv
Express|Renault Express|v
Trafic|Renault Trafic|mv
Master|Renault Master|v`,
audi:`A1|Audi A1|h
A2|Audi A2|h
A3|Audi A3|hsr
A4|Audi A4|skcr
A5|Audi A5|skchr
A6|Audi A6|sk
A6 e-tron|Audi A6 e-tron|hk
A7|Audi A7|h
A8|Audi A8|s
Q2|Audi Q2|u
Q3|Audi Q3|u
Q4 e-tron|Audi Q4 e-tron|u
Q5|Audi Q5|u
Q6 e-tron|Audi Q6 e-tron|u
Q7|Audi Q7|u
Q8|Audi Q8|u
Q8 e-tron|Audi Q8 e-tron|u
e-tron GT|Audi e-tron GT|s
TT|Audi TT|cr
R8|Audi R8|cr
80|Audi 80|sk|80
90|Audi 80|s|90
100|Audi 100|sk|100
200|Audi 200|s|200
Cabriolet|Audi Cabriolet|r
Coupé|Audi Coupé|c|coupe
V8|Audi V8|s|v8`,
'mercedes-benz':`Třída A|Mercedes-Benz A-Class|hs|trida-a
Třída B|Mercedes-Benz B-Class|m|trida-b
Třída C|Mercedes-Benz C-Class|skcr|trida-c
CLA|Mercedes-Benz CLA|sk
CLC|Mercedes-Benz CLC-Class|c
CLK|Mercedes-Benz CLK-Class|cr
CLE|Mercedes-Benz CLE|cr
CLS|Mercedes-Benz CLS|sk
Třída E|Mercedes-Benz E-Class|skcr|trida-e
Třída S|Mercedes-Benz S-Class|scr|trida-s
CL|Mercedes-Benz CL-Class|c
SL|Mercedes-Benz SL-Class|r
SLK / SLC|Mercedes-Benz SLK-Class|r|slk
AMG GT|Mercedes-AMG GT|cr
AMG GT 4-Door|Mercedes-AMG GT 4-Door Coupé|h|amg-gt-4-door
Třída G|Mercedes-Benz G-Class|ur|trida-g
GLA|Mercedes-Benz GLA|u
GLB|Mercedes-Benz GLB|u
GLC|Mercedes-Benz GLC|u
GLE|Mercedes-Benz GLE|u
GLS|Mercedes-Benz GLS|u
Třída R|Mercedes-Benz R-Class|m|trida-r
Třída V|Mercedes-Benz V-Class|m|trida-v
Vaneo|Mercedes-Benz Vaneo|m
Vito|Mercedes-Benz Vito|v
Citan|Mercedes-Benz Citan|mv
Třída T|Mercedes-Benz T-Class|m|trida-t
EQE|Mercedes-Benz EQE|s
EQS|Mercedes-Benz EQS|h
EQA|Mercedes-Benz EQA|u
EQB|Mercedes-Benz EQB|u
EQC|Mercedes-Benz EQC|u
EQE SUV|Mercedes-Benz EQE SUV|u
EQS SUV|Mercedes-Benz EQS SUV|u
Třída X|Mercedes-Benz X-Class|p|trida-x
190|Mercedes-Benz W201|s|190`,
peugeot:`106|Peugeot 106|h|106
107|Peugeot 107|h|107
108|Peugeot 108|hr|108
1007|Peugeot 1007|h|1007
205|Peugeot 205|hrv|205
206|Peugeot 206|hskr|206
207|Peugeot 207|hkr|207
208|Peugeot 208|h|208
301|Peugeot 301 (2012)|s|301
306|Peugeot 306|hksr|306
307|Peugeot 307|hkr|307
308|Peugeot 308|hkr|308
309|Peugeot 309|h|309
405|Peugeot 405|sk|405
406|Peugeot 406|skc|406
407|Peugeot 407|skc|407
408|Peugeot 408 (crossover)|u|408
508|Peugeot 508|shk|508
605|Peugeot 605|s|605
607|Peugeot 607|s|607
806|Eurovans|m|806
807|Eurovans|m|807
2008|Peugeot 2008|u|2008
3008|Peugeot 3008|mu|3008
5008|Peugeot 5008|mu|5008
4007|Peugeot 4007|u|4007
4008|Peugeot 4008|u|4008
RCZ|Peugeot RCZ|c
iOn|Peugeot iOn|h|ion
Partner|Peugeot Partner|mv
Rifter|Peugeot Rifter|m
Bipper|Peugeot Bipper|mv
Expert|Peugeot Expert|v
Traveller|Peugeot Traveller|m
Boxer|Peugeot Boxer|v`,
citroen:`AX|Citroën AX|h
Saxo|Citroën Saxo|h
C1|Citroën C1|hr
C2|Citroën C2|h
C3|Citroën C3|h
C3 Aircross|Citroën C3 Aircross|u
C3 Picasso|Citroën C3 Picasso|m
C4|Citroën C4|hcu
C4 Cactus|Citroën C4 Cactus|hu
C4 Picasso / SpaceTourer|Citroën C4 Picasso|m|c4-picasso
C4 Aircross|Citroën C4 Aircross|u
C4 X|Citroën C4 X|su
C5|Citroën C5|hsk
C5 Aircross|Citroën C5 Aircross|u
C5 X|Citroën C5 X|k
C6|Citroën C6|s
C8|Eurovans|m
XM|Citroën XM|hk
Xantia|Citroën Xantia|hk
BX|Citroën BX|hk
ZX|Citroën ZX|hk
Xsara|Citroën Xsara|hk
Xsara Picasso|Citroën Xsara Picasso|m
Evasion|Eurovans|m
C-Crosser|Citroën C-Crosser|u
C-Elysée|Citroën C-Elysée|s
C-Zero|Citroën C-Zero|h
Ami|Citroën Ami (electric vehicle)|h
Berlingo|Citroën Berlingo|mv
Nemo|Citroën Nemo|mv
Jumpy|Citroën Jumpy|v
SpaceTourer|Citroën SpaceTourer|m
Jumper|Citroën Jumper|v
C15|Citroën C15|v
C25|Citroën C25|v`,
opel:`Corsa|Opel Corsa|h
Astra|Opel Astra|hskcr
Vectra|Opel Vectra|hsk
Insignia|Opel Insignia|hsk
Omega|Opel Omega|sk
Calibra|Opel Calibra|c
Tigra|Opel Tigra|cr
Agila|Opel Agila|h
Adam|Opel Adam|h
Karl|Opel Karl|h
Meriva|Opel Meriva|m
Zafira|Opel Zafira|m
Zafira Life|Opel Zafira Life|m
Mokka|Opel Mokka|u
Crossland|Opel Crossland|u
Grandland|Opel Grandland|u
Frontera|Opel Frontera|u
Antara|Opel Antara|u
Sintra|Opel Sintra|m
Combo|Opel Combo|mv
Movano|Opel Movano|v
Vivaro|Opel Vivaro|v
Monterey|Opel Monterey|u
Ampera|Opel Ampera|h
Ampera-e|Opel Ampera-e|h
Signum|Opel Signum|h
Kadett|Opel Kadett|hskcr
Senator|Opel Senator|s`,
fiat:`500|Fiat 500 (2007)|hr|500
500L|Fiat 500L|m|500l
500X|Fiat 500X|u|500x
Panda|Fiat Panda|h
Grande Panda|Fiat Grande Panda|hu
Uno|Fiat Uno|h
Tipo|Fiat Tipo (2015)|hsk
Tempra|Fiat Tempra|sk
Croma|Fiat Croma|hk
Bravo / Brava|Fiat Bravo and Brava|h|bravo
Punto|Fiat Punto|hr
Palio|Fiat Palio|hk
Siena|Fiat Siena|s
Albea|Fiat Albea|s
Marea|Fiat Marea|sk
Stilo|Fiat Stilo|hk
Seicento|Fiat Seicento|h
Cinquecento|Fiat Cinquecento|h
Idea|Fiat Idea|m
Multipla|Fiat Multipla|m
Ulysse|Fiat Ulysse|m
Sedici|Fiat Sedici|u
Barchetta|Fiat Barchetta|r
Coupé|Fiat Coupé|c|coupe
Doblò|Fiat Doblò|mv|doblo
Fiorino|Fiat Fiorino|v
Qubo|Fiat Qubo|m
Talento|Fiat Talento|v
Scudo|Fiat Scudo|v
Ducato|Fiat Ducato|v
Freemont|Fiat Freemont|u
124 Spider|Fiat 124 Spider (2016)|r|124-spider
600|Fiat 600 (2023)|u|600
Topolino|Fiat Topolino (2023)|h
Fullback|Fiat Fullback|p
Strada|Fiat Strada|p
Linea|Fiat Linea|s`,
seat:`Ibiza|SEAT Ibiza|hk
Leon|SEAT León|hk|leon
Toledo|SEAT Toledo|hs
Córdoba|SEAT Córdoba|sk|cordoba
Altea|SEAT Altea|m
Exeo|SEAT Exeo|sk
Arosa|SEAT Arosa|h
Mii|SEAT Mii|h
Ateca|SEAT Ateca|u
Arona|SEAT Arona|u
Tarraco|SEAT Tarraco|u
Alhambra|SEAT Alhambra|m
Inca|SEAT Inca|v
Málaga|SEAT Málaga|s|malaga
Marbella|SEAT Marbella|h
Terra|SEAT Terra|v`,
cupra:`Born|Cupra Born|h
Formentor|Cupra Formentor|u
Leon|Cupra León|hk|leon
Ateca|Cupra Ateca|u
Tavascan|Cupra Tavascan|u
Terramar|Cupra Terramar|u`,
mini:`Cooper|Mini Hatch|hr
Classic|Mini|h
Clubman|Mini Clubman|k
Countryman|Mini Countryman|u
Paceman|Mini Paceman|u
Coupé|Mini Coupé|c|coupe
Roadster|Mini Roadster|r
Aceman|Mini Aceman|u`,
volvo:`240|Volvo 200 Series|sk|240
340 / 360|Volvo 300 Series|hs|340-360
440|Volvo 440/460|h|440
460|Volvo 440/460|s|460
480|Volvo 480|c|480
740|Volvo 700 Series|sk|740
760|Volvo 700 Series|sk|760
780|Volvo 780|c|780
850|Volvo 850|sk|850
940|Volvo 900 Series|sk|940
960|Volvo 900 Series|sk|960
S40|Volvo S40|s
V40|Volvo V40|kh
S60|Volvo S60|s
V60|Volvo V60|k
S70|Volvo S70|s
V70|Volvo V70|k
S80|Volvo S80|s
V90|Volvo V90|k
S90|Volvo S90|s
C30|Volvo C30|h
C70|Volvo C70|cr
XC40|Volvo XC40|u
XC60|Volvo XC60|u
XC70|Volvo XC70|k
XC90|Volvo XC90|u
EX30|Volvo EX30|u
EC40|Volvo EC40|u
EX90|Volvo EX90|u
ES90|Volvo ES90|s`
};
export const additionalPages={
 'volkswagen/beetle':['Volkswagen Beetle (A5)'],
 'ford/puma':['Ford Puma (crossover)'],
 'ford/explorer':['Ford Explorer (Europe)'],
 'ford/ranger':['Ford Ranger (international)'],
 'renault/4':['Renault 4 E-Tech'],
 'renault/5':['Renault 5 E-Tech'],
 'renault/scenic':['Renault Scénic E-Tech'],
 'fiat/500':['Fiat New 500'],
 'fiat/tipo':['Fiat Tipo (Type 160)'],
 'fiat/bravo':['Fiat Bravo (2007)'],
 'fiat/punto':['Fiat Grande Punto'],
 'mini/cooper':['Mini Convertible'],
 'hyundai/tucson':['Hyundai ix35 (2009)'],
 'mercedes-benz/glc':['Mercedes-Benz GLK-Class'],
 'mercedes-benz/gle':['Mercedes-Benz M-Class'],
 'mercedes-benz/gls':['Mercedes-Benz GL-Class'],
 'mercedes-benz/slk':['Mercedes-Benz SLC-Class']
};
// Corrections from the European body-style pass; unsupported quadricycle styles stay unknown.
selection.skoda=selection.skoda.replace('Rapid (2012)|hk','Rapid (2012)|h');
selection.volkswagen=selection.volkswagen.replace('Volkswagen Caddy|mv','Volkswagen Caddy|mvp');
selection.toyota=selection.toyota.replace('Toyota Corolla|hskcr','Toyota Corolla|hsk');
selection.bmw=selection.bmw.replace('BMW 1 Series|hc','BMW 1 Series|hcr');
selection.renault=selection.renault.replace('Renault 4|hv','Renault 4|huv').replace('Renault Twizy|h','Renault Twizy|');
selection.citroen=selection.citroen.replace('Citroën C4 X|su','Citroën C4 X|s').replace('Citroën Ami (electric vehicle)|h','Citroën Ami (electric vehicle)|');
selection.fiat=selection.fiat.replace('Fiat Topolino (2023)|h','Fiat Topolino (2023)|');
selection.volvo=selection.volvo.replace('Volvo ES90|s','Volvo ES90|h');
selection.skoda=selection.skoda.replace('Škoda Kamiq (Europe)','Škoda Kamiq');
selection.kia=selection.kia.split('\n').filter(r=>!r.startsWith('ProCeed|')).join('\n');
selection.ford=selection.ford.replace('Ford Capri (2024)','Ford Capri EV');
selection.opel=selection.opel.replace('Opel Movano','Renault Master');
additionalPages['ford/explorer']=['Ford Explorer EV'];
additionalPages['hyundai/tucson']=[]; // ix35 is already described within Tucson; no guessed article.
additionalPages['renault/scenic']=['Renault Scenic E-Tech'];
// Extra primary articles for derivatives whose short article redirects to a shared-platform page.
additionalPages['skoda/felicia']=['Škoda Felicia'];
selection.bmw=selection.bmw.replace('i3|BMW i3|h','i3|BMW i3 (I01)|h');
additionalPages['bmw/iX3']=['BMW X3 (G01)'];
additionalPages['bmw/rada-3']=['BMW 3 Series (E30)','BMW 3 Series (E36)','BMW 3 Series (E46)','BMW 3 Series (E90)','BMW 3 Series (F30)','BMW 3 Series (G20)'];
additionalPages['volkswagen/golf']=['Volkswagen Golf Mk2','Volkswagen Golf Mk3','Volkswagen Golf Mk4','Volkswagen Golf Mk5','Volkswagen Golf Mk6','Volkswagen Golf Mk7','Volkswagen Golf Mk8'];
additionalPages['volkswagen/passat']=['Volkswagen Passat (B3)','Volkswagen Passat (B4)','Volkswagen Passat (B5)','Volkswagen Passat (B6)','Volkswagen Passat (B7)','Volkswagen Passat (B8)','Volkswagen Passat (B9)'];
additionalPages['volkswagen/tiguan']=['Volkswagen Tiguan (2007)','Volkswagen Tiguan (2016)','Volkswagen Tiguan (2023)'];
additionalPages['toyota/corolla']=['Toyota Corolla (E90)','Toyota Corolla (E100)','Toyota Corolla (E110)','Toyota Corolla (E120)','Toyota Corolla (E140)','Toyota Corolla (E170)','Toyota Corolla (E210)'];
additionalPages['toyota/yaris']=['Toyota Vitz','Toyota Yaris (XP210)'];
additionalPages['ford/focus']=['Ford Focus (first generation)','Ford Focus (second generation, Europe)','Ford Focus (third generation)','Ford Focus (fourth generation)'];
additionalPages['volvo/v40']=['Volvo S40','Volvo V40 (2012–2019)'];
additionalPages['bmw/i3']=['BMW i3'];
additionalPages['bmw/z4']=['BMW Z4 (E85)','BMW Z4 (E89)','BMW Z4 (G29)'];
selection.bmw=selection.bmw.replace('BMW i3 (I01)','BMW i3 (hatchback)');
selection.mini=selection.mini.replace('Mini Clubman|k','Mini Clubman (2007)|k');
selection.toyota=selection.toyota.replace('Urban Cruiser|Toyota Urban Cruiser|u','Urban Cruiser|Toyota Urban Cruiser (XP110)|u');
additionalPages['toyota/urban-cruiser']=['Toyota Urban Cruiser (BEV)'];
additionalPages['kia/pride']=['Ford Festiva'];
additionalPages['opel/frontera']=['Isuzu MU','Opel Frontera (2024)'];
additionalPages['volvo/xc70']=['Volvo V70'];
additionalPages['renault/express']=['Renault Express (2021)'];
additionalPages['renault/twingo']=['Renault Twingo E-Tech'];
selection.citroen+='\nC3 Pluriel|Citroën C3 Pluriel|r\nDS3|DS 3|hr\nDS4|DS 4|h\nDS5|DS 5|h';
selection.opel+='\nCascada|Opel Cascada|r\nSpeedster|Opel Speedster|r';
additionalPages['volvo/s90']=['Volvo 900 Series'];
additionalPages['volvo/v90']=['Volvo 900 Series'];
additionalPages['bmw/ix3']=additionalPages['bmw/iX3'];delete additionalPages['bmw/iX3'];
export const aliases={
 'skoda/favorit':['Forman'],'skoda/roomster':['Praktik'],'skoda/rapid':['Spaceback'],
 'volkswagen/jetta':['Vento','Bora'],'volkswagen/cc':['Passat CC'],'volkswagen/beetle':['New Beetle'],
 'hyundai/tucson':['ix35'],'hyundai/elantra':['Lantra'],
 'kia/optima':['Magentis'],'kia/ceed':["Cee’d",'Cee\'d','ProCeed','pro_cee\'d'],'kia/sephia':['Shuma'],
 'ford/escort':['Orion'],'ford/ka':['Ka+'],'renault/scenic':['Grand Scénic'],'renault/modus':['Grand Modus'],
 'mercedes-benz/slk':['SLC'],'mercedes-benz/glc':['GLK'],'mercedes-benz/gle':['ML','Třída M'],'mercedes-benz/gls':['GL'],
 'citroen/c4-picasso':['C4 SpaceTourer','Grand C4 Picasso','Grand C4 SpaceTourer'],'citroen/evasion':['Synergie'],
 'fiat/punto':['Grande Punto','Punto Evo'],'fiat/bravo':['Brava'],'fiat/500':['500e'],
 'opel/crossland':['Crossland X'],'opel/grandland':['Grandland X'],'opel/mokka':['Mokka X'],
 'mini/cooper':['Mini Hatch','Mini Cabrio','Mini Convertible'],'volvo/xc40':['EX40'],'volvo/ec40':['C40 Recharge']
};
selection.renault=selection.renault.split('\n').filter(r=>!r.startsWith('18|')).join('\n');
selection.skoda+='\nEpiq|Škoda Epiq|u';
order.push(...batchOrder);
Object.assign(selection,batchSelection);
Object.assign(additionalPages,batchAdditionalPages);
Object.assign(aliases,batchAliases);
