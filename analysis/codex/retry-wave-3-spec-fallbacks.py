"""Retry deferred specification fallbacks sequentially after a crawl cooldown.

Updates staged research only; preserves every successful observation. Stop on a
second rate limit after bounded backoff, leaving unqueried rows explicitly deferred.
"""
import importlib.util, pathlib, sys, time

root = pathlib.Path(next(a[7:] for a in sys.argv if a.startswith('--root=')))
spec = importlib.util.spec_from_file_location('r', 'analysis/codex/second-source-engines.py')
r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
spec = importlib.util.spec_from_file_location('ss', 'analysis/codex/spec-site-engines.py')
ss = importlib.util.module_from_spec(spec); spec.loader.exec_module(ss); ss.r = r
t = r.t; r.INDEX = t.load('src/data/model-cards-index.json')
data = t.load(root / 'research.json')
assert data['complete'] and not data['rateLimited']
pending = [(row, g) for row in data['lines'] for g in row['generations']
           if not g['engines'] and g.get('specFallbackStatus') in ('rate-limited', 'not-queried-after-rate-limit')]
report = {'queued': len(pending), 'attempted': 0, 'filled': 0, 'engines': 0, 'rateLimited': False,
          'initialCooldownSeconds': 30, 'retryDelaysSeconds': [15, 30]}
if pending: time.sleep(30)
for row, candidate in pending:
    make, line = row['id'].split('/'); i = candidate['index']
    g = r.INDEX[make][line]['generations'][i]
    if candidate['changes'].get('dates'): g['from'], g['to'] = candidate['changes']['dates']
    if candidate['changes'].get('bodyTypes'): g['bodyTypes'] = candidate['changes']['bodyTypes']
    assert g.get('from') and not g.get('engines')
    result = ss.research({'make': make, 'line': line, 'generationIndex': i, 'from': g['from'],
                          'to': g.get('to'), 'engines': [], 'attempts': []},
                         max_models=1, max_generation_pages=2, max_details=1, retry_429_delays=(15, 30))
    candidate.setdefault('priorSpecAttempts', []).extend(candidate.get('specAttempts', []))
    candidate['specAttempts'] = result['attempts']; candidate['specFallbackStatus'] = result.get('specFallbackStatus')
    candidate['specReason'] = result.get('reason'); candidate['engines'] = result['engines']
    report['attempted'] += 1; report['filled'] += bool(result['engines']); report['engines'] += len(result['engines'])
    report['rateLimited'] = ss.RATE_LIMITED
    t.write(root / 'research.json', data); t.write(root / 'spec-retries.json', report)
    print(row['id'], i, candidate['specFallbackStatus'], len(result['engines']), flush=True)
    if ss.RATE_LIMITED: break
t.write(root / 'spec-retries.json', report)
print(report, flush=True)
