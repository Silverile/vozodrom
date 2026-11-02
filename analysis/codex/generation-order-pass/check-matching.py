"""Check raw-register matching across the permutation, without reading personal records."""
import gzip, importlib.util, json, pathlib

root = pathlib.Path('analysis/codex/generation-order-pass')
base = json.loads(gzip.decompress((root/'baseline.json.gz').read_bytes()))['data']
changes = json.loads((root/'changes.json').read_text(encoding='utf8'))
spec = importlib.util.spec_from_file_location('catalogue_match', 'scripts/stats/match.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
load = module.load
module.load = lambda p: base[p] if p in base else load(p)
before = module.Matcher()
module.load = load
after = module.Matcher()
checks = 0
for row in changes['mappings']:
    make, line = row['make'], row['line']
    codes = ['', *[g['code'] for g in row['generations'] if g['code']]]
    for year in range(1900, 2028):
        for code in codes:
            old = before.generation(make, line, year, code)
            new = after.generation(make, line, year, code)
            expected = None if old is None else row['oldToNew'][str(old)]
            assert new == expected, (make, line, year, code, old, new, expected)
            checks += 1

# Date-basis handling already present in the matcher must survive the reordering.
assert after.generation('hyundai', 'tucson', 2026, '') == 3  # NX4; NX5 is announcement-only
assert after.generation('hyundai', 'sonata', 1986, '') == 0
assert after.generation('hyundai', 'sonata', 2000, '') == 3
assert after.generation('hyundai', 'nexo', 2026, 'NH2') == 1
assert after.generation('hyundai', 'terracan', 2005, 'HP') == 0
assert after.generation('hyundai', 'terracan', 2007, 'HP') is None
assert after.line('hyundai', 'TERRACAN 2.9 CRDI', 2007) == 'terracan'
assert after.line('hyundai', 'HYUNDAI TERRACAN', 2008) == 'terracan'
assert after.line('hyundai', 'TERRACAN', 1999) is None
result = {'result':'PASS', 'permutationChecks':checks, 'tucsonAnnouncementExcluded':True,
          'terracanProductionEnd':2006, 'scope':'No private vehicle records read by this test'}
(root/'matching-validation.json').write_text(json.dumps(result, indent=2)+'\n', encoding='utf8')
print(json.dumps(result))
