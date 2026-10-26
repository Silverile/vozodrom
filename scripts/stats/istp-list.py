"""List the daily ISTP open-data files (STK inspections) from the National Open Data Catalogue.

Writes <data>/istp/files.tsv: date, download URL. Usage: py scripts/stats/istp-list.py <data dir> <from YYYY-MM-DD>
Source series: "Prohlídky vozidel STK a SME" (Ministerstvo dopravy, CC0-equivalent terms).
"""
import json, re, sys, urllib.parse, urllib.request

data, since = sys.argv[1], sys.argv[2]
SERIES = "https://data.gov.cz/zdroj/datové-sady/66003008/9c95ebdba1dc7a2fbcfc5b6c07d25705"
QUERY = f"""
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT ?title ?url WHERE {{
  ?ds dcat:inSeries <{SERIES}> ; dct:title ?title ; dcat:distribution ?d .
  ?d dcat:downloadURL ?url .
  FILTER(CONTAINS(STR(?title), "Prohlídky vozidel STK a SME za"))
}}"""
req = urllib.request.Request(
    "https://data.gov.cz/sparql?" + urllib.parse.urlencode({"query": QUERY}),
    headers={"Accept": "application/sparql-results+json", "User-Agent": "vozodrom-prototype/0.1 (https://vozodrom.cz; open data)"},
)
rows = json.load(urllib.request.urlopen(req, timeout=120))["results"]["bindings"]
files = {}
for r in rows:
    m = re.search(r"(\d{2})-(\d{2})-(\d{4})", r["title"]["value"])
    if m:
        day = f"{m[3]}-{m[2]}-{m[1]}"
        if day >= since:
            files[day] = r["url"]["value"]
with open(f"{data}/istp/files.tsv", "w", encoding="utf8") as f:
    for day in sorted(files):
        f.write(f"{day}\t{files[day]}\n")
print(len(files), "files from", min(files), "to", max(files))
