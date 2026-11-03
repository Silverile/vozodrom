import { type CatalogOp, type Path, same } from "@/lib/catalog-ops";
import { BODY_NAMES, CARD_FUEL, DRIVE, GEARBOX, type CardGeneration, type ModelCard } from "@/lib/modelCards";

// "Vložit JSON" in the catalogue editor: an admin copies the card as JSON, has it corrected (by an AI,
// say) and pastes it back. This turns the difference into the editor's operations: generations are
// matched by code (or name), so removed, added and reordered generations become remove, insert and
// move (their drawings and STK statistics follow them); then each field that differs becomes a set,
// and a field that disappeared a remove. Operations come in order: structure first, then fields at
// the generations' final places.

/** What a pasted card must look like; the reason it is refused, or the card. */
export function parseCard(text: string): ModelCard | string {
  let data: unknown;
  // an AI answer may wrap the card in a code block and say something around it: take the block,
  // or else the outer { … }
  const block = /```(?:json)?[ \t]*\r?\n([\s\S]*?)```/.exec(text);
  if (block) text = block[1];
  else if (text.indexOf("{") > 0 || text.lastIndexOf("}") < text.trimEnd().length - 1) text = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    data = JSON.parse(text);
  } catch (e) {
    return `Neplatný JSON: ${e instanceof Error ? e.message : "chyba zápisu"}.`;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Čekám objekt karty modelu ({ … }).";
  const card = data as ModelCard;
  if (!Array.isArray(card.generations)) return "Karta musí mít seznam „generations“.";
  const lists = ["facelifts", "bodyTypes", "engines", "drivetrains", "transmissions", "markets", "trims"] as const;
  for (const [i, g] of card.generations.entries()) {
    if (!g || typeof g !== "object" || Array.isArray(g)) return `${i + 1}. generace není objekt.`;
    const missing = lists.filter((k) => !Array.isArray((g as unknown as Record<string, unknown>)[k]));
    if (missing.length) return `${i + 1}. generaci chybí seznamy: ${missing.join(", ")}.`;
  }
  return card;
}

/** Keys that identify generations across the two cards; repeated keys get a counter. */
function keysOf(gens: CardGeneration[]): string[] {
  const seen = new Map<string, number>();
  return gens.map((g, i) => {
    const base = (g.code || g.name || (g.from ? `od ${g.from}` : "") || `#${i}`).trim().toLowerCase();
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n > 1 ? `${base}#${n}` : base;
  });
}

const isPlain = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const REQUIRED = new Set(["facelifts", "bodyTypes", "engines", "drivetrains", "transmissions", "markets", "trims"]);

/** Operations that make one value into another: objects field by field, everything else whole. */
function diffValue(path: Path, a: unknown, b: unknown, ops: CatalogOp[]) {
  if (same(a, b)) return;
  if (isPlain(a) && isPlain(b)) {
    for (const k of Object.keys(b)) {
      if (!(k in a)) ops.push({ op: "set", path: [...path, k], value: b[k], expect: null });
      else diffValue([...path, k], a[k], b[k], ops);
    }
    // a generation's lists stay (they can be emptied); other fields that went away are removed
    const inGeneration = path.length === 2 && path[0] === "generations";
    for (const k of Object.keys(a)) if (!(k in b) && !(inGeneration && REQUIRED.has(k))) ops.push({ op: "remove", path: [...path, k], expect: a[k] });
    return;
  }
  ops.push({ op: "set", path, value: b, expect: a ?? null });
}

