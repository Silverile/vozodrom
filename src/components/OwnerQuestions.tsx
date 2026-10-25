import type { Model } from "@/lib/types";

// Seeded test posts that show the planned Q&A format: one concrete question per model,
// with provenance and a visible "test" label. Real posting needs accounts and moderation.

function questionsFor(model: Model) {
  const engine = model.engines[0];
  return [
    {
      q: `Jak se ${model.name} ${engine.code} osvědčil po 150 000 km?`,
      a: `Testovací odpověď majitele: běžná údržba, výměna brzd a ${model.cons[0]?.label ?? "drobnosti"}. Jinak bez větších potíží.`,
      meta: "majitel od 2019",
    },
    {
      q: `Na co se zaměřit při koupi ojetého ${model.name}?`,
      a: `Testovací odpověď: zkontrolovat ${model.stk.defects[0].label.toLowerCase()} a historii STK, u automatu servis převodovky.`,
      meta: "majitel od 2021",
    },
  ];
}

export function OwnerQuestions({ model }: { model: Model }) {
  return (
    <section className="card p-5">
      <h2 className="font-bold text-lg">Otázky a zkušenosti majitelů</h2>
      <ul className="mt-4 space-y-4">
        {questionsFor(model).map((item) => (
          <li key={item.q} className="rounded-[10px] bg-[var(--color-field)] p-4">
            <p className="font-semibold">{item.q}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{item.a}</p>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)] mr-2">testovací příspěvek</span>
              {item.meta}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--color-muted)] mt-4">
        Ptát se a odpovídat půjde po spuštění účtů. Příspěvky budou mít uvedený původ a půjde je nahlásit moderátorům.
      </p>
    </section>
  );
}
