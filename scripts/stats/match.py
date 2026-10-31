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

# Restrict the namespace changes to the makes audited in the badge-routing pass.
BADGE_MAKES = frozenset({'bmw', 'mercedes-benz', 'audi', 'volvo', 'peugeot', 'saab'})


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
        self.chassis = {}  # explicit BMW/Mercedes chassis -> [(line, from, to)]
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
            if l['makeSlug'] in ('bmw', 'mercedes-benz'):
                pattern = r'\b[EFG]\d{2}\b' if l['makeSlug'] == 'bmw' else r'\b[WRCAXVHN]\d{3}\b'
                for i, g in enumerate(gens):
                    codes = set(re.findall(pattern, (g.get('code') or '') + ' ' + (g.get('name') or '')))
                    self.gens[(l['makeSlug'], l['slug'])][i][2].update(codes)
                    for code in codes:
                        self.chassis.setdefault((l['makeSlug'], code), []).append((l['slug'], self.gens[(l['makeSlug'], l['slug'])][i][0], g.get('to')))
        # The public catalogue retains aliases from card-only lines; the compact
        # card index does not. Use that existing evidence rather than guessing
        # numeric successors (e.g. Volvo 144 is an alias of the 140 family).
        public_lines = load('src/data/model-lines-index.json')
        for make in BADGE_MAKES:
            for model in public_lines.get(make, []):
                slug = model['slug']
                if (make, slug) not in self.years:
                    continue
                aliases = [model['name'], *(model.get('aliases') or [])]
                if make == 'mercedes-benz':
                    number = re.match(r'^(\d{2,4})\s*[–—-]', model['name'])
                    if number:
                        aliases.append(number[1])
                if make == 'volvo':
                    for gen in cards.get(make, {}).get(slug, {}).get('generations', model.get('generations') or []):
                        aliases.extend(re.findall(r'\bP(\d{3})\b', gen.get('code') or ''))
                for alias in aliases:
                    name = fold(alias)
                    if name:
                        self.lines.setdefault(make, []).append((name, slug))
                        self.lines[make].append((compact(name), slug))
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
        if year and make in BADGE_MAKES:
            # Badges are interpreted with the year at lookup time, never stored
            # as a year-independent cache result. A 1937 320 stays a BMW 320;
            # a 2015 320d belongs to series 3, not an expired historic model.
            for slug in self._badge_lines(make, raw_model, year):
                if self._in_period(make, slug, year) is not False:
                    return slug
            dated = [s for s in slugs if self._in_period(make, s, year) is True]
            unknown = [s for s in slugs if self._in_period(make, s, year) is None]
            if dated:
                def period_start(slug):
                    starts = [a for a, b, _ in self.gens.get((make, slug), []) if a is not None and a <= year and (b is None or year <= b)]
                    return max(starts, default=self.years[(make, slug)][0] or 0)
                return min(dated, key=lambda slug: (-period_start(slug), slug))
            slugs = dated or unknown
        if not slugs or not year:
            return slugs[0] if slugs else None
        if len(slugs) == 1:
            slug = slugs[0]
            # Generic line bounds may be unknown even for a fully dated historical
            # family, or stale after adding generations. Prefer dated generations.
            gens = getattr(self, 'gens', {}).get((make, slug)) or []
            if any(a is not None and a <= year and (b is None or year <= b) for a, b, _ in gens):
                return slug
            if gens and all(a is not None for a, _, _ in gens):
                return None
            start, end = self.years[(make, slug)]
            if (start is not None and year < start) or (end is not None and year > end):
                return None
            return slug
        def rank(slug):
            start, end = self.years[(make, slug)]
            contains = (start is not None or end is not None) and (start or 0) <= year <= (end or 9999)
            # Undated candidates are a fallback, not proof of production in every year.
            undated = start is None and end is None
            return (0 if contains else 1 if undated else 2, -(start or 0) if contains else 0, slug)
        return min(slugs, key=rank)

    def _in_period(self, make, slug, year):
        """True/False for documented bounds; None if bounds are genuinely unknown."""
        if (make, slug) not in self.years:
            return False
        gens = self.gens.get((make, slug)) or []
        if any(a is not None and a <= year and (b is None or year <= b) for a, b, _ in gens):
            return True
        if gens and all(a is not None for a, _, _ in gens):
            return False
        a, b = self.years[(make, slug)]
        if (a is not None and year < a) or (b is not None and year > b):
            return False
        return True if a is not None or b is not None else None

    def _badge_lines(self, make, raw_model, year):
        text = fold(raw_model)
        prefixes = [self.make_names.get(make, '')]
        if make == 'mercedes-benz':
            prefixes += ['MERCEDES BENZ', 'MERCEDES']
        for prefix in sorted(set(prefixes), key=len, reverse=True):
            if prefix and text.startswith(prefix + ' '):
                text = text[len(prefix):].strip()
                break
            if make == 'bmw' and text.startswith('BMW'):
                text = text[3:].strip()
                break
        text = compact(text)
        chassis = re.match(r'^([A-Z]\d{2,3})(?=$|\s)', text)
        if chassis and (make, chassis[1]) in self.chassis:
            possible = {slug for slug, a, b in self.chassis[(make, chassis[1])] if (a is None and self._in_period(make, slug, year) is not False) or (a is not None and a <= year and (b is None or year <= b))}
            legacy = MERCEDES_SERIES.get(chassis[1][1:]) if make == 'mercedes-benz' and chassis[1].startswith('W') else None
            if legacy in possible:
                return [legacy]
            return sorted(possible) if len(possible) == 1 else []
        if make == 'bmw':
            named = re.match(r'^(IX[123]|IX|XM|M1|X[1-7]|Z[1348]|I[34578])(?=$|\s|[A-Z])', text)
            if named:
                return [named[1].lower()]
            performance = re.match(r'^M([2-8])(?=$|\s|[A-Z])', text)
            if performance:
                return ['rada-' + performance[1]]
            badge = re.match(r'^(M?)([1-8])(\d{2})(?=$|\s|[A-Z])', text)
            if badge:
                series = 'rada-' + badge[2]
                if badge[2] == '2' and re.search(r'ACTIVE\s*TOURER', text):
                    series = 'rada-2-active-tourer'
                elif badge[2] == '2' and re.search(r'GRAN\s*TOURER', text):
                    series = 'rada-2-gran-tourer'
                elif badge[2] == '6' and re.search(r'\bGT\b|GRAN\s*TURISMO', text):
                    series = 'rada-6-gran-turismo'
                return [series] + ([badge[2] + badge[3]] if not badge[1] else [])
        elif make == 'saab':
            badge = re.match(r'^(9)\s*([23457])\s*(X?)(?=$|\s|[A-Z])', text)
            if badge:
                modern = '9-' + badge[2] + badge[3].lower()
                return [modern, '9' + badge[2]]
        elif make == 'mercedes-benz':
            # Explicit class letters are evidence; bare 300 is not evidence of
            # E vs S vs SL and remains unassigned outside the historic family.
            value = re.sub(r'^AMG\s*', '', text)
            prefix = re.match(r'^(EQA|EQB|EQC|EQE|EQS|EQT|EQV|GLA|GLB|GLC|GLE|GLS|GLK|CLA|CLC|CLE|CLK|CLS|CL|SLK|SLC|SL|ML|GL|[ABCEGRSTVX])\s*\d{2,3}(?=$|\s|[A-Z])', value)
            if prefix:
                code = prefix[1]
                if code == 'SLC':
                    return ['slc-c107', 'slk']
                family = {'ML':'gle', 'GL':'gls', 'SLC':'slk'}.get(code, code.lower())
                if len(code) == 1:
                    family = 'trida-' + code.lower()
                if code in ('EQE', 'EQS') and re.search(r'\bSUV\b', value):
                    family += '-suv'
                return [family]
            if re.match(r'^190(?:$|\s|[ED](?=$|\s|\d))', text):
                return ['190']
            # Reverse class notation was common before the class letter moved
            # to the front: 300 SL, 500 SEL, 300 E. Keep the genuine 300 SL first.
            reverse = re.match(r'^(\d{3})\s*(SEC|SEL|SE|SLC|SL|CE|TE|E)(?=$|\s)', text)
            if reverse:
                suffix = reverse[2]
                if suffix == 'SLC':
                    return ['slc-c107', 'slk']
                if suffix == 'SL' and reverse[1] == '190':
                    return ['190-sl']
                if suffix == 'SL' and reverse[1] != '190':
                    return (['300-sl'] if reverse[1] == '300' else []) + ['sl']
                if suffix == 'SEC' and year >= 1973:
                    return ['cl', 'trida-s']
                if suffix in ('SE', 'SEL') and year >= 1973:
                    return ['trida-s']
                if suffix in ('E', 'CE', 'TE') and year >= 1987:
                    return ['trida-e']
        return []

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
            # 220 is also a real engine/model badge; an unqualified 220 cannot
            # establish W220/S-Class. Preserve the other existing chassis keys.
            if series and series[1] in MERCEDES_SERIES and series[1] != '220':
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