export function diffCard(current: ModelCard, next: ModelCard): CatalogOp[] {
  const ops: CatalogOp[] = [];
  const work = [...current.generations];
  let keys = keysOf(work);
  const want = keysOf(next.generations);

  // 1. generations the new card no longer has, from the end so the indices stay right
  for (let i = work.length - 1; i >= 0; i--) {
    if (!want.includes(keys[i])) {
      ops.push({ op: "remove", path: ["generations", i], expect: work[i] });
      work.splice(i, 1);
      keys.splice(i, 1);
    }
  }
  // 2. into the new order: move the ones that are there, insert the new ones
  for (let j = 0; j < want.length; j++) {
    if (keys[j] === want[j]) continue;
    const from = keys.indexOf(want[j]);
    if (from > j) {
      ops.push({ op: "move", path: ["generations"], from, to: j, expect: work[from] });
      work.splice(j, 0, ...work.splice(from, 1));
      keys.splice(j, 0, ...keys.splice(from, 1));
    } else {
      ops.push({ op: "insert", path: ["generations", j], value: next.generations[j] });
      work.splice(j, 0, next.generations[j]);
      keys.splice(j, 0, want[j]);
    }
  }
  keys = keys.slice(0, want.length);

  // 3. fields of each generation, at its final place
  next.generations.forEach((g, j) => diffValue(["generations", j], work[j], g, ops));

  // 4. the card's own fields
  const { generations: _a, ...restA } = current;
  const { generations: _b, ...restB } = next;
  for (const k of Object.keys(restB)) {
    const before = (restA as Record<string, unknown>)[k];
    const after = (restB as Record<string, unknown>)[k];
    if (!(k in restA)) ops.push({ op: "set", path: [k], value: after, expect: null });
    else diffValue([k], before, after, ops);
  }
  for (const k of Object.keys(restA)) if (!(k in restB)) ops.push({ op: "remove", path: [k], expect: (restA as Record<string, unknown>)[k] });
  return ops;
}

const keys = (m: Record<string, string>) => Object.keys(m).join(", ");

const DIMS = { length: null, width: null, height: null, wheelbase: null };

/**
 * What an item of each list of a generation looks like, with what its fields mean: an empty list in
 * the card says nothing of its shape, and without this an AI cannot fill it.
 */
const LIST_SHAPES: { list: string; what: string; item: unknown; fields?: string }[] = [
  {
    list: "engines",
    what: "rodiny motorů generace (souhrn; každý motor jednou, i když má více výkonů)",
    item: { fuel: "petrol", displacementCc: 1390, displacementLitresNominal: 1.4, powerKwMin: 55, powerKwMax: 74, variant: "1.4 MPI", availablePowerKw: [55, 63, 74] },
    fields: "displacementCc = přesný objem v cm³; displacementLitresNominal = obchodní objem v litrech; powerKwMin/Max = nejnižší a nejvyšší výkon té rodiny; variant = označení motoru; availablePowerKw je nepovinný seznam všech výkonů.",
  },
  { list: "transmissions", what: "převodovky generace (souhrn, každý druh jednou)", item: { type: "manual", gears: 5 } },
  {
    list: "facelifts",
    what: "modernizace generace",
    item: { year: 2010, to: null, name: "facelift", code: null, note: null, photo: null },
    fields: "year = rok začátku výroby po modernizaci; to = poslední rok (null = do konce generace nebo další modernizace); photo nech null; drawing, pokud ho facelift má, ponech.",
  },
  {
    list: "trims",
    what: "konkrétní technické verze (motor + převodovka + karoserie) s údaji z katalogu výrobce",
    item: {
      name: "1.4 MPI 63 kW 5MT",
      from: 2007,
      to: 2010,
      bodyType: "hatchback",
      engine: { fuel: "petrol", displacementCc: 1390, cylinders: 4, powerKw: 63, powerStandard: null, torqueNm: 132 },
      transmission: { type: "manual", gears: 5 },
      drive: "fwd",
      dimensionsMm: DIMS,
      massKg: 1080,
      massBasis: "pohotovostní hmotnost",
      topSpeedKmh: 175,
      acceleration0to100s: 12.4,
      consumptionL100: 6.4,
      consumptionCycle: "NEDC",
      consumptionKwh100: null,
      rangeKm: null,
      rangeCycle: null,
    },
    fields: "powerStandard = norma výkonu (ISO, SAE, DIN…), když ji zdroj uvádí; consumptionCycle = cyklus spotřeby (WLTP, NEDC, ČSN…); u elektromobilů consumptionKwh100, rangeKm a rangeCycle; u hybridů engine.powerBasis: \"system\" a combustionPowerKw/electricPowerKw.",
  },
  {
    list: "bodyVariants",
    what: "nepovinné: rozměry a kufr podle karoserie, když se karoserie liší (hatchback × kombi, krátký × dlouhý rozvor); dimensionsMm a trunkL generace pak zůstanou null",
    item: { bodyType: "kombi", label: null, dimensionsMm: { length: 4255, width: 1642, height: 1498, wheelbase: 2451 }, trunkL: 480, noteCs: null },
  },
  {
    list: "equipmentLines",
    what: "nepovinné: výbavové stupně (Active, Ambition, Style, RS…)",
    item: { id: "ambition", name: "Ambition", kind: "equipment-line", from: null, to: null, noteCs: null },
    fields: "kind je \"equipment-line\", nebo \"performance-line\" pro sportovní řady s vlastními motory; trims je mohou uvádět v equipmentLineIds.",
  },
];

