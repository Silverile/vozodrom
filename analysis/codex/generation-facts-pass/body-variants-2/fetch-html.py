import concurrent.futures,json,pathlib,urllib.request
from lxml import html
ROOT=pathlib.Path('analysis/codex/generation-facts-pass/body-variants-2')
CACHE=ROOT/'final-rebuild'/'source-copies'
SOURCES={
 'passat_b5_profile':'https://www.volkswagen-newsroom.com/en/vehicle-data-passat-b5-profile-19547',
 'ducato_manual_2016':'https://www.carmanualsonline.info/fiat-ducato-2016-owner-handbook-in-english/29',
 'mondeo_2007':'https://pdfcoffee.com/ford-mondeo-sales-brochure-june-2007-pdf-free.html',
 'megane3_launch':'https://media.renault.at/3/article/782',
 'megane3_estate_launch':'https://media.renault.at/1/article/845',
 'megane2_estate_sedan_launch':'https://presse.renault.de/55/?lang=deu',
 'megane2_cc_2009':"https://manuzoid.com/manuals/Yqmb8-Renault%20MEGANE%20COUPE-CABRIOLET%20Owner%27s%20manual",
 'megane2_2007_download':'https://www.auto-preisliste.de/download-preislisten-aller-marken/59-renault/2402-renault-megane-2002-2009/35723-2007-07-preisliste-renault-megane-megane-grandtour',
}
def fetch(item):
 name,url=item
 try:
  dest=CACHE/(name+'.html')
  if not dest.exists():
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=20)as r:data=r.read()
   dest.write_bytes(data)
  tree=html.fromstring(dest.read_bytes())
  (CACHE/(name+'.txt')).write_text(tree.text_content(),encoding='utf8')
  return {'id':name,'url':url,'result':'ok'}
 except Exception as e:return {'id':name,'url':url,'result':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as ex:results=list(ex.map(fetch,SOURCES.items()))
(ROOT/'html-source-documents.json').write_text(json.dumps(SOURCES,indent=2)+'\n',encoding='utf8')
(ROOT/'html-source-access.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf8')
print(json.dumps(results))
