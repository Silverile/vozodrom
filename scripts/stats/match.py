"""Match raw register / STK make and model names to the site's makes, model lines and generations.

Register and STK records name vehicles loosely ("VW", "ŠKODA", "OCTAVIA COMBI", "GOLF VARIANT",
"OCTAVIA (1Z)"). This maps them to make slugs (src/data/makes-index.json), model-line slugs
(src/data/catalog/model-lines-auto.json) and a generation index (model cards, else model lines).
"""
import json, os, re, unicodedata

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
load = lambda p: json.load(open(os.path.join(ROOT, p), encoding="utf8"))


def fold(s: str) -> str:
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().upper()
    return re.sub(r"[^A-Z0-9]+", " ", s).strip()


# Make names as the register writes them, beyond the aliases in makes-index.
MAKE_ALIASES = {
    "VW": "volkswagen", "VOLKSWAGEN": "volkswagen", "VAZ": "lada", "LADA VAZ": "lada", "MERCEDES BENZ": "mercedes-benz",
    "MERCEDES": "mercedes-benz", "TRABANT": "trabant", "MOSKVIC": "moskvic", "AZLK": "moskvic", "CZ": "cz",
    "LAND ROVER": "land-rover", "ROVER": "rover", "ALFA ROMEO": "alfa-romeo", "SSANGYONG": "ssangyong-kgm",
    "KGM": "ssangyong-kgm", "DS": "ds-automobiles", "MINI": "mini", "CITROEN": "citroen", "ROLLS ROYCE": "rolls-royce",
}

# Words that describe the body or trim, not the model ("OCTAVIA COMBI" is an Octavia).
NOISE = {"COMBI", "KOMBI", "SEDAN", "LIMOUSINE", "LIMUZINA", "HATCHBACK", "LIFTBACK", "VARIANT", "TOURER", "ESTATE",
         "SPORTSWAGEN", "SPACEBACK", "SCOUT", "ALLTRACK", "CABRIO", "CABRIOLET", "KABRIOLET", "COUPE", "KUPE", "VAN",
         "GRANDTOUR", "SW", "BREAK", "WAGON", "SPORTS", "TOURING", "AVANT", "SPORTBACK", "STATION"}


# Raw names the register uses for models we list under another name, and common typos.
RAW_ALIASES = {
    "skoda": {"OCATVIA": "octavia", "0CTAVIA": "octavia", "OKTAVIA": "octavia", "FABIE": "fabia"},
    "volkswagen": {"CARAVELLE": "transporter", "KOMBI": "transporter", "7HC": "transporter", "7HM": "transporter", "7EC": "transporter"},
    "hyundai": {"TUSCON": "tucson"},
    "renault": {"MEGAN": "megane"},
    "smart": {"MC01": "fortwo"},
    "ford": {"GRAND C MAX": "c-max"},
    "citroen": {"PICASSO": "xsara-picasso"},
}
# Mercedes-Benz registers some cars by chassis series ("204" = C-Class W204).
MERCEDES_SERIES = {
    **dict.fromkeys(["168", "169", "176", "177"], "trida-a"), **dict.fromkeys(["245", "246", "247"], "trida-b"),
    **dict.fromkeys(["202", "203", "204", "205", "206"], "trida-c"), **dict.fromkeys(["210", "211", "212", "213", "214"], "trida-e"),
    **dict.fromkeys(["220", "221", "222", "223"], "trida-s"), **dict.fromkeys(["163", "164", "166", "167"], "gle"),
    **dict.fromkeys(["638", "639", "447"], "vito"), "463": "trida-g", "414": "vaneo", "251": "trida-r",
}


def compact(s: str) -> str:
    """'IX 20' -> 'IX20', 'XC 90' -> 'XC90': short letter prefixes glued to their number."""
    return re.sub(r"\b([A-Z]{1,3}) (\d{1,3})\b", r"\1\2", s)


