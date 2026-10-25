import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Přepis vozidla — postup, doklady a poplatky",
  description: "Jak přepsat auto na nového majitele: lhůta 10 pracovních dnů, potřebné doklady, správní a emisní poplatek, online přepis.",
};

// Facts checked against zákon č. 56/2001 Sb. (§ 8, § 8a, § 10), 30/2024 Sb. (§ 6, § 24),
// 542/2020 Sb. (emisní poplatek), the portal.gov.cz service pages S8478 and S20943 and the
// Ministry of Transport release on evidenční kontrola (July 2025). Reviewed with Codex, October 2026.

const STEPS: [string, React.ReactNode][] = [
  ["Podepište kupní smlouvu", <>Ve dvou kopiích. Můžete použít náš <Link href="/kupni-smlouva/" className="text-[var(--color-brand)] hover:underline">vzor k vyplnění</Link>.</>],
  [
    "Zajistěte nepřetržité povinné ručení",
    "Kupující si zajistí účinné povinné ručení nejpozději při převzetí vozidla; u registrovaného auta nestačí sjednat ho až před první jízdou. Strany sladí konec starého a začátek nového pojištění, aby nevznikla mezera. Prodávající oznámí své pojišťovně změnu vlastníka bez zbytečného odkladu: samotným podpisem smlouvy jeho pojištění nezaniká.",
  ],
  [
    "Ověřte evidenční kontrolu",
    "Evidenční kontrola je součástí pravidelné technické prohlídky a od 1. 7. 2025 platí ve lhůtách pro technické prohlídky, u běžného staršího osobního auta zpravidla dva roky. Pokud platná není nebo dosud nebyla provedena, zajistěte ji na stanici technické kontroly.",
  ],
  ["Podejte žádost do 10 pracovních dnů", "Na kterémkoli obecním úřadě obce s rozšířenou působností, nebo online přes Portál dopravy."],
  ["Zaplaťte poplatky a převezměte nové ORV", "Úřad původní osvědčení o registraci zneplatní a vydá nové na nového vlastníka."],
];

const FEES: [string, string][] = [
  ["Zápis změny vlastníka osobního auta", "800 Kč"],
  ["Totéž online přes Portál dopravy", "640 Kč"],
  ["Emisní poplatek — vůz bez emisní normy", "10 000 Kč"],
  ["Emisní poplatek — Euro 1", "5 000 Kč"],
  ["Emisní poplatek — Euro 2", "3 000 Kč"],
  ["Emisní poplatek — Euro 3 a novější", "neplatí se"],
];

export default function TransferPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Přepis vozidla na nového majitele</h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Po prodeji je potřeba zapsat nového vlastníka do registru silničních vozidel. Podat žádost je nutné do{" "}
          <b className="text-[var(--color-ink)]">10 pracovních dnů</b> ode dne převodu, jinak hrozí pokuta.
        </p>
      </div>

      <section className="card p-5">
        <h2 className="text-xl font-bold">Postup</h2>
        <ol className="mt-3 space-y-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="grid grid-cols-[2rem_1fr] gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-brand)] text-[var(--color-brand-ink)] text-sm font-bold">{i + 1}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-[var(--color-muted)]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg font-bold">Osobně na úřadě</h2>
          <ul className="mt-2 text-sm text-[var(--color-muted)] list-disc pl-5 space-y-1">
            <li>Nejjednodušší je přijít společně; podání lze učinit i odděleně u stejného úřadu.</li>
            <li>Vezměte doklady totožnosti, osvědčení o registraci vozidla (ORV) a dosavadní technický průkaz, pokud byl vydán a dosud nebyl zneplatněn.</li>
            <li>Formulář žádosti dostanete na úřadě nebo ho stáhnete předem.</li>
            <li>Při zastoupení lze použít plnou moc s úředně ověřeným podpisem zmocnitele nebo oprávnění zapsané v informačním systému oprávnění k zastupování.</li>
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-bold">Online přes Portál dopravy</h2>
          <ul className="mt-2 text-sm text-[var(--color-muted)] list-disc pl-5 space-y-1">
            <li>Žádost založí prodávající a předá kupujícímu kód nebo odkaz.</li>
            <li>Kupující ji dokončí; obě strany potřebují elektronickou identitu.</li>
            <li>Poplatek je o 20 % nižší: 640 Kč místo 800 Kč. Sleva neplatí pro podání e-mailem nebo datovou schránkou.</li>
            <li>Kupující poté na zvoleném úřadě předloží původní ORV (a technický průkaz, pokud byl vydán), uhradí poplatek a převezme nové doklady. Návštěvě úřadu se tedy nevyhnete.</li>
          </ul>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-bold">Poplatky</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {FEES.map(([label, fee]) => (
              <tr key={label} className="border-t border-[var(--color-line)] first:border-0">
                <td className="py-2 pr-3">{label}</td>
                <td className="py-2 text-right font-semibold whitespace-nowrap">{fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Emisní poplatek se u osobních a lehkých užitkových aut (M1, N1) může uplatnit při první registraci v ČR i při změně
          vlastníka nebo provozovatele. Další poplatková povinnost nevzniká, pokud poplatek již dříve zaplatil poplatník, který nebyl
          osvobozen; předchozí převod na osvobozenou osobu proto sám o sobě neznamená, že se při dalším převodu platit nebude.
          Osvobození se vztahuje mimo jiné na držitele průkazu ZTP nebo ZTP/P a na případy nabytí dědictví nebo odkazu, převodu mezi
          osobami blízkými či zániku společného jmění manželů.
          Údaj o zaplacení ověřte v registru vozidel; pomoci může i doklad o úhradě nebo starší záznam v technickém průkazu.
        </p>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-bold">Když druhá strana nespolupracuje</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Pokud prodávající nebo kupující neposkytne součinnost v zákonné lhůtě, může dosavadní nebo nový vlastník požádat o zápis
          samostatně postupem podle § 8a zákona č. 56/2001 Sb. Úřad pak vyzve druhou stranu, aby se vyjádřila, případně odevzdala ORV.
        </p>
      </section>

      <section className="text-xs text-[var(--color-muted)] space-y-1">
        <p>
          Zdroje: zákon č. 56/2001 Sb. (§ 8, § 8a, § 10), zákon č. 30/2024 Sb. o pojištění odpovědnosti z provozu vozidla (§ 6, § 24),
          zákon č. 542/2020 Sb. (emisní poplatek), zákon č. 634/2004 Sb. (správní poplatky); portal.gov.cz — Zápis změny vlastníka
          vozidla a Platba emisního poplatku; Ministerstvo dopravy — prodloužená platnost evidenční kontroly. Stav k říjnu 2026.
        </p>
        <p>Informace jsou orientační. Závazné podmínky vám sdělí úřad, na kterém přepis vyřizujete.</p>
      </section>
    </div>
  );
}
