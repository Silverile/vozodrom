"""Aggregate the vehicle register (RSV open data) per make, model line and generation.

Reads <data>/rsv/vypisvozidel.csv (monthly full dump, one row per vehicle) and vozidladovoz.csv
(import country per vehicle), and writes <data>/out/rsv-agg.json with, per key "make|line|gen",
counting vehicles currently in operation (Status PROVOZOVANÉ):
  n, years {year of manufacture: n}, fuel {benzin|nafta|hybrid|elektro|lpg|cng|jiné: n},
  colors {base colour: n}, importBase (built 1995+ with both dates), imported (of those, first registered
  abroad more than 60 days before CZ), countries {country: n}
Nothing per vehicle is written.

Usage: py scripts/stats/rsv-stats.py <data dir>
"""
import csv, json, os, sys, time
from collections import Counter, defaultdict
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from match import Matcher

csv.field_size_limit(10_000_000)


def fuel_of(row):
    if row["Plně elektrické vozidlo"] == "true":
        return "elektro"
    if row["Hybridní vozidlo"] == "true":
        return "hybrid"
    p = row["Palivo"].upper()
    if "LPG" in p:
        return "lpg"
    if "CNG" in p or p.startswith("ZP"):
        return "cng"
    if p.startswith("NM") or "NAFTA" in p or "BIO NM" in p:
        return "nafta"
    if p.startswith("BA") or "BENZ" in p:
        return "benzin"
    if p.startswith("EL"):
        return "elektro"
    return "jiné"


def day(s):
    try:
        y, m, d = s[:10].split("-")
        return date(int(y), int(m), int(d))
    except ValueError:
        return None


if __name__ == "__main__":
    data = sys.argv[1]
    m = Matcher()
    start = time.time()
    countries = {}
    with open(os.path.join(data, "rsv", "vozidladovoz.csv"), encoding="utf-8-sig", newline="", errors="replace") as f:
        for row in csv.DictReader(f):
            countries[row["PČV"]] = row["Stát"].strip()
    print(f"imports: {len(countries):,} rows, {time.time() - start:.0f} s", flush=True)

    agg = defaultdict(lambda: {"n": 0, "years": Counter(), "fuel": Counter(), "colors": Counter(), "importBase": 0, "imported": 0, "countries": Counter()})
    with open(os.path.join(data, "rsv", "vypisvozidel.csv"), encoding="utf-8-sig", newline="", errors="replace") as f:
        for i, row in enumerate(csv.DictReader(f)):
            if i % 1_000_000 == 0 and i:
                print(f"{i:,} rows, {time.time() - start:.0f} s", flush=True)
            if row["Status"] != "PROVOZOVANÉ":
                continue
            make = m.make(row["Tovární značka"])
            if not make:
                continue
            # newer records often leave "Rok výroby" empty; the first registration is the next best year
            y = row["Rok výroby"]
            first_reg = row["Datum 1. registrace"][:4]
            year = int(y) if y.isdigit() else int(first_reg) if first_reg.isdigit() else None
            line = m.line(make, row["Obchodní označení"], year) or ""
            gen = m.generation(make, line, year, row["Typ"] + " " + row["Obchodní označení"]) if line else None
            a = agg[f"{make}|{line}|{'' if gen is None else gen}"]
            a["n"] += 1
            if year:
                a["years"][year] += 1
            a["fuel"][fuel_of(row)] += 1
            color = row["Barva"].split("-")[0].strip()
            if color and color not in ("NEZJIŠTĚNO", "."):
                a["colors"][color] += 1
            # Import share only for cars built from 1995: older records carry re-registration dates.
            first, cz = day(row["Datum 1. registrace"]), day(row["Datum 1. registrace v ČR"])
            if year and year >= 1995 and first and cz:
                a["importBase"] += 1
            if year and year >= 1995 and first and cz and (cz - first).days > 60:
                a["imported"] += 1
                c = countries.get(row["PČV"])
                if c:
                    a["countries"][c] += 1
    os.makedirs(os.path.join(data, "out"), exist_ok=True)
    out = {k: {**v, "years": dict(v["years"]), "fuel": dict(v["fuel"]), "colors": dict(v["colors"].most_common(12)), "countries": dict(v["countries"].most_common(10))} for k, v in agg.items()}
    json.dump({"meta": {"file": "vypisvozidel.csv", "built": date.today().isoformat()}, "keys": out}, open(os.path.join(data, "out", "rsv-agg.json"), "w", encoding="utf8"), ensure_ascii=False)
    print(f"done: {len(out)} keys, {sum(v['n'] for v in out.values()):,} vehicles in operation, {time.time() - start:.0f} s")
