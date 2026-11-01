import pathlib,importlib.util,concurrent.futures,re,json,sys,hashlib
sys.stdout.reconfigure(encoding='utf-8')
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/popular-engines-pass')
titles={'a4-allroad':'Audi_A4_allroad_quattro','a6-allroad':'Audi_A6_allroad_quattro','rs-e-tron-gt':'Audi_e-tron_GT','rs-q8':'Audi_RS_Q8','rs7':'Audi_RS7','s-e-tron-gt':'Audi_e-tron_GT','s1':'Audi_S1','s3':'Audi_S3','s4':'Audi_S4','s5':'Audi_S5','s6':'Audi_S6','s6-e-tron':'Audi_A6_e-tron','s7':'Audi_S7','s8':'Audi_S8','sq2':'Audi_SQ2','sq5':'Audi_SQ5','sq6-e-tron':'Audi_Q6_e-tron','sq7':'Audi_SQ7','sq8':'Audi_SQ8','sq8-e-tron':'Audi_Q8_e-tron','tts':'Audi_TTS'}
items=[(l,lang,t) for l,t in titles.items() for lang in ['de','en']]
def run(item):
 line,lang,title=item;url='https://'+lang+'.wikipedia.org/wiki/'+title;t,c,err=e.fetch(url);boxes=[];prose=[];tables=[];head={}
 if t is not None:
  for el in t.xpath('//script|//style|//nav|//footer'):el.drop_tree()
  for el in t.iter():
   tag=el.tag if isinstance(el.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    level=int(tag[1]);head={k:v for k,v in head.items() if k<level};head[level]=e.clean(el.text_content())
   if tag=='table' and 'infobox' in el.get('class',''):
    facts={}
    for tr in el.xpath('.//tr'):
     cells=tr.xpath('./th|./td')
     if len(cells)>1:facts[e.clean(cells[0].text_content())]=e.clean(' '.join(c.text_content() for c in cells[1:]))
    boxes.append({'heading':' / '.join(head.values()),'facts':facts})
   elif tag=='table' and not el.xpath('ancestor::table') and re.search(r'\bkW\b',el.text_content()) and len(el.text_content())<50000:
    text=e.clean(el.text_content());tables.append({'heading':' / '.join(head.values()),'sourceTextSha256':hashlib.sha256(text.encode()).hexdigest(),'observedKwValues':re.findall(r'(\d+(?:[.,]\d+)?)\s*kW\b',text),'attribution':'Discovery only; individual facts are recorded in audi-curated-engines.json.'})
   elif tag=='p':
    text=e.clean(el.text_content())
    if re.search(r'\b(?:19|20)\d{2}\b',text) and re.search('produc|facelift|generation|generat|launched|introduc|gebaut|hergestellt|produziert|Bauzeit',text,re.I):prose.append({'heading':' / '.join(head.values()),'sourceTextSha256':hashlib.sha256(text.encode()).hexdigest(),'observedYears':re.findall(r'\b(?:19|20)\d{2}\b',text),'attribution':'Discovery only; not a production-period assertion. See the manually reviewed plan.'})
 print(line,lang,len(boxes),len(tables),err,flush=True)
 return {'line':line,'lang':lang,'url':url,'canonical':c,'error':err,'boxes':boxes,'prose':prose,'tables':tables}
rows=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(run,items));e.write(str(root/'audi-research.json'),rows)
