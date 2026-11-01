import json,urllib.request,io
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
root=Path('analysis/codex/single-generation-pass/batch-7')
cards=json.loads(Path('src/data/catalog/model-cards/kia.json').read_text(encoding='utf-8-sig'))
sheet=Image.new('RGB',(1400,570),'#222222');draw=ImageDraw.Draw(sheet)
for i,slug in enumerate(['ray','mohave']):
 photo=next(c for c in cards if c['lineSlug']==slug)['generations'][0]['photo']
 req=urllib.request.Request(photo['url'],headers={'User-Agent':'Vozodrom catalogue asset review/1.0'})
 with urllib.request.urlopen(req,timeout=25) as r:data=r.read()
 im=ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB');im.thumbnail((690,520))
 sheet.paste(im,(i*700+(700-im.width)//2,40));draw.text((i*700+12,12),slug,fill='white')
sheet.save(root/'photo-review.png')
