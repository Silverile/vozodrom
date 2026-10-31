"""Aggregate STK inspections (ISTP open data) per make, model line and generation.

Reads <data>/istp/days/*.xml.gz in date order and writes <data>/out/istp-agg.json with, per key
"make|line|gen" (line and gen may be empty), for regular inspections only:
  ages:     {age: [inspections, failed (result 2 or 3), unfit (result 3)]}, age = inspection year - first registration year
  defects:  {code (first three levels): [inspections, A, B, C]}, most severe level per code/inspection
  km:       {age: {bin: count}}, odometer in 10 000 km bins
  rollback: [VINs with at least two readings, VINs whose odometer dropped by more than 2 000 km]
VINs are used only in memory (hashed) to follow one vehicle across inspections; nothing per vehicle is written.

Usage: py scripts/stats/istp-stats.py <data dir> [max files] [--out-dir DIR] [--workers N]
"""
import argparse, gzip, hashlib, json, os, sys, time
import xml.etree.ElementTree as ET
from collections import defaultdict
from multiprocessing import Pool

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from match import Matcher

KM_BIN = 10_000
DROP = 2_000
matcher = None


def init():
    global matcher
    matcher = Matcher()


def local(tag):
    return tag.rsplit("}", 1)[-1]


def unique_defects(defects):
    """One three-level code per inspection; preserve the most severe valid A/B/C level."""
    seen = {}
    for kod, sev in defects:
        code = ".".join(kod.split(".")[:3])
        if not code:
            continue
        rank = {"A": 1, "B": 2, "C": 3}
        if code not in seen or rank.get(sev, 0) > rank.get(seen[code], 0):
            seen[code] = sev
    return seen


