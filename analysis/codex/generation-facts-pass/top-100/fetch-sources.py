import concurrent.futures
import json
import pathlib
import subprocess
import urllib.request

root = pathlib.Path(__file__).resolve().parent
temporary = root / 'final-rebuild' / 'source-copies'
temporary.mkdir(parents=True, exist_ok=True)
documents = json.loads((root / 'source-documents.json').read_text(encoding='utf8'))

def fetch(pair):
    name, url = pair
    path = temporary / (name + '.pdf')
    try:
        if path.exists() and path.with_suffix('.txt').exists():
            return {'name': name, 'source': url, 'result': 'Downloaded and extracted (cached this turn)', 'bytes': path.stat().st_size, 'textBytes': path.with_suffix('.txt').stat().st_size}
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        content = urllib.request.urlopen(request, timeout=30).read()
        if not content.startswith(b'%PDF'):
            return {'name': name, 'source': url, 'result': 'Not a PDF response'}
        path.write_bytes(content)
        subprocess.run(['C:/Program Files/Git/mingw64/bin/pdftotext.exe', '-enc', 'UTF-8', '-layout', str(path), str(path.with_suffix('.txt'))], check=True)
        return {'name': name, 'source': url, 'result': 'Downloaded and extracted', 'bytes': len(content), 'textBytes': path.with_suffix('.txt').stat().st_size}
    except Exception as error:
        return {'name': name, 'source': url, 'result': str(error)}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(fetch, documents.items()))
(root / 'source-access.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
for result in results:
    print(result['name'], result['result'], result.get('textBytes', ''))
