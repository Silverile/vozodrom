"""Regression checks use synthetic defect tuples and one raw day; no vehicle identifiers printed."""
import gzip
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import types
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(root / 'scripts' / 'stats'))
path = root / 'scripts' / 'stats' / 'istp-stats.py'
spec = importlib.util.spec_from_file_location('corrected_istp', path)
new = importlib.util.module_from_spec(spec)
spec.loader.exec_module(new)
dedup = new.unique_defects
assert dedup([('1.2.3.4', 'A'), ('1.2.3.5', 'C'), ('1.2.3', 'B'), ('1.2.3', 'C')]) == {'1.2.3': 'C'}
assert dedup([('1.2.3', 'C'), ('1.2.3', 'A')]) == {'1.2.3': 'C'}
assert dedup([('1.2.3', ''), ('1.2.3', 'A')]) == {'1.2.3': 'A'}
assert dedup([('1.2.3', 'Z'), ('1.2.3', 'B')]) == {'1.2.3': 'B'}
assert dedup([('', 'C'), ('1.2.3', 'A'), ('4.5.6', 'B')]) == {'1.2.3': 'A', '4.5.6': 'B'}

baseline = 'f49ffd9edb6fa1a4df2feeb385f6e26bb2dd6589'
old_source = subprocess.check_output(['git', 'show', f'{baseline}:scripts/stats/istp-stats.py'], cwd=root).decode('utf8')
assert 'seen = set()' in old_source, 'Baseline already changed; select the prior revision explicitly'
old = types.ModuleType('baseline_istp')
old.__file__ = str(path)
exec(compile(old_source, str(path), 'exec'), old.__dict__)
new.init()
old.init()
raw = root.parent / 'vozodrom-data' / 'istp' / 'days'
day = sorted(raw.glob('*.xml.gz'))[0]
before, before_readings, before_unmatched = old.parse_day(day)
after, after_readings, after_unmatched = new.parse_day(day)
assert before_readings == after_readings
assert before_unmatched == after_unmatched
assert before.keys() == after.keys()
changed = 0
for key in before:
    for field in ('ages', 'km', 'with'):
        assert before[key][field] == after[key][field], (field, key)
    n = sum(row[0] for row in after[key]['ages'].values())
    for code, row in after[key]['defects'].items():
        assert row[0] <= before[key]['defects'][code][0]
        assert 0 <= sum(row[1:]) <= row[0] <= n
        changed += row != before[key]['defects'][code]

# Inspect XML tag names only. No VINs, registration numbers or station values are emitted.
tags = set()
with gzip.open(day) as stream:
    for _, element in ET.iterparse(stream, events=('end',)):
        tags.update(new.local(node.tag) for node in element.iter())
        if new.local(element.tag) == 'Prohlidka':
            break
station_tags = sorted(t for t in tags if any(term in t.lower() for term in ('stanic', 'stk', 'sme', 'provozov')))

from match import Matcher
matcher = Matcher()
assert matcher.generation('hyundai', 'tucson', 2026) == 1, 'Announcement must not capture NX4 registrations'
assert matcher.generation('kia', 'ceed', 2017) == 1
assert matcher.generation('volkswagen', 'caddy', 2018) == 3
assert matcher.generation('volkswagen', 'caddy', 2024) == 4
assert matcher.generation('bmw', 'rada-5', 2024) == 7

print(json.dumps({'result': 'PASS', 'syntheticSeverityCases': 5, 'rawDay': day.name,
 'canonicalGroupsCompared': len(after), 'changedDefectRows': changed,
 'otherMetricsAndInMemoryReadings': 'identical', 'stationFieldNames': station_tags}, ensure_ascii=True))
