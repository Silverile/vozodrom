"""Build the site's statistics files from the register and STK aggregates.

Inputs: <data>/out/rsv-agg.json and istp-agg.json (rsv-stats.py, istp-stats.py) and the defect labels in
scripts/stats/stk-defects.json (Vyhláška 211/2018 Sb., příloha 1). Output: src/data/stats/<make>.json with
one summary for the make, each model line and each generation:

  fleet: n, avgAge, years [[year, n]], fuel {kind: share}, colors [[colour, share]], imported share, countries [[country, share]]
  stk:   inspections, failRate, unfitRate, byAge [[age, inspections, failRate]], defects [{code, label, share, severe}],
         km [[age, p25, p50, p75]], rollback {vehicles, share}

Privacy: only aggregates; any group or age row with fewer than MIN_N vehicles or inspections is left out.
Usage: py scripts/stats/build-stats.py <data dir>
"""
import json, os, sys
from collections import Counter, defaultdict
from datetime import date

MIN_N = 30
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
data = sys.argv[1]
rsv = json.load(open(os.path.join(data, "out", "rsv-agg.json"), encoding="utf8"))
istp = json.load(open(os.path.join(data, "out", "istp-agg.json"), encoding="utf8"))
labels_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stk-defects.json")
labels = json.load(open(labels_path, encoding="utf8"))["codes"] if os.path.exists(labels_path) else {}
THIS_YEAR = date.today().year


def label(code):
    parts = code.split(".")
    for i in range(len(parts), 0, -1):
        hit = labels.get(".".join(parts[:i]))
        if hit:
            return hit["label"] if isinstance(hit, dict) else hit
    return None


def add_fleet(t, a):
    t["n"] += a["n"]
    t["imported"] += a["imported"]
    t["importBase"] += a.get("importBase", 0)
    for f in ("years", "fuel", "colors", "countries"):
        for k, v in a[f].items():
            t[f][k] += v


def add_stk(t, a):
    for age, row in a["ages"].items():
        r = t["ages"][int(age)]
        for i in range(3):
            r[i] += row[i]
    for code, row in a["defects"].items():
        r = t["defects"][code]
        for i in range(4):
            r[i] += row[i]
    t["with"] += a["with"]
    for age, bins in a["km"].items():
        for b, n in bins.items():
            t["km"][int(age)][int(b)] += n
    if "rollback" in a:
        t["rollback"][0] += a["rollback"][0]
        t["rollback"][1] += a["rollback"][1]


new_fleet = lambda: {"n": 0, "imported": 0, "importBase": 0, "years": Counter(), "fuel": Counter(), "colors": Counter(), "countries": Counter()}
new_stk = lambda: {"ages": defaultdict(lambda: [0, 0, 0]), "defects": defaultdict(lambda: [0, 0, 0, 0]), "with": 0, "km": defaultdict(Counter), "rollback": [0, 0]}


def levels(key):
    """make|line|gen contributes to the make, the line and the generation."""
    make, line, gen = key.split("|")
    out = [(make, "_", "_")]
    if line:
        out.append((make, line, "_"))
        if gen != "":
            out.append((make, line, gen))
    return out


fleets = defaultdict(new_fleet)
stks = defaultdict(new_stk)
for key, a in rsv["keys"].items():
    for lv in levels(key):
        add_fleet(fleets[lv], a)
for key, a in istp["keys"].items():
    for lv in levels(key):
        add_stk(stks[lv], a)


def share(c, total, top=None):
    items = c.most_common(top) if top else c.most_common()
    return [[k, round(v / total, 4)] for k, v in items if v / total >= 0.005]


def fleet_out(f):
    if f["n"] < MIN_N:
        return None
    years = sorted((y, n) for y, n in f["years"].items() if 1950 <= int(y) <= THIS_YEAR)
    aged = sum(n for _, n in years)
    return {
        "n": f["n"],
        "avgAge": round(sum((THIS_YEAR - int(y)) * n for y, n in years) / aged, 1) if aged else None,
        "years": [[int(y), n] for y, n in years if n >= 5],
        "fuel": dict(share(f["fuel"], f["n"])),
        "colors": share(f["colors"], max(1, sum(f["colors"].values())), 8),
        # only when cars built from 1995 are a real part of the group (not a few re-registered classics)
        "imported": round(f["imported"] / f["importBase"], 4) if f["importBase"] >= max(MIN_N, 0.3 * f["n"]) else None,
        "countries": share(f["countries"], max(1, sum(f["countries"].values())), 6) if f["importBase"] >= max(MIN_N, 0.3 * f["n"]) else [],
    }


def pct(bins, q):
    total = sum(bins.values())
    run = 0
    for b in sorted(bins):
        run += bins[b]
        if run >= q * total:
            return (b * 10_000) + 5_000
    return None


def stk_out(s):
    total = sum(r[0] for r in s["ages"].values())
    if total < MIN_N:
        return None
    fail = sum(r[1] for r in s["ages"].values())
    unfit = sum(r[2] for r in s["ages"].values())
    by_age = [[age, r[0], round(r[1] / r[0], 4)] for age, r in sorted(s["ages"].items()) if age >= 0 and r[0] >= MIN_N]
    defects = sorted(s["defects"].items(), key=lambda x: -x[1][0])[:10]
    km = []
    for age in sorted(s["km"]):
        bins = s["km"][age]
        if age >= 1 and sum(bins.values()) >= MIN_N:
            km.append([age, pct(bins, 0.25), pct(bins, 0.5), pct(bins, 0.75)])
    out = {
        "inspections": total,
        "failRate": round(fail / total, 4),
        "unfitRate": round(unfit / total, 4),
        "withDefects": round(s["with"] / total, 4),
        "byAge": by_age,
        "defects": [{"code": c, "label": label(c), "share": round(r[0] / total, 4), "severe": round((r[2] + r[3]) / max(1, r[0]), 4)} for c, r in defects if r[0] >= MIN_N],
        "km": km,
    }
    if s["rollback"][0] >= 100:
        out["rollback"] = {"vehicles": s["rollback"][0], "share": round(s["rollback"][1] / s["rollback"][0], 4)}
    return out


files = defaultdict(dict)
for lv in set(fleets) | set(stks):
    make, line, gen = lv
    entry = {k: v for k, v in (("fleet", fleet_out(fleets[lv]) if lv in fleets else None), ("stk", stk_out(stks[lv]) if lv in stks else None)) if v}
    if not entry:
        continue
    node = files[make].setdefault(line, {"gens": {}}) if line != "_" else files[make].setdefault("_", {})
    if line == "_":
        node.update(entry)
    elif gen == "_":
        node.update(entry)
    else:
        node["gens"][gen] = entry

out_dir = os.path.join(ROOT, "src", "data", "stats")
os.makedirs(out_dir, exist_ok=True)
meta = {"stk": istp["meta"], "register": rsv["meta"], "minN": MIN_N}
for make, d in files.items():
    json.dump({"meta": meta, **d}, open(os.path.join(out_dir, f"{make}.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
index = {make: {"n": d.get("_", {}).get("fleet", {}).get("n"), "lines": [k for k in d if k != "_"]} for make, d in files.items()}
json.dump({"meta": meta, "makes": index}, open(os.path.join(out_dir, "index.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(files)} makes; labels for {len(labels)} defect codes")
