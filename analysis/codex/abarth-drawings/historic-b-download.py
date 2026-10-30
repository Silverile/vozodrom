import json, pathlib, urllib.request
ROOT=pathlib.Path('C:/Workspace/Projects/CF')
out=ROOT/'vozodrom/analysis/codex/abarth-drawings'
cards=json.loads((ROOT/'vozodrom/src/data/catalog/model-cards/abarth.json').read_text(encoding='utf-8'))
data=[
('205a',0,'205A Berlinetta','https://commons.wikimedia.org/wiki/File:1950_Abarth_205A_Monza_FOS19.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/1950_Abarth_205A_Monza_FOS19.jpg/1280px-1950_Abarth_205A_Monza_FOS19.jpg','MrWalkr','CC BY-SA 4.0','1950 Abarth 205A Monza Berlinetta Vignale; exact Commons title, closed-hood road-bodied coupe at Goodwood 2019.'),
('595-historic',0,'595 historic','https://www.fiat500.ch/en/500/derivate/abarth-en/','https://www.fiat500.ch/wp-content/uploads/fileadmin/Bilder/500/Abarth/abarth_595_altfoto_1-768x532.jpg','Fiat 500 Club archive; original photographer unknown','Not stated','Period photograph caption: Fiat Abarth 595, front three-quarter view from the left.'),
('695-historic',0,'695 historic','https://www.lanemotormuseum.org/collection/cars/item/fiat-abarth-695-ss-1967/','https://www.lanemotormuseum.org/wp-content/uploads/2020/10/fiat_abarth_695_ss_1967_web1a.jpg','Lane Motor Museum','Not stated','1967 Fiat Abarth 695 SS identified by holding museum; narrow original body with decorative racing roundel to omit.'),
('850-tc',0,'850 TC stradale','https://ruylclassics.nl/ClassicCars/fiat-600d-abarth-850tc-jan-1962/?media=print&taal=','https://ruylclassics.nl/wp-content/uploads/fiat-600d-abarth-850tc-jan-1962-23-03-2021/002-1.jpg','Ruylclassics','Not stated','1962 matching-numbers Fiat 600D Abarth 850TC, original delivery 30 Jan 1962 to Bini Bruno, preserved road car with documented period hillclimb entry. ClassicDriver matching listing calls it stradale, 52 hp. Reference lower cooler belongs to this preserved stradale example; its factory status is not independently proven, so it must not be labelled nonstandard. The generated drawing omitted it and requires equipment review. Omit race numbers only. https://www.classicdriver.com/en/car/fiat/abarth/1962/608870'),
('ot-1000',0,'OT 1000 Berlina','https://www.abarth.jp/scorpion/abarth-classiche/6306','https://www.abarth.jp/scorpion/wp-content/uploads/2016/06/ABA_201605_006.jpg','Abarth Scorpion Magazine','Not stated','Official caption identifies 982cc Fiat Abarth OT1000 Berlina, 54 hp; road saloon.'),
('ot-1000',1,'OT 1000 Coupe','https://www.abarth.jp/scorpion/abarth-classiche/11581','https://www.abarth.jp/scorpion/wp-content/uploads/2019/01/190116_Abarth_Classiche_01.jpg','Abarth Scorpion Magazine','Not stated','Official 1965 Fiat Abarth OT1000 Coupe article; selected standard 62 hp Coupe representative of grouped generation, not racing OTR prototype.'),
('ot-1300',0,'OT 1300-124 Coupe','https://www.fa-automobile.com/detail-vente.php?v=4030','https://www.fa-automobile.com/photos/img_mz9z68z9631tqoz8bk6zx.jpg','FA Automobile','Not stated','1968 Fiat Abarth 1300/124 OT first series road coupe, chassis 0141512 and matching AB204 engine per dealer. Fiat850-derived body, not Periscopio. 400x300 original dealer image; front details visible.'),
('ot-850',0,'OT 850 Berlina','https://www.abarth.jp/scorpion/abarth-classiche/6306','https://www.abarth.jp/scorpion/wp-content/uploads/2016/06/ABA_201605_002.jpg','Abarth Scorpion Magazine','Not stated','Official caption identifies Fiat Abarth OT850 with front Abarth emblem and red name panel; road saloon.'),
]
manifest=[]
for slug,idx,safe,page,url,author,licence,evidence in data:
 id=f'abarth--{slug}--{idx}'; card=next(c for c in cards if c['lineSlug']==slug); g=card['generations'][idx]
 folder=ROOT/'vozodrom-data/front-photos/abarth'/f'{id} {safe}';folder.mkdir(parents=True,exist_ok=True)
 photo=folder/'reference.jpg'
 if not photo.exists():
  try: photo.write_bytes(urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read())
  except Exception as ex:print(id,ex);continue
 (folder/'info.txt').write_text(f'ID: {id}\nZnačka: Abarth\nModel: {card["name"]}\nGenerace: {g["name"]}\nRoky: {g["from"]}–{g["to"]}\n',encoding='utf-8')
 (folder/'zdroj.txt').write_text(f'Page: {page}\nImage: {url}\nAuthor: {author}\nLicense: {licence}\nSelected variant identity: {evidence}\nDownloaded: 2026-10-29\n',encoding='utf-8')
 manifest.append(dict(id=id,name=g['name'],photo=str(photo),folder=str(folder),page=page,imageUrl=url,author=author,licence=licence,selectedVersion=evidence,status='verified-photo'))
 print(id,photo.stat().st_size)
(out/'historic-b-photos.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
