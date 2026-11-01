"""Read-only PDF rendering. Cache the single PDFium DLL in this batch's ignored folder."""
import ctypes as c, hashlib, io, json, pathlib, sys, urllib.request, zipfile
from PIL import Image
ROOT=pathlib.Path('analysis/codex/generation-facts-pass/body-variants-3')
CACHE=ROOT/'final-rebuild'
CACHE.mkdir(exist_ok=True)
dll=pathlib.Path('analysis/codex/generation-facts-pass/body-variants-1/final-rebuild/pdfium.dll')
if not dll.exists():
 with urllib.request.urlopen('https://pypi.org/pypi/pypdfium2/json',timeout=30) as r: package=json.load(r)
 wheel=next(w for w in package['urls'] if w['filename'].endswith('win_amd64.whl'))
 with urllib.request.urlopen(wheel['url'],timeout=60) as r: data=r.read()
 assert hashlib.sha256(data).hexdigest()==wheel['digests']['sha256']
 with zipfile.ZipFile(io.BytesIO(data)) as z:
  name=next(n for n in z.namelist() if n.endswith('/pdfium.dll'))
  dll.write_bytes(z.read(name))
 (ROOT/'renderer.json').write_text(json.dumps({'package':'pypdfium2','version':package['info']['version'],'wheel':wheel['url'],'sha256':wheel['digests']['sha256'],'dllSha256':hashlib.sha256(dll.read_bytes()).hexdigest()},indent=2)+'\n')
lib=c.CDLL(str(dll.resolve()))
def api(name,restype,*args):
 f=getattr(lib,name);f.restype=restype;f.argtypes=args;return f
api('FPDF_InitLibrary',None)()
load=api('FPDF_LoadDocument',c.c_void_p,c.c_char_p,c.c_char_p)
page=api('FPDF_LoadPage',c.c_void_p,c.c_void_p,c.c_int)
width=api('FPDF_GetPageWidthF',c.c_float,c.c_void_p)
height=api('FPDF_GetPageHeightF',c.c_float,c.c_void_p)
bitmap=api('FPDFBitmap_Create',c.c_void_p,c.c_int,c.c_int,c.c_int)
fill=api('FPDFBitmap_FillRect',None,c.c_void_p,c.c_int,c.c_int,c.c_int,c.c_int,c.c_ulong)
render=api('FPDF_RenderPageBitmap',None,c.c_void_p,c.c_void_p,c.c_int,c.c_int,c.c_int,c.c_int,c.c_int,c.c_int)
buffer=api('FPDFBitmap_GetBuffer',c.c_void_p,c.c_void_p)
stride=api('FPDFBitmap_GetStride',c.c_int,c.c_void_p)
doc=load(str(pathlib.Path(sys.argv[1]).resolve()).encode(),None)
assert doc,'PDF could not be loaded'
print('PDF pages:',api('FPDF_GetPageCount',c.c_int,c.c_void_p)(doc))
args=sys.argv[2:]
clip=None
if '--clip' in args:
 pos=args.index('--clip');clip=tuple(map(int,args[pos+1:pos+5]));args=args[:pos]
for number in map(int,args):
 p=page(doc,number-1);assert p
 w,h=round(width(p)*2),round(height(p)*2)
 b=bitmap(w,h,1);fill(b,0,0,w,h,0xffffffff)
 render(b,p,0,0,w,h,0,1)
 data=c.string_at(buffer(b),stride(b)*h)
 im=Image.frombytes('RGBA',(w,h),data,'raw','BGRA',stride(b))
 out=CACHE/(pathlib.Path(sys.argv[1]).stem+'-'+str(number)+'.png')
 if clip: im=im.crop(clip);out=out.with_stem(out.stem+'-detail')
 im.save(out);print(str(out))
 api('FPDFBitmap_Destroy',None,c.c_void_p)(b)
 api('FPDF_ClosePage',None,c.c_void_p)(p)
api('FPDF_CloseDocument',None,c.c_void_p)(doc)
