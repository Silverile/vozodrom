import type { Metadata } from "next";
import Link from "next/link";
import { ConsentSettings } from "@/components/Analytics";
import { OPERATOR, operatorLine } from "@/lib/operator";
import { reviewContact } from "@/lib/statement";

export const metadata: Metadata = { title: "Ochrana soukromí a cookies" };

// The privacy notice (GDPR art. 13). It has to match what the code does: when a feature starts
// collecting something new, add it to WHAT. The controller's details come from lib/operator.ts.

const WHAT: { title: string; data: string; why: string }[] = [
  {
    title: "Účet",
    data: "jméno, které ukazujeme u vašeho obsahu, e-mail, heslo (ukládáme jen jeho jednosměrný otisk), datum registrace; u přihlášení IP adresa a typ prohlížeče.",
    why: "Abychom vám mohli poskytovat službu podle podmínek užívání (čl. 6 odst. 1 písm. b GDPR) a chránit účty před zneužitím (oprávněný zájem, písm. f).",
  },
  {
    title: "Inzeráty",
    data: "údaje o voze, fotografie, cena, místo a telefon, případně messengery, pokud je uvedete. Inzerát je veřejný.",
    why: `Plnění smlouvy (písm. b). Nové a upravené inzeráty vyhodnocuje automatická kontrola. Některé zveřejní automaticky, jiné předá moderátorovi a do jeho rozhodnutí je nezveřejní. Zveřejněný inzerát může systém dočasně skrýt také po opakovaných hlášeních od různých lidí. O přezkoumání můžete požádat na ${reviewContact()}.`,
  },
  {
    title: "Garáž a příběhy aut",
    data: "auta, zápisy, náklady, nájezd, fotografie, komentáře, „líbí se“ a sledování. VIN a neveřejnou registrační značku z Garáže nezobrazujeme na veřejných stránkách. Přístup k nim máte vy a oprávnění moderátoři a správci služby. Registrační značku zveřejníme, pokud tuto možnost zapnete.",
    why: "Plnění smlouvy (písm. b).",
  },
  {
    title: "Zprávy",
    data: "zprávy mezi kupujícím a prodávajícím a oznámení od Vozodromu.",
    why: "Plnění smlouvy (písm. b). Zprávy nejsou veřejné. V běžném uživatelském rozhraní je vidí účastníci konverzace. Oprávnění správci služby k nim mohou mít technický přístup, například při řešení zneužití; zprávy nejsou koncově šifrované. K reklamě je nepoužíváme.",
  },
  {
    title: "Výběr a uložená hledání",
    data: "auta, která si uložíte, a hledání, o jejichž novinkách vám dáme vědět. Bez účtu zůstávají jen ve vašem prohlížeči.",
    why: "Plnění smlouvy (písm. b).",
  },
  {
    title: "Hlášení a moderace",
    data: "u hlášení jméno, e-mail, důvod a vysvětlení; u rozhodnutí jeho důvody. Hlášení podané po přihlášení zůstává spojené s vaším účtem, i když jméno a e-mail neuvedete.",
    why: "Vyřizování oznámení o nezákonném obsahu a odůvodnění rozhodnutí je právní povinností podle nařízení o digitálních službách (písm. c). Prosazování podmínek užívání a ochrana služby a uživatelů před podvody a zneužitím je naším oprávněným zájmem (písm. f).",
  },
  {
    title: "E-maily",
    data: "ověření adresy, obnovení hesla a potvrzení a výsledek hlášení.",
    why: "Plnění smlouvy a právní povinnosti. Reklamní e-maily bez vašeho souhlasu neposíláme.",
  },
];

