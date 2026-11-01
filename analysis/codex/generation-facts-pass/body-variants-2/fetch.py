import concurrent.futures,json,pathlib,subprocess,urllib.request
ROOT=pathlib.Path('analysis/codex/generation-facts-pass/body-variants-2')
CACHE=ROOT/'final-rebuild'/'source-copies';CACHE.mkdir(parents=True,exist_ok=True)
SOURCES={
 'transporter_t61_dimensions':'https://www.volkswagen-vans.co.uk/idhub/content/dam/onehub_nfz/importers/gb/downloads/dimensions/Dimension-Drawings-Transporter_6_1.pdf',
 'transporter_t61_2020':'https://cf-cdn-v6.volkswagen.at/media/Kwc_Basic_DownloadTag_Component/33468-549626-374108-549628-387613-linkTag-child/default/e8f25eac/1700740051/tr-ka-ko-pw-eu6dtemp-kw43-19-en-200109.pdf',
 'transit_bemm_2016':'https://faroutride.com/wp-content/uploads/2017/03/Ford-Transit-BEMM-2016.pdf',
 'transit_2017':'https://gpthire.ie/wp-content/uploads/2018/09/BRO-ford_transit.pdf',
 'transporter_t4_manual_1992':'https://devon.vwt4camper.info/Aug_1992_VW_T4_Owners_ManualWM.pdf',
 'master_2018':'https://cdn.group.renault.com/ren/ch/renault-new-cars/brochures/Renault_Master_BR_f.pdf',
 'master_2017_excerpt':'https://westrum.no/wp-content/uploads/2017/08/Renault-Master-Van-utdrag-tekniske-data.pdf',
 'golf8_hatch_2020':'https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/golf-8-%282020---present%29/vw_golf_2020-present_dec_2020.pdf',
 'berlingo_van_2009':'https://xr793.com/wp-content/uploads/2022/09/2009-Citroen-Berlingo-UK.pdf',
 'master_2020':'https://donaghhickeymotors.com/wp-content/uploads/2020/03/master-brochure.pdf',
 'p207_sw_2008':'https://www.allcarcentral.com/peugeot_UK_pdf/Peugeot_207SW_2008.pdf',
 'p207_cc_2008':'https://www.allcarcentral.com/peugeot_UK_pdf/Peugeot_207cc_2008.pdf',
 'golf8_estate_2021':'https://www.volkswagen.co.uk/idhub/content/dam/onehub_pkw/importers/gb/downloads/brochures/used-cars/golf-estate-8/vw_golf_estate_brochure_jan_2021.pdf',
 'passat_b5_se_2003':'https://www.volkswagen.se/idhub/content/dam/onehub_pkw/importers/se/hjalp-och-support/broschyrer/passat/before-nbd/000.Passat_Fakta_2003_-_tryck_03_-_VW201.download.pdf',
 'p307_specs_2006':'https://www.forum-peugeot.com/wp-content/uploads/2016/11/06A-307.pdf',
 'p307_sw_specs_2006':'https://www.forum-peugeot.com/wp-content/uploads/2016/11/06A-307SW.pdf',
 'megane3_coupe_2011':'https://xr793.com/wp-content/uploads/2022/12/2011-Renault-Megane-Coupe-UK.pdf',
 'p307_2006':'https://xr793.com/wp-content/uploads/2022/12/2006-Peugeot-307-UK.pdf',
 'p307_sw_2005':'https://xr793.com/wp-content/uploads/2022/12/2005-Peugeot-307-SW-UK.pdf',
 'megane3_cc_2010':'https://www.topspeed.sk/PODKLADY/meganecccennik.pdf',
 'megane3_manual':'https://www.user-manual.renault.com/sites/renault/files/Megane_3_Ph1_-_837-6_DEU.pdf',
 'passat_b5_estate_2003':'https://xr793.com/wp-content/uploads/2022/12/2003-VW-Passat-Estate-UK.pdf',
 'passat_b5_saloon_2003':'https://xr793.com/wp-content/uploads/2022/12/2003-VW-Passat-UK.pdf',
 'golf_estate_2008':'https://xr793.com/wp-content/uploads/2022/12/2008-VW-Golf-Estate-UK.pdf',
 'golf_hatch_2008':'https://xr793.com/wp-content/uploads/2022/12/2008-VW-Golf-UK.pdf',
 'passat_b6_estate_2008':'https://xr793.com/wp-content/uploads/2022/12/2008-VW-Passat-Estate-UK.pdf',
 'passat_b6_saloon_2006':'https://xr793.com/wp-content/uploads/2022/12/2006-VW-Passat-Saloon-UK.pdf',
 'ducato_2016':'https://www.media.stellantis.com/uk-en/download-model-document/56',
 'fiat_professional_2016':'https://www.media.stellantis.com/uploads/uk/UK/2016/FIAT_Professional/Price_Lists/Fiat_Professional_Range_Price_List_DEC_2016.pdf',
}
def fetch(item):
 name,url=item
 try:
  pdf=CACHE/(name+'.pdf');txt=CACHE/(name+'.txt')
  if not pdf.exists():
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as r:data=r.read()
   if not data.startswith(b'%PDF'):raise ValueError('Not PDF')
   pdf.write_bytes(data)
  if not txt.exists():subprocess.run(['C:/Program Files/Git/mingw64/bin/pdftotext.exe','-enc','UTF-8','-layout',str(pdf),str(txt)],check=True,capture_output=True)
  return {'id':name,'url':url,'result':'ok','textCharacters':len(txt.read_text(encoding='utf8'))}
 except Exception as e:return {'id':name,'url':url,'result':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as ex:results=list(ex.map(fetch,SOURCES.items()))
(ROOT/'source-documents.json').write_text(json.dumps(SOURCES,indent=2)+'\n',encoding='utf8')
(ROOT/'source-access.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf8')
print(json.dumps(results))
