import type { Metadata } from "next";
import { ConsentSettings } from "@/components/Analytics";

export const metadata: Metadata = { title: "Ochrana soukromí a cookies" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-extrabold">Ochrana soukromí a cookies</h1>
      <p className="card p-4 text-sm text-[var(--color-warn)]">
        Pracovní verze pro prototyp. Před spuštěním ji doplníme o údaje provozovatele a projde právní kontrolou.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Co ukládáme bez souhlasu</h2>
        <p className="text-[var(--color-muted)]">
          Váš výběr aut, uložená hledání, rozpracovaný inzerát a vaši volbu ohledně analytiky ukládáme jen ve vašem
          prohlížeči (localStorage). Nikam se neodesílají a smažete je vymazáním dat webu v prohlížeči.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Analytika (jen se souhlasem)</h2>
        <p className="text-[var(--color-muted)]">
          Pokud ji povolíte, používáme Google Analytics 4 od společnosti Google Ireland Ltd. ke statistice návštěvnosti:
          které stránky se zobrazují, z jakého typu zařízení a odkud návštěva přišla. Google k tomu ukládá cookies
          <code className="mx-1">_ga</code> a <code className="mx-1">_ga_*</code>. Údaje mohou být předány do USA v rámci
          EU-US Data Privacy Framework. Nepoužíváme je k reklamě ani k profilování.
        </p>
        <p className="text-[var(--color-muted)]">Souhlas můžete kdykoli odvolat a cookies se tím smažou.</p>
        <p className="text-sm"><ConsentSettings /></p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Účty</h2>
        <p className="text-[var(--color-muted)]">
          Registrace a přihlášení zatím nejsou spuštěné a žádné osobní údaje nesbíráme. Podmínky pro účty doplníme před
          jejich spuštěním.
        </p>
      </section>
    </div>
  );
}
