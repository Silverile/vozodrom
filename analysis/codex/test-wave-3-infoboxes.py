"""No-network regression for separate production periods in adjacent HTML elements."""
import ast,importlib.util,pathlib,re
s=importlib.util.spec_from_file_location('t','analysis/codex/engine-throughput.py');t=importlib.util.module_from_spec(s);s.loader.exec_module(t)
source=ast.parse(pathlib.Path('analysis/codex/research-wave-3.py').read_text(encoding='utf8'))
functions=ast.Module(body=[n for n in source.body if isinstance(n,ast.FunctionDef) and n.name in ('spans','observations','bodies')],type_ignores=[])
ns={'re':re,'t':t};exec(compile(functions,'research-wave-3-functions','exec'),ns)
html='<h2>Second generation (B110; 1970)</h2><table><tr><th>Production</th><td><div>1970–1973</div><div>1971–1989 (Sunny Truck)</div></td></tr></table>'
boxes=ns['observations'](t.lxml.html.fromstring(html));text=boxes[0]['fields']['Production'];assert '19731971' not in text;assert ns['spans'](text) is None
html='<table><tr><th>Production</th><td><div>1993–2007</div><div>2011–2013</div></td></tr></table>'
text=ns['observations'](t.lxml.html.fromstring(html))[0]['fields']['Production'];assert ns['spans'](text) is None
assert ns['spans']('1970–1973')==[1970,1973];assert ns['spans']('2024–present')==[2024,None]
assert ns['spans']('2020 prototype') is None
assert ns['spans']('2020')==[2020,None]  # a lone year does not prove production ended
print('PASS: adjacent production periods remain separate; pickup extensions and interrupted production cannot silently form one automatic range')

assert ns['bodies']('5-door coupe SUV')==['suv']
assert ns['bodies']('2-door coupe')==['kupe']
assert ns['bodies']('Cargo Van Crew Van Pickup Cab Chassis Minibus')==['pickup','dodavka']
assert ns['bodies']('5-door liftback')==['liftback']
print('PASS: coupe SUV is one SUV body; a standalone coupe remains a coupe')
