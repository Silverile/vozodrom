"""Additional explicit table layouts; no horsepower conversion or hybrid summing."""
import io,re,lxml.html
def install(e):
 oldparse=e.parse_table;oldattr=e.generation_attribution;oldfuel=e.fuel
 def fuel(text,context):
  out=oldfuel(text,context)
  if out:return out
  if re.search(r'\b\d[.,]\d\s*(?:D|TD)\b',text,re.I):return 'diesel'
  return None
 e.fuel=fuel
 def parse(table,context,source,number):
  table=lxml.html.fromstring(lxml.html.tostring(table,encoding='unicode'))
  for el in table.xpath('.//sup'):
   if e.clean(el.text_content())=='3' and re.search(r'cm\s*$',el.getparent().text or ''):el.drop_tag()
  for el in table.xpath('.//style|.//script|.//sup|.//table'):el.drop_tree()
  for cell in table.xpath('.//th'):
   text=e.clean(cell.text_content())
   if re.match(r'^kW\b',text,re.I):
    for child in list(cell):cell.remove(child)
    cell.text='Leistung '+text
  try:df=e.pd.read_html(io.StringIO(lxml.html.tostring(table,encoding='unicode')),flavor='lxml')[0].fillna('')
  except Exception:return []
  rows=[[e.clean(x) for x in row] for row in df.values.tolist()];cols=[' '.join(e.clean(c) for c in x) if isinstance(x,tuple) else e.clean(x) for x in df.columns]
  labels=[e.fold(r[0]) for r in rows]
  pi=next((i for i,v in enumerate(labels) if re.search(r'(?:SYSTEM)?LEISTUNG(?!SGEWICHT)',v)),None)
  if pi is None:
   # Some mixed Civic tables consume the first "Benziner" category as a
   # pandas header tier. Later spanning Diesel rows still change category.
   if any('BENZINER' in e.fold(c) for c in cols):context+=' / Benziner'
   return oldparse(table,context,source,number)
  vi=next((i for i,v in enumerate(labels) if v in ['MODELL','MOTORISIERUNG','MOTORENBEZEICHNUNG','MOTORBEZEICHNUNG','MOTORVARIANTE','MOTOR','TYP']),None)
  ci=next((i for i,v in enumerate(labels) if 'HUBRAUM' in v),None)
  fi=[i for i,v in enumerate(labels) if v in ['MOTOR','MOTORTYP','MOTORENTYP','MOTORART','MOTORBAUART','KRAFTSTOFF','KRAFTSTOFFSORTE','ANTRIEBSART','BAUART']]
  yi=next((i for i,v in enumerate(labels) if 'BAUZEIT' in v or 'PRODUKTION' in v),None)
  code=next((i for i,v in enumerate(labels) if v in ['MOTORKENNZEICHNUNG','MOTORKENNBUCHSTABE','MOTORKENNBUCHSTABEN','MOTORCODE']),None)
  result=[]
  for j in range(1,len(cols)):
   variant=rows[vi][j] if vi is not None else cols[j]
   if variant.startswith('Unnamed') or variant in ['Motor','Motor.1','Motor.2'] or not variant:continue
   # Keep the marketed variant readable; the source engine code remains separate evidence.
   out=e.engine(variant,rows[pi][j],rows[ci][j] if ci is not None else '', ' '.join(rows[i][j] for i in fi),context,source,number,rows[pi][0],rows[ci][0] if ci is not None else '',rows[yi][j] if yi is not None else '')
   if out:
    if code is not None:out['sourceScope']['engineCode']=rows[code][j]
    result.append(out)
  return result
 e.parse_table=parse
 oldchoose=e.choose_gen
 def choose(card,title,context,url):
  number=re.search(r'\b(\d{1,2})\.\s*Generation',title,re.I)
  romans=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI']
  if number and 1<=int(number[1])<=len(romans):
   hits=[i for i,g in enumerate(card['generations']) if romans[int(number[1])-1] in e.codes(g)]
   if len(hits)==1:return hits[0]
  return oldchoose(card,title,context,url)
 e.choose_gen=choose
 def attr(card,title,context,row,production):
  # Exact generation articles support letter codes (Corsa B), not arbitrary years.
  chosen=e.choose_gen(card,title,[],row['sources'][0])
  if chosen is not None:
   title_tokens=e.token(title);g=card['generations'][chosen];ct=e.codes(g)
   explicit=bool(ct&title_tokens)
   number=re.search(r'\b(\d{1,2})\.\s*Generation',title,re.I)
   romans=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI']
   if number and 1<=int(number[1])<=len(romans):explicit|=romans[int(number[1])-1] in ct
   if explicit:return chosen,{'method':'generation-article','anchor':title,'fromYear':g.get('from'),'toYear':g.get('to'),'generationIndex':chosen,'rowFromYear':None,'rowToYear':None}
  answer=oldattr(card,title,context,row,production)
  if answer is not None:return answer
  # German generation articles often use numeric rather than Roman ordinals.
  for anchor in [*context,title]:
   number=re.search(r'\b(\d{1,2})\.\s*Generation',anchor,re.I)
   if not number:continue
   romans=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI']
   if not 1<=int(number[1])<=len(romans):continue
   hits=[i for i,g in enumerate(card['generations']) if romans[int(number[1])-1] in e.codes(g)]
   if len(hits)==1:
    i=hits[0];g=card['generations'][i];return i,{'method':'generation-heading','anchor':anchor,'fromYear':g.get('from'),'toYear':g.get('to'),'generationIndex':i,'rowFromYear':None,'rowToYear':None}
  return None
 e.generation_attribution=attr