/**
 * "Kopírovat pro AI": the card with instructions, to paste into a chat as it is. The AI checks and
 * corrects the data and answers with the whole card as JSON, which goes back through "Vložit JSON".
 */
export function aiPrompt(card: ModelCard, title: string): string {
  const shapes = LIST_SHAPES.map((s) => `${s.list}: ${s.what}\n${JSON.stringify(s.item)}${s.fields ? `\n${s.fields}` : ""}`).join("\n\n");
  return `Jsi redaktor katalogu aut na webu Vozodrom (Česko). Níže je karta modelu ${title} jako JSON.

ÚKOL: Zkontroluj údaje a oprav chyby. Doplň, co chybí, ale jen to, čím si jsi jistý; co nevíš, nech null. Nic si nevymýšlej. Prázdné seznamy (engines, transmissions, trims…) naplň podle vzorů níže, pokud údaje znáš. Pokud ti pod touto zprávou napíšu konkrétní úkol, udělej hlavně ten.

PRAVIDLA
- Vrať CELOU kartu jako jeden platný JSON v jednom bloku kódu. Žádné komentáře uvnitř JSON, nic nezkracuj („…“), nevynechávej generace ani pole.
- Zachovej strukturu: stejné klíče a typy. Čísla jsou čísla (ne text), neznámá hodnota je null, prázdný seznam je []. Nové položky seznamů mají tvar podle vzorů níže. Klíče, které karta má a vzory ne (např. powerRangeCoverage, noteCs, kind), jsou platné: nemaž je.
- Jednotky: rozměry v mm (dimensionsMm), kufr v litrech (trunkL), výkon v kW (powerKw…; 1 k = 0,7355 kW), točivý moment v Nm, hmotnost v kg, spotřeba v l/100 km, roky jako celá čísla.
- from/to generace = roky sériové výroby (ne předsériová výroba ani ohlášení). Vyráběná generace má to: null a current: true.
- Seznamy engines a transmissions jsou souhrnem verzí v trims: co je v trims, má být i tam.
- "code" generace neměň, pokud není zjevně špatně: podle něj se generace pozná (i s nákresem). Nová generace = nový objekt v seznamu "generations" na správném místě podle let, se všemi seznamy níže (i prázdnými).
- Texty (summary, noteCs, názvy) piš česky.
- Pole "photo", "drawing" a "drawingStage" a odkazy v "sources" neměň; zdroje můžeš jen přidat.
- Povolené hodnoty:
  bodyTypes / bodyType: ${keys(BODY_NAMES)}
  drivetrains / drive: ${keys(DRIVE)}
  transmissions.type / transmission.type: ${keys(GEARBOX)}
  fuel: ${keys(CARD_FUEL)}
  dateBasis: production (výroba), sale (prodej), announcement (jen ohlášeno)
- Pod JSON krátce vypiš, co jsi změnil a proč.

VZORY POLOŽEK SEZNAMŮ GENERACE (čísla jsou jen příklad tvaru, ne údaje tohoto modelu)
${shapes}

KARTA (na jednom řádku kvůli délce; vrať ji klidně formátovanou)
\`\`\`json
${JSON.stringify(card)}
\`\`\`
`;
}
