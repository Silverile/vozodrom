import http.cookiejar,pathlib,urllib.request,urllib.parse,subprocess,json
from lxml import html
ROOT=pathlib.Path('analysis/codex/generation-facts-pass/body-variants-2');CACHE=ROOT/'final-rebuild'/'source-copies'
urls={
 'megane2_2007':'https://www.auto-preisliste.de/download-preislisten-aller-marken/59-renault/2402-renault-megane-2002-2009/35723-2007-07-preisliste-renault-megane-megane-grandtour',
 'megane3_hatch_2008':'https://www.auto-preisliste.de/download-preislisten-aller-marken/59-renault/2402-renault-megane-2002-2009/35731-2008-11-preisliste-renault-megane-5-tuerer',
}
out=[]
for name,url in urls.items():
 try:
  pdf=CACHE/(name+'.pdf');txt=CACHE/(name+'.txt')
  if not pdf.exists():
   op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));op.addheaders=[('User-Agent','Mozilla/5.0')]
   tree=html.fromstring(op.open(url,timeout=20).read());form=tree.xpath('//form[@id="phocadownloadform"]')[0]
   data=urllib.parse.urlencode({i.get('name'):i.get('value','')for i in form.xpath('.//input[@name]')}).encode()
   content=op.open(urllib.request.Request(form.get('action'),data=data),timeout=25).read()
   if not content.startswith(b'%PDF'):raise ValueError('Download did not return PDF')
   pdf.write_bytes(content)
  if not txt.exists():subprocess.run(['C:/Program Files/Git/mingw64/bin/pdftotext.exe','-enc','UTF-8','-layout',str(pdf),str(txt)],check=True)
  out.append({'id':name,'url':url,'result':'ok'})
 except Exception as e:out.append({'id':name,'url':url,'result':str(e)})
(ROOT/'renault-price-source-access.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf8');print(json.dumps(out))
