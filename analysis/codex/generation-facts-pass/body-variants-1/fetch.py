import concurrent.futures, json, pathlib, subprocess, urllib.request
ROOT=pathlib.Path('analysis/codex/generation-facts-pass/body-variants-1')
CACHE=ROOT/'final-rebuild'/'source-copies'
CACHE.mkdir(parents=True,exist_ok=True)
SOURCES={
 'octavia_2011':'https://www.aastaauto.ee/files/modelfiles/Octavia_kataloog_2011_ENG.pdf',
 'fabia_2013':'https://autocatalogarchive.com/wp-content/uploads/2018/07/Skoda-Fabia-2013-UK.pdf',
 'fabia_2009':'https://www.allcarcentral.com/Skoda_pdf/Skoda_Fabia_Catalogue_ENG_2008.pdf',
 'felicia_manual':'https://docar.cz/navody-k-obsluze/Skoda/navod-k-obsluze-skoda-felicia.pdf',
 'octavia_2024':'https://cdn.skoda-storyboard.com/2024/05/Octavia_technical_data_EN_842ba18d.pdf',
 'superb_2016':'https://cdn.skoda-storyboard.com/2016/05/TD-SUPERB-en.pdf',
 'superb_2013':'https://static.cream.sk/araver.sk/webroots/www/content/mediagallery/araver_system/file/article/file/11172.pdf',
 'superb_2024':'https://skoda.metrotehnica.ro/files/3117/1222/0129/TD-Superb-en_87b42ad4.pdf',
 'roomster_2011':'https://skodaroomster.eu/pdf/roomster-katalog-05-2011.pdf',
 'golf_2012':'https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/golf/golf-brochure-june-2012.pdf',
 'focus_2008':'https://xr793.com/wp-content/uploads/2022/10/2008-Ford-Focus-UK.pdf',
 'focus_2005':'https://xr793.com/wp-content/uploads/2022/09/2005-Ford-Focus-SPG-UK.pdf',
 'superb_combi_2016':'https://cdn.skoda-storyboard.com/2016/05/TD-SUPERB-COMBI-en.pdf',
 'superb_2024_factory':'https://cdn.skoda-storyboard.com/2024/05/Superb_Technical_Data_EN_97f2a3f1.pdf',
 'superb_combi_2024':'https://cdn.skoda-storyboard.com/2024/05/Superb_Combi_Technical_Data_EN_1d7a5d14.pdf',
 'felicia_cz':'https://skodafeliciafun.co.uk/Felicia_UsersManualCz.pdf',
 'golf_estate_2015':'https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/golf-estate-2013-2017/vw_golf_estate_mk7_2013-2017_aug_2015.pdf',
 'golf_2014_html':'https://manuals.plus/m/458e8c071804a91e8a7e130d2d3693f8dd8bcb0b3637538477750ee4582f0d80',
 'golf_2014':'https://manuals.plus/m/458e8c071804a91e8a7e130d2d3693f8dd8bcb0b3637538477750ee4582f0d80.pdf',
 'transporter_van_2015':'https://blog.le-parnass.com/catalogue_pdf/vw_transporter_vans2015.pdf',
 'transporter_shuttle_2015':'https://xr793.com/wp-content/uploads/2022/12/2015-VW-Transporter-Shuttle-UK.pdf',
 'praktik_2009':'https://www.allcarcentral.com/Skoda_pdf/Skoda_Praktik_Catalogue_2009.pdf',
 'passat_2014':'https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/passat/estate-v-ii/passat-estate-vii-brochure-jul-2014.pdf',
 'passat_2016':'https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/passat/estate-v-iii/passat-estate-viii-brochure-nov-2016.pdf',
 'caddy_2013':'https://xr793.com/wp-content/uploads/2022/12/2013-VW-Caddy-UK.pdf',
 'transit_2010':'https://xr793.com/wp-content/uploads/2022/09/2010-Ford-Transit-UK.pdf',
 'vw_vans_2012':'https://xr793.com/wp-content/uploads/2022/12/2012-VW-Range-Vans-UK.pdf',
 'p206_uk_2006':'https://xr793.com/wp-content/uploads/2022/12/2006-Peugeot-206-UK.pdf',
 'p206_cc_uk_2006':'https://xr793.com/wp-content/uploads/2022/12/2006-Peugeot-206-CC-UK.pdf',
 'focus_2010_manual':'https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/Focus_C307_BG_2010.pdf',
 'praktik_2011':'https://skodaroomster.eu/pdf/praktik/praktik-katalog-05-2011.pdf',
}
def fetch(item):
 name,url=item
 try:
  pdf=CACHE/(name+'.pdf'); txt=CACHE/(name+'.txt')
  if not pdf.exists():
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as r: data=r.read()
   if not data.startswith(b'%PDF'): raise ValueError('Not PDF')
   pdf.write_bytes(data)
  if not txt.exists(): subprocess.run(['C:/Program Files/Git/mingw64/bin/pdftotext.exe','-enc','UTF-8','-layout',str(pdf),str(txt)],check=True,capture_output=True)
  return {'id':name,'url':url,'result':'ok','textCharacters':len(txt.read_text(encoding='utf-8'))}
 except Exception as e:return {'id':name,'url':url,'result':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex: results=list(ex.map(fetch,SOURCES.items()))
(ROOT/'source-access.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
(ROOT/'source-documents.json').write_text(json.dumps(SOURCES,indent=2)+'\n',encoding='utf-8')
print(json.dumps(results))
