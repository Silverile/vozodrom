import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pravidla fóra a recenzí" };

const RULES: [string, string][] = [
  ["Pište věcně a slušně", "Kritizujte auta, služby a názory, ne lidi. Urážky, vyhrožování a zesměšňování mažeme."],
  ["Nezveřejňujte cizí osobní údaje", "Žádná jména, telefony, adresy, registrační značky ani fotografie cizích lidí bez jejich souhlasu."],
  ["Recenze jen z vlastní zkušenosti", "Recenzi píše ten, kdo auto vlastnil nebo jím dlouhodobě jezdil. Placené nebo vyměněné recenze uveďte jako takové, jinak je odstraníme."],
  ["Žádná reklama mimo inzeráty", "Nabídky zboží a služeb patří do inzerce. Spam a skryté odkazy mažeme."],
  ["Nic nezákonného", "Zakázané je mimo jiné nabízet stáčení tachometrů, padělané doklady nebo návody, jak obejít STK či emisní předpisy."],
  ["Rady na vlastní odpovědnost", "Příspěvky jsou zkušenosti uživatelů, ne odborná ani právní rada. U bezpečnosti auta se obraťte na servis."],
];

export default function ForumRulesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pravidla fóra a recenzí</h1>
        <p className="mt-2 text-sm text-[var(--color-warn)] card p-3">
          Pracovní verze pro prototyp. Před spuštěním ji doplníme o údaje provozovatele a projde právní kontrolou.
        </p>
      </div>
      <ol className="space-y-3">
        {RULES.map(([title, text], i) => (
          <li key={title} className="card p-4 grid grid-cols-[2rem_1fr] gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-brand)] text-[var(--color-brand-ink)] text-sm font-bold">{i + 1}</span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-[var(--color-muted)]">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="card p-5 space-y-2 text-sm">
        <h2 className="text-lg font-bold">Nahlášení a moderace</h2>
        <p className="text-[var(--color-muted)]">
          U každého příspěvku, recenze i inzerátu bude tlačítko „Nahlásit“. Nahlásit může kdokoli, i bez účtu; uveďte, co
          a proč považujete za nezákonné nebo v rozporu s pravidly.
        </p>
        <p className="text-[var(--color-muted)]">
          Nahlášení posoudíme bez zbytečného odkladu. Pokud obsah odstraníme nebo omezíme, sdělíme autorovi rozhodnutí
          s odůvodněním a s informací, jak se proti němu bránit. Postupujeme podle nařízení EU o digitálních službách (DSA).
        </p>
      </section>
      <p className="text-sm">
        <Link href="/forum/" className="text-[var(--color-brand)] hover:underline">← Zpět na fórum</Link>
      </p>
    </div>
  );
}
