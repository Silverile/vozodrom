import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Přepis vozidla — postup, doklady a poplatky",
  description: "Jak přepsat auto na nového majitele: lhůta 10 pracovních dnů, potřebné doklady, správní a emisní poplatek, online přepis.",
};

// Facts checked against § 8 and § 10 of zákon č. 56/2001 Sb. and the portal.gov.cz service
// pages for owner change (S8478) and emission fee (S20943), October 2026.

const STEPS: [string, React.ReactNode][] = [
  ["Podepište kupní smlouvu", <>Ve dvou kopiích. Můžete použít náš <Link href="/kupni-smlouva/" className="text-[var(--color-brand)] hover:underline">vzor k vyplnění</Link>.</>],
  ["Sjednejte povinné ručení", "Kupující si ho sjedná dřív, než s autem vyjede. Prodávající oznámí prodej své pojišťovně."],
  ["Zkontrolujte evidenční kontrolu", "Pokud od poslední evidenční kontroly uplynula lhůta pro technickou prohlídku, úřad ji bude chtít. Provádí ji stanice technické kontroly."],
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
            <li>Přijdou prodávající i kupující společně.</li>
            <li>Vezměte doklady totožnosti a osvědčení o registraci vozidla (ORV).</li>
            <li>Formulář žádosti dostanete na úřadě nebo ho stáhnete předem.</li>
            <li>Kdo nemůže přijít, pošle zástupce s plnou mocí s úředně ověřeným podpisem.</li>
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-bold">Online přes Portál dopravy</h2>
          <ul className="mt-2 text-sm text-[var(--color-muted)] list-disc pl-5 space-y-1">
            <li>Žádost založí prodávající a předá kupujícímu kód nebo odkaz.</li>
            <li>Kupující ji dokončí; obě strany potřebují elektronickou identitu.</li>
            <li>Poplatek je o 20 % nižší: 640 Kč místo 800 Kč.</li>
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
          Emisní poplatek platí nový majitel osobního nebo lehkého užitkového auta jen při prvním převodu v ČR; při dalších převodech
          se už neplatí. Je osvobozen mimo jiné držitel průkazu ZTP a ZTP/P a převod při dědictví. Zda už byl zaplacen, poznáte
          z úředního záznamu v dokladech vozu.
        </p>
      </section>

      <section className="text-xs text-[var(--color-muted)] space-y-1">
        <p>Zdroje: zákon č. 56/2001 Sb., § 8 a § 10; portal.gov.cz — Zápis změny vlastníka vozidla a Platba emisního poplatku. Stav k říjnu 2026.</p>
        <p>Informace jsou orientační. Závazné podmínky vám sdělí úřad, na kterém přepis vyřizujete.</p>
      </section>
    </div>
  );
}
