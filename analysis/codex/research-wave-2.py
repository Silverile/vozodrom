"""Two-stage wave-2 research: supplied Wikipedia tables, then linked language/generation pages."""
import argparse,concurrent.futures,importlib.util,json,os,re,subprocess,sys,urllib.parse
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('r','analysis/codex/second-source-engines.py');r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
r.INDEX=r.t.load('src/data/model-cards-index.json');MAKES={m['slug']:m['name'] for m in r.t.load('src/data/makes-index.json')}
def provided(item):
    c=r.INDEX[item['make']][item['line']]
    return list(dict.fromkeys(u for u in item['sources']+c.get('sources',[]) if re.match(r'https://(?:en|de|cs)\.wikipedia\.org/(?:wiki/|w/index\.php)',u)))[:5]
def live_leads(item,first):
    c=r.INDEX[item['make']][item['line']];out=r.urls(item,c)
    # Existing title= leads can be recovered without trusting a wrong oldid.
    for u in provided(item):
        title=urllib.parse.parse_qs(urllib.parse.urlsplit(u).query).get('title',[None])[0]
        if title:out.append(urllib.parse.urljoin(u,'/wiki/'+title.replace(' ','_')))
    title=MAKES[item['make']]+' '+c['name']
    out+=['https://en.wikipedia.org/wiki/'+title.replace(' ','_'),'https://de.wikipedia.org/wiki/'+title.replace(' ','_')]
    # Interlanguage links from a verified owner article, not arbitrary cross-links.
    for u in list(dict.fromkeys([*provided(item),*out]))[:8]:
        tree,canonical,error=r.t.fetch(u)
        if tree is None or not r.owns_article(tree,c,item['make'],item['generationIndex']):continue
        for a in tree.xpath('//a[@href]'):
            href=a.get('href','');lang=a.get('hreflang','')
            if lang in ('de','en','cs') and re.match(r'https://(?:de|en|cs)\.wikipedia\.org/wiki/',href):out.append(href)
        # Existing family pages often link directly to chassis/generation articles.
        for a in tree.xpath('//a[@href]'):
            child=urllib.parse.urljoin(canonical,a.get('href','')).split('#')[0]
            if urllib.parse.urlsplit(child).netloc!=urllib.parse.urlsplit(canonical).netloc or '/wiki/' not in child or ':' in urllib.parse.unquote(urllib.parse.urlsplit(child).path[6:]):continue
            childtitle=urllib.parse.unquote(urllib.parse.urlsplit(child).path[6:]).replace('_',' ')
            if r.t.choose_gen(c,childtitle,[],child)!=item['generationIndex']:continue
            model=r.t.fold(c['name']);text=r.t.fold(childtitle)
            if len(model)>=3 and model in text:out.append(child)
        if len(out)>=18:break
    seen={a['url'] for a in first.get('attempts',[])}
    return [u for u in dict.fromkeys(out) if u not in seen][:16]
def run(item):
    first=r.research(item,provided(item),'table')
    if first['engines'] or not item.get('from'):return first
    second=r.research(item,live_leads(item,first),'second-source')
    second['attempts']=first['attempts']+second['attempts'];return second
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--batch',type=int,required=True);ap.add_argument('--size',type=int,default=150);ap.add_argument('--queue',default='analysis/codex/second-source-engines/wave-2-queue.json');args=ap.parse_args()
    items=r.t.load(args.queue)['generations'][:args.size];revision=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip();results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for x in pool.map(run,items):
            results.append(x);print(json.dumps({'id':x['make']+'/'+x['line'],'index':x['generationIndex'],'rows':len(x['engines']),'attempts':len(x['attempts'])}),flush=True)
            r.t.write(r.OUT+f'/staged/candidates-{args.batch}.json',{'baselineRevision':revision,'wave':2,'queueSource':args.queue,'generations':results,'complete':False})
    r.t.write(r.OUT+f'/staged/candidates-{args.batch}.json',{'baselineRevision':revision,'wave':2,'queueSource':args.queue,'generations':results,'complete':True})
