"use client";

import { useId, useMemo, useState } from "react";
import { FrontDrawing, frontDrawingFor, newestFrontDrawing } from "@/components/FrontDrawing";
import { coversYear } from "@/lib/listing-catalog";
import { generationId } from "@/lib/listing-draft";
import { type Make, type ModelLine, makesIn, modelLinesOf, yearsOf } from "@/lib/makes";

// "Jaké auto prodáváte?": one field that finds the make, model line and, with a year, the generation
// in the catalogue. It matches names, not free text: "octavia 2019", "vw golf", "i20 2019 1.0".
// Engine words ("1.0", "tdi") are not matched here; they are handed on to rank the engine choice.

export interface CarPick {
  brand: string;
  model: string;
  year?: number;
  generation?: string;
  /** what the seller typed besides make, model and year, e.g. "1.0 t-gdi" */
  engineHint: string;
}

interface Entry {
  make: Make;
  line: ModelLine;
  words: string[];
  lineWords: string[];
}

interface Suggestion {
  key: string;
  pick: CarPick;
  title: string;
  detail: string;
  drawing: string | null;
}

const CURRENT_YEAR = new Date().getFullYear();
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const wordsOf = (s: string) => fold(s).split(/[\s\-/]+/).filter(Boolean);
/** Short names sellers type that the make list does not carry. */
const MAKE_ALIASES: Record<string, string> = { vw: "volkswagen", mb: "mercedes-benz", merc: "mercedes-benz", chevy: "chevrolet" };

let index: Entry[] | undefined;
function entries(): Entry[] {
  index ??= makesIn("auto").flatMap((make) =>
    modelLinesOf(make.slug).map((line) => {
      const lineWords = [...wordsOf(line.name), ...((line as { aliases?: string[] }).aliases ?? []).flatMap(wordsOf), fold(line.name).replace(/[\s-]+/g, "")];
      return { make, line, lineWords, words: [...wordsOf(make.name), ...make.keys.flatMap(wordsOf), ...lineWords] };
    }),
  );
  return index;
}

function search(query: string): Suggestion[] {
  const tokens = wordsOf(query.replace(/,/g, "."));
  const year = tokens.map(Number).find((n) => Number.isInteger(n) && n >= 1950 && n <= CURRENT_YEAR + 1);
  const engine = tokens.filter((t) => /^\d[.]\d$/.test(t));
  const names = tokens.filter((t) => Number(t) !== year && !engine.includes(t)).map((t) => MAKE_ALIASES[t] ?? t);
  if (!names.length) return [];

  const scored: { entry: Entry; score: number; unmatched: string[] }[] = [];
  for (const entry of entries()) {
    const { line } = entry;
    const hits = names.filter((t) => entry.words.some((w) => w.startsWith(t)));
    // The model line itself must be named; a make alone would list hundreds of models.
    if (!hits.some((t) => entry.lineWords.some((w) => w.startsWith(t)))) continue;
    const outside = year !== undefined && ((line.from !== null && year < line.from) || (line.to !== null && !line.current && year > line.to));
    if (outside) continue;
    const exact = names.some((t) => entry.lineWords.includes(t));
    const unmatched = names.filter((t) => !hits.includes(t));
    scored.push({ entry, unmatched, score: hits.length * 10 + (exact ? 5 : 0) - unmatched.length * 4 - fold(line.name).length / 100 });
  }
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.score ?? 0;

  const out: Suggestion[] = [];
  for (const { entry, score, unmatched } of scored) {
    if (out.length >= 8 || score < best - 12) break;
    const { make, line } = entry;
    const engineHint = [...engine, ...unmatched].join(" ");
    const base = { brand: make.slug, model: line.slug, year, engineHint };
    const generations = year ? line.generations.filter((g) => g.from !== null && coversYear(g, year)) : [];
    if (generations.length) {
      for (const g of generations) {
        out.push({
          key: `${make.slug}/${line.slug}/${generationId(g)}`,
          pick: { ...base, generation: generationId(g) },
          title: `${make.name} ${line.name}`,
          detail: [g.code, yearsOf({ from: g.from, to: g.to, current: g.to === null }), `rok ${year}`].filter(Boolean).join(" · "),
          drawing: frontDrawingFor(make.slug, line.slug, year!),
        });
      }
    } else {
      out.push({
        key: `${make.slug}/${line.slug}`,
        pick: base,
        title: `${make.name} ${line.name}`,
        detail: [yearsOf(line), year && `rok ${year}`].filter(Boolean).join(" · ") || "roky výroby neznáme",
        drawing: year ? frontDrawingFor(make.slug, line.slug, year) : newestFrontDrawing(make.slug, line.slug),
      });
    }
  }
  return out.slice(0, 8);
}

export function CarSearch({ onPick }: { onPick: (pick: CarPick) => void }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [openList, setOpenList] = useState(false);
  const results = useMemo(() => (query.trim().length >= 2 ? search(query) : []), [query]);
  const expanded = openList && query.trim().length >= 2;

  function pick(s: Suggestion) {
    onPick(s.pick);
    setQuery("");
    setOpenList(false);
  }

  return (
    <div className="sm:col-span-2 relative scroll-mt-28">
      <label htmlFor={`${id}-q`} className="font-semibold">Jaké auto prodáváte?</label>
      <input
        id={`${id}-q`}
        className="input mt-1 scroll-mt-28"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={expanded && results[active] ? `${id}-o${active}` : undefined}
        autoComplete="off"
        placeholder="např. Škoda Octavia 2019 nebo Hyundai i20 2019 1.0"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpenList(true);
        }}
        onFocus={() => setOpenList(true)}
        onBlur={() => setOpenList(false)}
        onKeyDown={(e) => {
          if (!expanded || !results.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % results.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a - 1 + results.length) % results.length);
          } else if (e.key === "Enter") {
            e.preventDefault();
            pick(results[active]);
          } else if (e.key === "Escape") {
            setOpenList(false);
          }
        }}
      />
      <p className="mt-1 text-xs text-[var(--color-muted)]">Značka, model a rok výroby. Generaci a motory pak nabídneme z katalogu.</p>
      {expanded && (
        <ul id={`${id}-list`} role="listbox" aria-label="Vozy z katalogu" className="absolute z-20 left-0 right-0 mt-1 card p-1 max-h-96 overflow-y-auto shadow-lg">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--color-muted)]">Nic jsme nenašli. Zkuste jen model, nebo vyberte ručně níže.</li>
          ) : (
            results.map((s, i) => (
              <li
                key={s.key}
                id={`${id}-o${i}`}
                role="option"
                aria-selected={i === active}
                // mousedown, so the choice lands before the field loses focus and closes the list
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                onMouseEnter={() => setActive(i)}
                className="flex items-center gap-3 rounded-[10px] px-2 py-2 cursor-pointer aria-selected:bg-[var(--color-field)]"
              >
                <span className="w-16 shrink-0 overflow-hidden rounded-md">
                  {s.drawing ? <FrontDrawing id={s.drawing} alt={s.title} /> : <span className="block aspect-[16/10] bg-[var(--color-field)]" />}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold truncate">{s.title}</span>
                  <span className="block text-xs text-[var(--color-muted)] truncate">{s.detail}</span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
