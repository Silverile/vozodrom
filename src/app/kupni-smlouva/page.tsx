import type { Metadata } from "next";
import Link from "next/link";
import { ContractForm } from "./ContractForm";

export const metadata: Metadata = {
  title: "Kupní smlouva na auto — vzor k vyplnění a tisku",
  description: "Vyplňte kupní smlouvu na ojeté auto mezi soukromými osobami a vytiskněte ji. Údaje se nikam neodesílají.",
};

export default function ContractPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 print:p-0">
      <div className="print:hidden">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Kupní smlouva na auto</h1>
        <p className="mt-2 text-[var(--color-muted)] max-w-3xl">
          Vzor pro prodej ojetého auta mezi dvěma soukromými osobami. Vyplňte, zkontrolujte náhled a vytiskněte ve dvou kopiích.
          Prázdná pole se vytisknou jako tečky, takže je můžete doplnit ručně.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 max-w-3xl text-sm">
          <p className="card p-3">
            🔒 Údaje zůstávají jen v této stránce: neukládáme je ani neodesíláme a po zavření zmizí.
          </p>
          <p className="card p-3">
            ⚖️ Vzor nenahrazuje právní radu. Při prodeji od firmy nebo na splátky platí jiná pravidla.
          </p>
        </div>
        <p className="mt-3 text-sm">
          Po podpisu následuje <Link href="/prepis-vozidla/" className="text-[var(--color-brand)] hover:underline">přepis vozidla na úřadě</Link>{" "}
          do 10 pracovních dnů.
        </p>
      </div>
      <ContractForm />
    </div>
  );
}