export default function PrivacyPage() {
  const controller = operatorLine();
  const contact = OPERATOR.email;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-10 text-base leading-relaxed">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ochrana soukromí a cookies</h1>
        <div className="mt-6 rounded-[14px] bg-[var(--color-surface)] p-5">
          <p><b>Správce osobních údajů:</b> {controller ?? "údaje provozovatele doplníme"}</p>
          <p className="mt-1">
            <b>Kontakt:</b> {contact ? <a href={`mailto:${contact}`} className="underline underline-offset-4">{contact}</a> : "doplníme"}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Co zpracováváme a proč</h2>
        <dl className="space-y-5">
          {WHAT.map((w) => (
            <div key={w.title}>
              <dt className="text-lg font-semibold">{w.title}</dt>
              <dd>{w.data}</dd>
              <dd className="text-[var(--color-muted)]">{w.why}</dd>
            </div>
          ))}
        </dl>
        <p>
          Pokud zvolíte přihlášení přes Google, získáme od Googlu údaje potřebné k přihlášení, zejména identifikátor účtu, jméno, e-mail a případně
          profilový obrázek. Uchováváme také přihlašovací tokeny. Zpracování slouží k přihlášení a propojení účtu podle čl. 6 odst. 1 písm. b GDPR
          a nezávisí na souhlasu s analytikou.
        </p>
        <p>
          Při nahrávání přes náš formulář se fotografie v prohlížeči zmenší a znovu zakódují, čímž se odstraní původní metadata, například GPS.
          Účet si můžete založit od 15 let.
        </p>
        <p>
          Povinné údaje označujeme ve formulářích. Bez údajů nezbytných pro založení účtu nebo zveřejnění inzerátu nelze příslušnou funkci použít.
          Nepovinné údaje poskytujete dobrovolně.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Kdo údaje zpracovává s námi</h2>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <b>Cloudflare, Inc.</b>: provoz webu, úložiště fotografií, odesílání e-mailů a ochrana před útoky. Servery má i mimo EU; předání do
            USA kryje EU-US Data Privacy Framework a standardní smluvní doložky{" "}
            (<a href="https://www.cloudflare.com/cloudflare-customer-dpa/" className="underline underline-offset-4" rel="noopener">smlouva o zpracování</a>).
          </li>
          <li>
            <b>Neon, Inc.</b>: databáze, uložená v datovém centru AWS ve Frankfurtu. Neon je americká společnost; případný přístup z USA kryjí
            standardní smluvní doložky (<a href="https://neon.com/dpa" className="underline underline-offset-4" rel="noopener">smlouva o zpracování</a>).
          </li>
          <li><b>Google Ireland Ltd.</b>: přihlášení přes Google, pokud ho zvolíte, a statistika návštěvnosti, jen pokud ji povolíte (níže).</li>
        </ul>
        <p>Úřadům předáváme údaje jen tehdy, když to vyžaduje zákon. Údaje neprodáváme.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Jak dlouho</h2>
        <p>
          Údaje účtu a váš obsah uchováváme, dokud účet máte. Po smazání odstraníme obsah z našich stránek a úložiště. Dříve uložené kopie
          v prohlížečích a dalších mezipamětech mohou přetrvat. Po zrušení účtu smažeme účet i obsah bez zbytečného odkladu; po nezbytnou dobu
          ponecháme jen to, co potřebujeme ke splnění zákonných povinností nebo k ochraně práv, například hlášení a rozhodnutí o nich.
          Přihlašovací relace má obvykle sedmidenní platnost, která se při používání služby průběžně obnovuje.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Vaše práva</h2>
        <p>
          Máte právo na přístup ke svým údajům, jejich opravu a výmaz, omezení zpracování, přenositelnost a právo vznést námitku proti zpracování
          z oprávněného zájmu. Souhlas s analytikou můžete kdykoli odvolat; odvolání nemá vliv na zákonnost zpracování před ním. Napište nám{contact ? <> na <a href={`mailto:${contact}`} className="underline underline-offset-4">{contact}</a></> : null};
          odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce. Stížnost můžete podat u Úřadu pro ochranu osobních údajů, Pplk. Sochora 27,
          170 00 Praha 7, uoou.gov.cz.
        </p>
        <p>
          Jak účet zrušit a jak vyřizujeme hlášení, popisují <Link href="/podminky/" className="underline underline-offset-4">podmínky užívání</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Co ukládáme ve vašem prohlížeči</h2>
        <p>
          Přihlášení drží nezbytná cookie relace. Bez účtu ukládáme váš výběr aut, uložená hledání, rozpracovaný inzerát, zvolené město, motiv
          vzhledu a vaši volbu ohledně analytiky jen ve vašem prohlížeči (localStorage); smažete je vymazáním dat webu v prohlížeči. Tlačítko
          „Použít mou polohu“ si od prohlížeče vyžádá polohu jen s vaším svolením, převede ji v zařízení na nejbližší město a souřadnice neukládá
          ani neodesílá. Údaje vyplněné do kupní smlouvy se neukládají vůbec a po zavření stránky zmizí.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Analytika (jen se souhlasem)</h2>
        <p>
          Pokud ji povolíte, používáme Google Analytics 4 od společnosti Google Ireland Ltd. ke statistice návštěvnosti: které stránky se
          zobrazují, z jakého typu zařízení a odkud návštěva přišla. Google k tomu ukládá cookies <code>_ga</code> a <code>_ga_*</code>. Údaje
          mohou být předány do USA v rámci EU-US Data Privacy Framework. Cookies Google Analytics platí až dva roky; údaje o návštěvách
          uchovává Google 14 měsíců. IP adresy GA4 neukládá. Nepoužíváme je k reklamě ani k profilování a funkci Google Signals nemáme zapnutou.
        </p>
        <p>Souhlas můžete kdykoli odvolat a cookies se tím smažou.</p>
        <p className="text-sm"><ConsentSettings /></p>
      </section>
    </div>
  );
}