def parse_day(path):
    """One day's file -> (aggregates, [(key, vin hash, odometer)] in file order)."""
    agg = defaultdict(lambda: {"ages": defaultdict(lambda: [0, 0, 0]), "defects": defaultdict(lambda: [0, 0, 0, 0]), "with": 0, "km": defaultdict(lambda: defaultdict(int))})
    readings = []
    unmatched = defaultdict(int)
    with gzip.open(path) as f:
        for _, el in ET.iterparse(f, events=("end",)):
            if local(el.tag) != "Prohlidka":
                continue
            rec = {"defects": []}
            for node in el.iter():
                t = local(node.tag)
                if t in ("DatumProhlidky", "DruhProhlidky", "Vin", "Znacka", "ObchodniOznaceni", "DatumPrvniRegistrace", "Odometr", "VysledekCelkovy", "Kategorie") and t not in rec:
                    rec[t] = (node.text or "").strip()
                elif t == "Zavada":
                    kod = node.findtext("{*}Kod") or ""
                    sev = node.findtext("{*}Zavaznost") or ""
                    rec["defects"].append((kod.strip(), sev.strip()))
            el.clear()
            if rec.get("DruhProhlidky") != "Pravidelná":
                continue
            make = matcher.make(rec.get("Znacka", ""))
            if not make:
                continue
            reg = rec.get("DatumPrvniRegistrace", "")[:4]
            year = int(reg) if reg.isdigit() else None
            line = matcher.line(make, rec.get("ObchodniOznaceni", ""), year) or ""
            gen = matcher.generation(make, line, year, rec.get("ObchodniOznaceni", "")) if line else None
            if not line and rec.get("Kategorie", "") in ("M1", "N1"):
                unmatched[f"{make}|{rec.get('ObchodniOznaceni', '').strip()}"] += 1
            key = f"{make}|{line}|{'' if gen is None else gen}"
            a = agg[key]
            insp_year = int(rec.get("DatumProhlidky", "0000")[:4] or 0)
            age = max(0, min(30, insp_year - year)) if year else -1
            res = rec.get("VysledekCelkovy", "")
            row = a["ages"][age]
            row[0] += 1
            if res in ("2", "3"):
                row[1] += 1
            if res == "3":
                row[2] += 1
            # Result sections may repeat a code, including at different severity levels.
            seen = unique_defects(rec["defects"])
            for code, sev in seen.items():
                d = a["defects"][code]
                d[0] += 1
                if sev in ("A", "B", "C"):
                    d[1 + "ABC".find(sev)] += 1
            if seen:
                a["with"] += 1
            km = rec.get("Odometr", "")
            if km.isdigit() and age >= 0:
                k = int(km)
                if 0 < k < 2_000_000:
                    a["km"][age][k // KM_BIN] += 1
                    vin = rec.get("Vin", "")
                    if len(vin) >= 11:
                        readings.append((key, hashlib.blake2b(vin.encode(), digest_size=8).digest(), k))
    return json.loads(json.dumps(agg)), readings, dict(unmatched)


def merge(into, part):
    for key, a in part.items():
        t = into.setdefault(key, {"ages": {}, "defects": {}, "with": 0, "km": {}})
        for age, row in a["ages"].items():
            r = t["ages"].setdefault(age, [0, 0, 0])
            for i in range(3):
                r[i] += row[i]
        for code, row in a["defects"].items():
            r = t["defects"].setdefault(code, [0, 0, 0, 0])
            for i in range(4):
                r[i] += row[i]
        t["with"] += a["with"]
        for age, bins in a["km"].items():
            tb = t["km"].setdefault(age, {})
            for b, n in bins.items():
                tb[b] = tb.get(b, 0) + n


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("data")
    parser.add_argument("max_files", nargs="?", type=int)
    parser.add_argument("--out-dir")
    parser.add_argument("--workers", type=int, default=min(30, os.cpu_count() or 4))
    parser.add_argument("--skip-unmatched-output", action="store_true")
    args = parser.parse_args()
    data = args.data
    days = sorted(os.listdir(os.path.join(data, "istp", "days")))
    days = [os.path.join(data, "istp", "days", d) for d in days if d.endswith(".xml.gz")]
    if args.max_files is not None:
        days = days[:args.max_files]
    if not days:
        raise SystemExit("No inspection input files")
    total, last, start, unmatched = {}, {}, time.time(), defaultdict(int)  # last: vin hash -> [key, last km, readings, dropped]
    with Pool(args.workers, initializer=init) as pool:
        for i, (part, readings, um) in enumerate(pool.imap(parse_day, days, chunksize=1)):
            merge(total, part)
            for k, n in um.items():
                unmatched[k] += n
            for key, vin, km in readings:
                v = last.get(vin)
                if v is None:
                    last[vin] = [key, km, 1, 0]
                else:
                    if km < v[1] - DROP:
                        v[3] = 1
                    v[0], v[1], v[2] = key, max(v[1], km), v[2] + 1
            if (i + 1) % 50 == 0:
                print(f"{i + 1}/{len(days)} days, {len(last):,} vehicles, {time.time() - start:.0f} s", flush=True)
    roll = defaultdict(lambda: [0, 0])
    for key, _, n, dropped in last.values():
        if n >= 2:
            roll[key][0] += 1
            roll[key][1] += dropped
    for key, r in roll.items():
        total.setdefault(key, {"ages": {}, "defects": {}, "with": 0, "km": {}})["rollback"] = r
    output = args.out_dir or os.path.join(data, "out")
    os.makedirs(output, exist_ok=True)
    meta = {"from": os.path.basename(days[0])[:10], "to": os.path.basename(days[-1])[:10], "days": len(days)}
    json.dump({"meta": meta, "keys": total}, open(os.path.join(output, "istp-agg.json"), "w", encoding="utf8"))
    top = sorted(unmatched.items(), key=lambda x: -x[1])[:400]
    if not args.skip_unmatched_output:
        json.dump(top, open(os.path.join(output, "istp-unmatched.json"), "w", encoding="utf8"), ensure_ascii=False, indent=0)
    print(f"done: {len(days)} days, {len(total)} keys, {len(last):,} vehicles, {time.time() - start:.0f} s")
