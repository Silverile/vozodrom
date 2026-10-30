import json,pathlib,urllib.request,re,html
root=pathlib.Path('C:/Workspace/Projects/CF/vozodrom-data/front-photos/abarth'); cat=json.load(open('src/data/model-cards-index.json',encoding='utf-8'))['abarth']
items=[('750',0,'https://rezbach.de/4images/details.php?image_id=2693','https://rezbach.de/4images/data/media/80/IMG_6232_upload.jpg'),('750',1,'https://commons.wikimedia.org/wiki/File:Abarth_Zagato_750.jpg',None),('1000',1,'https://www.hellenicmotormuseum.gr/en/car/abarth-1000-zagato-record-monza-bialbero/','https://www.hellenicmotormuseum.gr/wp-content/uploads/2019/06/Abarth-Fiat-1000.jpg'),('1000',2,'https://www.abarth-germany.de/en/translate-to-englisch-die-abarths/translate-to-englisch-abarth-monomille','https://www.abarth-germany.de/fileadmin/_processed_/3/4/csm_1_Monomille_2_b6dc778139.jpg'),('2200',0,'https://commons.wikimedia.org/wiki/File:1960_Abarth_2200_Allemano_Coup%C3%A9_4VPJ_in_Bremen_(front).jpg',None),('2400',0,'https://commons.wikimedia.org/wiki/File:1964_Abarth_2400_Coupe_HH.jpg',None),('1000',0,'https://www.autobelle.it/en/archive/1964_Abarth_1000_Berlina_49315.xhtml',None)]
out=[]
for k,i,page,img in items:
 g=cat[k]['generations'][i]; ident=f'abarth--{k}--{i}'; folder=root/(ident+' '+re.sub(r'[^a-zA-Z0-9 -]','',g['name']));folder.mkdir(parents=True,exist_ok=True)
 try:
  text=urllib.request.urlopen(urllib.request.Request(page,headers={'User-Agent':'Mozilla/5.0'})).read().decode()
  (folder/'source-page.html').write_text(text,encoding='utf-8')
  if not img:
   if 'commons.wikimedia' in page: img=html.unescape(re.search(r'class="fullImageLink"[^>]*>\s*<a href="([^"]+)"',text).group(1))
   else:
    print(ident,re.findall(r'<img[^>]*src="([^"]+)"',text));continue
  urllib.request.urlretrieve(img,folder/'reference.jpg')
  (folder/'info.txt').write_text(f'ID: {ident}\nZnačka: Abarth\nModel: {cat[k]["name"]}\nGenerace: {g["name"]}\nRoky: {g["from"] or "?"}–{g["to"] or "?"}\n',encoding='utf-8')
  (folder/'zdroj.txt').write_text(f'Source webpage: {page}\nImage URL: {img}\nSelected variant: {g["name"]}\n',encoding='utf-8')
  out.append(dict(id=ident,path=str(folder/'reference.jpg'),source=page,imageUrl=img,selectedVersion=g['name'],verification='pending visual review'))
  print(ident,str(folder/'reference.jpg'))
 except Exception as e: print(ident,'ERROR',str(e))
pathlib.Path('analysis/codex/abarth-drawings/historic-a-photos.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