class Matcher:
    def __init__(self):
        makes = load("src/data/makes-index.json")
        self.make_by_key = {}
        for m in makes:
            for k in [m["name"], *m["keys"]]:
                self.make_by_key.setdefault(fold(k), m["slug"])
        for k, v in MAKE_ALIASES.items():
            self.make_by_key[fold(k)] = v
        self.make_names = {m["slug"]: fold(m["name"]) for m in makes}

        lines = load("src/data/catalog/model-lines-auto.json")
        cards = load("src/data/model-cards-index.json")
        self.lines = {}  # make -> [(folded name, slug)] longest first
        self.gens = {}  # (make, line) -> [(from, to, codes)]
        self.years = {}  # (make, line) -> (from, to)
        # Lines known only from a model card (Claude's agents) join the curated list.
        known = {(l["makeSlug"], l["slug"]) for l in lines}
        for mk, by_line in cards.items():
            for slug, c in by_line.items():
                if (mk, slug) in known:
                    continue
                froms = [g["from"] for g in c["generations"] if g.get("from")]
                tos = [g["to"] for g in c["generations"] if g.get("to")]
                lines.append({"makeSlug": mk, "slug": slug, "name": c["name"], "from": min(froms, default=None), "to": max(tos, default=None)})
        for l in lines:
            self.years[(l["makeSlug"], l["slug"])] = (l.get("from"), l.get("to"))
            # "Octavia (1959)" is registered as plain "OCTAVIA": the year picks between same-named lines.
            base = re.sub(r"\s*\([^)]*\d{4}[^)]*\)\s*$", "", l["name"])
            names = {fold(l["name"]), fold(base), *(fold(a) for a in l.get("aliases") or [])}
            # "105/120/125" and "1000/1100 MB" are families: each number is a name of its own.
            if "/" in l["name"]:
                names |= {fold(p) for p in l["name"].split("/")}
            # "Třída E" is registered as "E 220", "Řada 3" as "320D": keep the bare class too.
            for n in list(names):
                bare = re.sub(r"^(TRIDA|RADA|CLASS|SERIE|SERIES|KLASSE) ", "", n)
                if bare != n:
                    names.add(bare)
            for n in names:
                if n:
                    self.lines.setdefault(l["makeSlug"], []).append((n, l["slug"]))
            card = cards.get(l["makeSlug"], {}).get(l["slug"])
            gens = card["generations"] if card else l.get("generations") or []
            self.gens[(l["makeSlug"], l["slug"])] = [
                (None if g.get("dateBasis") == "announcement" else g.get("from"), g.get("to"), set(re.findall(r"\(([A-Z0-9]{2,4})\)", (g.get("code") or "") + " " + (g.get("name") or ""))))
                for g in gens
            ]
        for make, v in self.lines.items():
            if make != "mercedes-benz":  # "E 220" must stay "E 220" to match class E
                v.extend((compact(n), slug) for n, slug in list(v) if compact(n) != n)
            v.sort(key=lambda x: (-len(x[0]), x[0], x[1]))
        self._cache = {}

    def make(self, raw: str):
        k = fold(raw)
        if k in self.make_by_key:
            return self.make_by_key[k]
        first = k.split(" ")[0] if k else ""
        return self.make_by_key.get(first)

    def line(self, make: str, raw_model: str, year=None):
        """Model-line slug; when several lines share the matched name, the one built in `year`."""
        key = (make, raw_model)
        if key not in self._cache:
            self._cache[key] = self._lines(make, raw_model)
        slugs = self._cache[key]
        if len(slugs) <= 1 or not year:
            return slugs[0] if slugs else None
        def rank(slug):
            start, end = self.years[(make, slug)]
            contains = (start is not None or end is not None) and (start or 0) <= year <= (end or 9999)
            # Undated candidates are a fallback, not proof of production in every year.
            undated = start is None and end is None
            return (0 if contains else 1 if undated else 2, -(start or 0) if contains else 0, slug)
        return min(slugs, key=rank)

    def _lines(self, make: str, raw_model: str):
        m = fold(raw_model)
        mk = self.make_names.get(make, "")
        if mk and m.startswith(mk + " "):
            m = m[len(mk) + 1:]
        words = [w for w in m.split(" ") if w not in NOISE]
        m2 = " ".join(words)
        # BMW registers the engine badge: "320D", "520I", "118D" belong to series 3, 5, 1.
        if make == "bmw":
            b = re.match(r"^(\d)\d\d", m2)
            if b:
                m2 = f"{b[1]} {m2}"
        cands = [m, m2] if make == "mercedes-benz" else [m, m2, compact(m), compact(m2)]
        found = None
        matched_name = None
        for raw, slug in RAW_ALIASES.get(make, {}).items():
            if any(c == raw or c.startswith(raw + " ") for c in cands):
                found = slug
        if not found and make == "mercedes-benz":
            series = re.match(r"^(\d{3})\b", m2)
            if series and series[1] in MERCEDES_SERIES:
                found = MERCEDES_SERIES[series[1]]
        for name, slug in [] if found else self.lines.get(make, []):
            for cand in cands:
                # "I30CW" is an i30 with a body suffix; "C30" is not a "C3" (next char a digit).
                glued = make != "mercedes-benz" and cand.startswith(name) and len(cand) > len(name) and cand[len(name)].isalpha()
                if cand == name or cand.startswith(name + " ") or glued:
                    found, matched_name = slug, name
                    break
            if found:
                break
        if not found:
            return []
        if matched_name is None:
            return [found]
        # every line registered under the same name, newest first
        same = [s for n, s in self.lines.get(make, []) if n == matched_name]
        return sorted(set(same), key=lambda s: (-(self.years[(make, s)][0] or 0), s))

    def generation(self, make: str, line: str, year, type_text: str = ""):
        """Index of the generation built in `year`; a type code like (5E) in the raw text breaks ties."""
        gens = self.gens.get((make, line)) or []
        if not year or not gens:
            return None
        hits = [i for i, (a, b, _) in enumerate(gens) if a and a <= year and (b is None or year <= b)]
        if len(hits) > 1 and type_text:
            t = set(re.findall(r"[A-Z0-9]{2,4}", fold(type_text)))
            coded = [i for i in hits if gens[i][2] & t]
            if len(coded) == 1:
                return coded[0]
        return max(hits, key=lambda i: gens[i][0]) if hits else None
