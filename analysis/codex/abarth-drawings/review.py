"""Abarth batch review: original photo beside the unchanged generated drawing.
Run with Python, then open http://127.0.0.1:8768/ . Serves only batch assets.
"""
import json
import mimetypes
import re
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
PHOTOS = REPO.parent / 'vozodrom-data/front-photos/abarth'

def read(path, default):
    try:
        return json.loads(path.read_text(encoding='utf-8-sig'))
    except (OSError, ValueError):
        return default

def records():
    catalogue = read(REPO / 'src/data/model-cards-index.json', {})['abarth']
    metadata = {}
    for file in sorted(HERE.glob('*-photos.json')) + sorted(HERE.glob('*-results.json')):
        data = read(file, [])
        if isinstance(data, dict):
            data = data.get('items', data.get('results', []))
        for row in data:
            if isinstance(row, dict) and row.get('id'):
                metadata.setdefault(row['id'], {}).update(row)
    qa = read(HERE / 'qa.json', {})
    result = []
    for slug, card in catalogue.items():
        for i, gen in enumerate(card['generations']):
            gid = f'abarth--{slug}--{i}'
            folders = sorted(PHOTOS.glob(gid + ' *'))
            folder = folders[0] if folders else PHOTOS / gid
            refs = list(folder.glob('reference.*'))
            photo = refs[0] if refs else None
            drawing = HERE / 'raw' / (gid + '.png')
            meta = metadata.get(gid, {})
            check = qa.get(gid, {})
            if meta.get('photo'):
                used_photo = Path(meta['photo'])
                if used_photo.is_file() and used_photo.resolve().is_relative_to(PHOTOS.resolve()):
                    photo = used_photo
            source = meta.get('source') or meta.get('page', '')
            source_url = re.search(r'https?://[^\s]+', source) if isinstance(source, str) else None
            result.append(dict(id=gid, name=card['name'], generation=gen['name'],
                years=f"{gen.get('from') or '?'}–{gen.get('to') or ('н. в.' if gen.get('current') else '?')}",
                photo=str(photo) if photo and photo.exists() else None,
                drawing=str(drawing) if drawing.exists() else None,
                source=source_url.group(0) if source_url else '', selectedVersion=check.get('selectedVersion', meta.get('selectedVersion', '')),
                status=check.get('status', 'pending'),
                issues=check.get('issues', meta.get('issues', []))))
    return result

