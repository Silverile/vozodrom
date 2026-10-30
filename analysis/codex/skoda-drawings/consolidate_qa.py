from pathlib import Path
import json

HERE = Path(__file__).resolve().parent

def read(name, default):
    try: return json.loads((HERE / name).read_text(encoding="utf-8-sig"))
    except (OSError, ValueError): return default

out = read("root-qa.json", {})
for name in ("batch-1-qa.json", "batch-2-qa.json", "batch-3-qa.json"):
    for row in read(name, []):
        status = row.get("status", "needs-review")
        issues = row.get("issues", [])
        if isinstance(issues, str): issues = [issues]
        if row.get("notes"): issues = [row["notes"], *issues]
        if row.get("accuracy"): issues = [row["accuracy"], *issues]
        out[row["id"]] = {"status": "blocked" if status in ("redo-recommended", "reject") else "review",
                          "selectedVersion": row.get("selectedVersion", ""), "issues": issues}

replacement_second = read("batch-3-replacements-second-opinion.json", {})
replacement_ids = {row.get("id") for row in replacement_second.get("items", [])}

for name in ("root-second-opinion.json", "batch-3-second-opinion.json"):
    second = read(name, {})
    for row in second.get("items", []):
        if name == "batch-3-second-opinion.json" and row.get("id") in replacement_ids:
            continue
        entry = out.setdefault(row["id"], {"status": "review", "issues": []})
        verdict = row.get("verdict")
        if verdict == "reject-or-regenerate":
            entry["status"] = "blocked"
        elif verdict == "pass" and entry.get("status") != "blocked":
            entry["status"] = "pass"
        details = row.get("reasons") or [row.get("modelAccuracy"), row.get("scaleFraming"), row.get("inventedDetails"), row.get("notes")]
        entry["issues"] = [x for x in details if x]

for row in replacement_second.get("items", []):
    entry = out.setdefault(row["id"], {"status": "review", "issues": []})
    verdict = row.get("verdict")
    entry["status"] = "blocked" if verdict == "reject-or-regenerate" else "pass" if verdict == "pass" else "review"
    entry["issues"] = [x for x in row.get("reasons", []) if x]

(HERE / "qa.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Consolidated QA: {len(out)} entries")
