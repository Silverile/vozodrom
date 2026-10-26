"""Download the daily ISTP files listed in <data>/istp/files.tsv into <data>/istp/days/<date>.xml.gz.

Skips files already present; 4 parallel downloads to stay polite. Usage: py scripts/stats/istp-download.py <data dir>
"""
import os, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

data = sys.argv[1]
out = os.path.join(data, "istp", "days")
os.makedirs(out, exist_ok=True)
UA = {"User-Agent": "vozodrom-prototype/0.1 (https://vozodrom.cz; open data)"}
jobs = [line.rstrip("\n").split("\t") for line in open(os.path.join(data, "istp", "files.tsv"), encoding="utf8")]

def fetch(job):
    day, url = job
    path = os.path.join(out, f"{day}.xml.gz")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return 0
    for attempt in range(5):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300).read()
            with open(path + ".part", "wb") as f:
                f.write(data)
            os.replace(path + ".part", path)
            return len(data)
        except Exception as e:
            time.sleep(10 * (attempt + 1))
    print("FAILED", day, flush=True)
    return 0

done = total = 0
with ThreadPoolExecutor(4) as pool:
    for n in pool.map(fetch, jobs):
        done += 1
        total += n
        if done % 50 == 0:
            print(f"{done}/{len(jobs)} files, {total / 2**30:.2f} GB", flush=True)
print(f"done {done}/{len(jobs)}, {total / 2**30:.2f} GB new", flush=True)