HTML = r'''<!doctype html><html lang="ru"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Abarth — проверка чертежей</title>
<style>
:root{color-scheme:dark;font:15px/1.5 system-ui;background:#0e141c;color:#e5edf6}*{box-sizing:border-box}
body{margin:0}header{position:sticky;top:0;z-index:2;background:#0e141cf2;border-bottom:1px solid #304153;padding:18px 4vw}
h1{font-size:24px;margin:0 0 5px}p{margin:5px 0;color:#a5b4c6}.controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px}
button,select,input{font:inherit;border:1px solid #41546b;border-radius:7px;background:#202e40;color:inherit;padding:8px 12px}
button{cursor:pointer}button:hover{background:#344b65}input{flex:1;min-width:180px}main{max-width:1600px;margin:auto;padding:20px}
article{background:#16212e;border:1px solid #304153;border-radius:12px;padding:18px;margin-bottom:24px}h2{margin:0;font-size:20px}.sub{color:#a6bdd5;font-size:13px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:15px 0}.pic{display:flex;align-items:center;justify-content:center;height:360px;background:#13233f;border-radius:8px;overflow:hidden}
.pic img{width:100%;height:100%;object-fit:contain;cursor:zoom-in}.caption{font-size:12px;color:#9ab2cc;margin-bottom:6px}.badge{border-radius:5px;padding:3px 8px;background:#2d4057;font-size:13px}
.pass{background:#185b47}.review{background:#775329}.blocked{background:#762f36}.notes{color:#f0ca91;white-space:pre-wrap}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ok{background:#185b47}.redo{background:#762f36}a{color:#9ac9ff}.empty{color:#9ab2cc}dialog{width:95vw;max-width:1500px;background:#0e141c;border:1px solid #41546b;border-radius:12px;padding:15px}dialog img{width:100%;max-height:84vh;object-fit:contain}dialog::backdrop{background:#000c}
@media(max-width:700px){.pair{grid-template-columns:1fr}.pic{height:270px}header{position:relative}main{padding:10px}}
</style><header><h1>Abarth · фотографии и чертежи</h1>
<p id="summary"></p><p>Оригинальное фото слева, сгенерированный чертёж справа. Нажмите изображение, чтобы увеличить.</p>
<p>Показаны исходники до подготовки к сайту: масштаб обычно крупнее заданного, фон слегка неоднороден. Конкретные замечания указаны у каждой модели.</p>
<div class="controls"><input id="search" placeholder="Модель или поколение"><select id="filter"><option value="all">Все</option><option value="review">Есть замечания</option><option value="unseen">Без вашей оценки</option><option value="redo">Переделать</option><option value="ok">Одобрено вами</option></select><button id="export">Скачать мои оценки</button></div></header>
<main></main><dialog><button onclick="this.closest('dialog').close()">Закрыть</button><img></dialog>
<script>
const rows=__DATA__;let votes={};try{votes=JSON.parse(localStorage.getItem('vozodrom.abarth.review.v1')||'{}')}catch{}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status={pass:'Визуальная проверка пройдена',review:'Есть замечания',blocked:'Не готово',pending:'Проверяется'};
function save(){try{localStorage.setItem('vozodrom.abarth.review.v1',JSON.stringify(votes))}catch{}}
function render(){const q=document.querySelector('#search').value.toLowerCase(),f=document.querySelector('#filter').value;
document.querySelector('#summary').textContent=`18 моделей · ${rows.length} поколений/версий · ${rows.filter(x=>x.photo).length} фото · ${rows.filter(x=>x.drawing).length} чертежей. Оценки сохраняются в этом браузере.`;
document.querySelector('main').innerHTML=rows.filter(r=>JSON.stringify([r.name,r.generation,r.id]).toLowerCase().includes(q)).filter(r=>f==='all'||(f==='review'&&['review','blocked'].includes(r.status))||(f==='unseen'&&!votes[r.id]?.verdict)||votes[r.id]?.verdict===f).map(r=>`<article data-id="${esc(r.id)}"><h2>Abarth ${esc(r.name)} <span class="badge ${r.status}">${esc(status[r.status])}</span></h2><div class="sub">${esc(r.generation)} · ${esc(r.years)} · ${esc(r.id)}</div><div class="pair">${['photo','drawing'].map((t,i)=>`<div><div class="caption">${i?'Чертёж · ImageGen':'Фотография · референс'}</div><div class="pic">${r[t]?`<img loading="lazy" src="/asset/${r.id}/${t}" alt="${esc(r.name)} — ${i?'чертёж':'фото'}">`:'<span class="empty">Пока нет</span>'}</div></div>`).join('')}</div>${r.selectedVersion?`<p>${esc(r.selectedVersion)}</p>`:''}${r.source?`<p><a href="${esc(r.source)}" target="_blank" rel="noopener">Источник фотографии</a></p>`:''}<p class="notes">${esc(Array.isArray(r.issues)?r.issues.join('\n'):r.issues)}</p><div class="actions"><button class="ok" data-v="ok">OK</button><button class="redo" data-v="redo">Переделать</button><span>${esc(votes[r.id]?.verdict==='ok'?'Ваша оценка: OK':votes[r.id]?.verdict==='redo'?'Ваша оценка: переделать':'Без вашей оценки')}</span><input data-note placeholder="Ваш комментарий" value="${esc(votes[r.id]?.note||'')}"></div></article>`).join('');}
document.querySelector('main').addEventListener('click',e=>{if(e.target.tagName==='IMG'){const d=document.querySelector('dialog');d.querySelector('img').src=e.target.src;d.showModal()}if(e.target.dataset.v){let id=e.target.closest('article').dataset.id;votes[id]={...votes[id],verdict:e.target.dataset.v,at:new Date().toISOString()};save();render()}});
document.querySelector('main').addEventListener('change',e=>{if(e.target.hasAttribute('data-note')){let id=e.target.closest('article').dataset.id;votes[id]={...votes[id],note:e.target.value};save()}});
document.querySelector('#search').oninput=render;document.querySelector('#filter').onchange=render;
document.querySelector('#export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(votes,null,2)],{type:'application/json'}));a.download='abarth-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};render();
</script></html>'''

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        route = urlparse(self.path).path
        rows = records()
        if route == '/':
            body = HTML.replace('__DATA__', json.dumps(rows, ensure_ascii=False).replace('</', '<\\/')).encode('utf-8')
            content_type = 'text/html; charset=utf-8'
        elif route.startswith('/asset/'):
            parts = route.strip('/').split('/')
            row = next((r for r in rows if len(parts)==3 and r['id']==parts[1]), None)
            path = Path(row[parts[2]]) if row and parts[2] in ('photo','drawing') and row[parts[2]] else None
            if not path or not path.is_file():
                self.send_error(404); return
            body = path.read_bytes()
            content_type = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        else:
            self.send_error(404); return
        self.send_response(200)
        self.send_header('Content-Type',content_type)
        self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store')
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    print('Abarth review: http://127.0.0.1:8768/', flush=True)
    ThreadingHTTPServer(('127.0.0.1',8768),Handler).serve_forever()
