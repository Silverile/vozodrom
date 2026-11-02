import type { Metadata } from "next";
import Link from "next/link";
import { OPERATOR, TERMS_EFFECTIVE, operatorLine } from "@/lib/operator";

export const metadata: Metadata = {
  title: "Podmínky užívání",
  description: "Pravidla Vozodromu: účty, příběhy aut, inzeráty, co sem nepatří, hlášení a moderace.",
};

// Terms of use, in short numbered sections, reviewed with Codex against Czech law and the DSA
// (bridge message #57). The operator's details and the effective date come from lib/operator.ts.
// A substantial change is announced by e-mail at least 30 days ahead (section 11).

type Block = string | { list: string[] };

function sections(contact: string): { id: string; title: string; body: Block[] }[] {
  return [
    {
      id: "co-je-vozodrom",
      title: "Co je Vozodrom",
      body: [
        "Vozodrom je web o autech. Majitelé si tu vedou příběhy svých aut (zápisy o opravách, úpravách, cestách a nákladech), lidé tu najdou katalog modelů a mohou si navzájem nabízet auta v inzerátech.",
        "Vozodrom poskytuje prostor pro obsah uživatelů. Není stranou kupní smlouvy mezi prodávajícím a kupujícím a nezprostředkovává platby. Kontrola inzerátu není ověřením vlastnictví vozidla, jeho technického stavu ani pravdivosti všech údajů.",
        "Používání Vozodromu je zdarma.",
      ],
    },
    {
      id: "ucet",
      title: "Účet",
      body: [
        "Číst příběhy, katalog a inzeráty může každý. Psát, komentovat, vkládat inzeráty a posílat zprávy lze s účtem, který založíte e-mailem a heslem. E-mail je potřeba ověřit.",
        "Účet si můžete založit od 15 let. Inzerát na prodej vozidla může zveřejnit pouze osoba, která dovršila 18 let a je oprávněna vozidlo prodat nebo jednat za prodávajícího.",
        "Účet zakládá fyzická osoba pro sebe, případně osoba oprávněná jednat za podnikatele. Přístupové údaje nesdílejte a chraňte je. Pokud máte podezření na zneužití účtu, co nejdříve nám napište. Odpovědnost za případnou újmu se posuzuje podle zákona.",
        `O zrušení účtu můžete kdykoli požádat na ${contact}, nejlépe z registrované adresy. Pokud k ní nemáte přístup, domluvíme jiné přiměřené ověření totožnosti. Na žádost týkající se osobních údajů odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce; o případném zákonném prodloužení vás v této lhůtě informujeme. Některé údaje můžeme po nezbytnou dobu uchovat kvůli zákonným povinnostem nebo ochraně práv. Podrobnosti uvádíme v zásadách ochrany soukromí.`,
      ],
    },
    {
      id: "obsah",
      title: "Váš obsah",
      body: [
        "Za to, co na Vozodrom napíšete nebo nahrajete (zápisy, fotografie, komentáře, inzeráty, zprávy), odpovídáte vy. Vkládejte jen to, k čemu máte práva: vlastní fotky a texty, nebo cizí se svolením autora.",
        "Práva k obsahu zůstávají vám nebo jejich nositelům. Zveřejněním obsahu nám poskytujete bezúplatnou a nevýhradní licenci pro jeho ukládání, rozmnožování a zpřístupňování na Vozodromu, včetně náhledů sdílených odkazů. Licence platí celosvětově po dobu zveřejnění obsahu a jen v rozsahu potřebném k provozu služby. Smíme provést nezbytné technické úpravy velikosti a formátu, které nemění smysl obsahu, a v potřebném rozsahu zapojit poskytovatele hostingu a dalších technických služeb. Soukromé zprávy nezveřejňujeme ani nepoužíváme k propagaci.",
        "Pokud budeme chtít váš příspěvek použít na sociálních sítích Vozodromu, předem vás požádáme o samostatné svolení ke konkrétnímu použití. Odmítnutí nemá vliv na váš účet.",
        "Po odstranění obsahu ukončíme jeho veřejné užívání. Technické kopie uchováváme jen po nezbytnou dobu podle pravidel zálohování a ochrany práv.",
      ],
    },
    {
      id: "co-sem-nepatri",
      title: "Co sem nepatří",
      body: [
        "Odstraníme nebo omezíme obsah, který je nezákonný nebo porušuje tyto podmínky, zejména:",
        {
          list: [
            "podvodné nabídky, nabízení kradených vozidel, padělané doklady a úmyslně nepravdivé údaje;",
            "nabídky nebo návody, jak stočit tachometr, obejít STK nebo emisní předpisy;",
            "neoprávněné zveřejňování cizích soukromých údajů nebo podobizen a jiné neoprávněné zásahy do práv třetích osob;",
            "urážky, vyhrožování, nenávistné projevy a zesměšňování lidí;",
            "obsah porušující autorská práva, ochranné známky nebo obchodní tajemství;",
            "reklamu a odkazy mimo inzeráty, spam a opakované vkládání stejného obsahu;",
            "pornografii, násilí a jiný obsah, který na web o autech nepatří.",
          ],
        },
      ],
    },
    {
      id: "inzeraty",
      title: "Inzeráty",
      body: [
        "Inzerovat můžete auto, které je vaše, nebo které smíte prodat. Údaje (rok, nájezd, výbava, stav, historie) uvádějte pravdivě a úplně, vady nezamlčujte. Cena je vždy cena při platbě najednou.",
        "Prodáváte-li v rámci podnikání, tuto skutečnost a svou identitu v inzerátu jasně uveďte. Pokud kupující jedná jako spotřebitel, odpovídáte za dodržení jeho spotřebitelských práv. Tato práva z kupní smlouvy uplatňuje u vás jako prodávajícího.",
        "Nový nebo upravený inzerát vyhodnotí automatická kontrola. Ta zohledňuje zejména podezřelý obsah, cenové odchylky a historii účtu. Některé inzeráty se zveřejní automaticky, jiné čekají na posouzení moderátorem. Podezření samo o sobě neznamená prokázaný podvod.",
        "Kupní smlouvu uzavírají prodávající a kupující mezi sebou. Doporučujeme auto před koupí prohlédnout, ověřit doklady a historii a nic neplatit předem.",
      ],
    },
    {
      id: "hlaseni",
      title: "Hlášení a moderace",
      body: [
        `Podezření na nezákonný obsah nám můžete oznámit tlačítkem „Nahlásit“ u obsahu nebo bez účtu na ${contact}. Uveďte přesný odkaz či jiné jednoznačné označení obsahu, vysvětlení důvodu a potvrzení, že oznámení podle vašeho nejlepšího vědomí obsahuje přesné a úplné informace. Zpravidla připojte jméno a e-mail; u oznámení trestných činů sexuálního zneužívání a vykořisťování dětí podle čl. 3 až 7 směrnice 2011/93/EU je nevyžadujeme. Máme-li váš elektronický kontakt, potvrdíme přijetí a oznámíme výsledek i dostupné možnosti nápravy.`,
        "Obsah můžeme dočasně skrýt, odstranit nebo jinak omezit. Zásah volíme podle konkrétních okolností, závažnosti a opakování porušení. Dočasné skrytí může nastat také automaticky po opakovaných hlášeních; následně je posoudí moderátor.",
        `Při omezení sdělíme dotčenému uživateli jeho rozsah, důvody, případnou dobu trvání, použité zákonné nebo smluvní pravidlo a informaci o využití automatických nástrojů. Vysvětlíme dostupné možnosti nápravy. O přezkoumání můžete požádat na ${contact}; žádost posoudí člověk. Možnost obrátit se na soud tím není dotčena.`,
        "Proti spamu a technickému zahlcení používáme přiměřená opatření. Tím nesmí být znemožněno oznámení konkrétního nezákonného obsahu.",
        "Obsah uživatelů plošně průběžně nesledujeme. Tím nejsou dotčeny naše povinnosti vyřizovat oznámení a postupovat podle právních předpisů. Podezření na trestný čin ohrožující život nebo bezpečnost osob oznamujeme příslušným orgánům.",
      ],
    },
    {
      id: "katalog",
      title: "Katalog, data a rady",
      body: [
        "Údaje v katalogu skládáme z veřejných zdrojů (Wikidata, Wikipedie, materiály výrobců) a statistiky z otevřených dat Ministerstva dopravy. Snažíme se o přesnost, ale konkrétní auto se může lišit; chybu nám prosím napište.",
        "Články a rady jsou obecné informace, ne odborná ani právní rada pro váš případ. Zápisy majitelů jsou jejich zkušenosti.",
      ],
    },
    {
      id: "odpovednost",
      title: "Odpovědnost a dostupnost",
      body: [
        "Služba může být dočasně nedostupná, například kvůli údržbě nebo poruše. Nejsme stranou obchodů mezi uživateli a nezaručujeme splnění jejich vzájemných závazků. Za vlastní jednání a plnění našich zákonných povinností odpovídáme podle zákona. Těmito podmínkami neomezujeme práva, která nelze smluvně vyloučit.",
      ],
    },
    {
      id: "osobni-udaje",
      title: "Osobní údaje a e-maily",
      body: [
        "Jak zacházíme s osobními údaji a cookies, popisuje stránka Ochrana soukromí a cookies.",
        "Registrace ani přijetí těchto podmínek nejsou souhlasem se zasíláním reklamních e-mailů. Provozní zprávy související s účtem, bezpečností a vyřizováním vašich žádostí posíláme v rámci poskytování služby.",
      ],
    },
    {
      id: "kontakt",
      title: "Kontakt pro uživatele a úřady",
      body: [
        `Elektronickým kontaktním místem podle čl. 11 a 12 nařízení o digitálních službách (DSA) pro uživatele, orgány členských států EU, Evropskou komisi a Evropský sbor pro digitální služby je ${contact}. Komunikujeme česky a anglicky. Na zprávy odpovídá člověk.`,
      ],
    },
    {
      id: "zmeny",
      title: "Změny podmínek a řešení sporů",
      body: [
        `Podmínky můžeme v přiměřeném rozsahu měnit kvůli změně právních předpisů, nezbytným technickým změnám nebo úpravě funkcí služby. O podstatné změně vás informujeme e-mailem alespoň 30 dnů před její účinností, případně s delší lhůtou vyžadovanou zákonem. Kratší lhůtu použijeme pouze v případech dovolených právními předpisy. Změnu můžete odmítnout a smlouvu před její účinností bez sankce ukončit oznámením na ${contact}. Zpoplatnění služby nebo rozšíření licence k vašemu obsahu neprovedeme bez samostatné dohody.`,
        "Podmínky se řídí právem České republiky. Tím nejsou dotčena práva, která spotřebiteli dává právo státu, kde má bydliště.",
        "Pokud mezi vámi jako spotřebitelem a provozovatelem vznikne spor ze smlouvy o poskytování služby Vozodromu, který se nepodaří vyřešit přímo, můžete podat návrh na mimosoudní řešení u České obchodní inspekce, oddělení ADR, Gorazdova 1969/24, 120 00 Praha 2. Informace a formulář jsou na coi.gov.cz/mimosoudni-reseni-spotrebitelskych-sporu-adr/. Tím není dotčeno vaše právo obrátit se na soud. Spory z koupě vozidla řešíte s prodávajícím; provozovatel není stranou této kupní smlouvy.",
      ],
    },
  ];
}

export default function TermsPage() {
  const operator = operatorLine();
  const contact = OPERATOR.email || "kontaktní e-mail uvedený výše";
  const list = sections(contact);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Podmínky užívání</h1>
      <p className="mt-3 text-lg text-[var(--color-muted)]">{TERMS_EFFECTIVE ? `Platné od ${TERMS_EFFECTIVE}.` : "Datum účinnosti doplníme při zveřejnění."}</p>

      <div className="mt-6 rounded-[14px] bg-[var(--color-surface)] p-5 text-base">
        <p>
          <b>Provozovatel:</b> {operator ?? "údaje provozovatele doplníme"}
        </p>
        <p className="mt-1">
          <b>Kontaktní e-mail:</b>{" "}
          {OPERATOR.email ? <a href={`mailto:${OPERATOR.email}`} className="underline underline-offset-4">{OPERATOR.email}</a> : "doplníme"}
        </p>
      </div>

      <nav aria-label="Obsah" className="mt-8">
        <ol className="sm:columns-2 gap-x-8 space-y-1 text-base">
          {list.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:text-[var(--color-brand)]">{i + 1}. {s.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {list.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-2xl font-bold">{i + 1}. {s.title}</h2>
            <div className="mt-3 space-y-3 text-base leading-relaxed">
              {s.body.map((b, k) =>
                typeof b === "string" ? (
                  <p key={k}>{b}</p>
                ) : (
                  <ul key={k} className="list-disc pl-6 space-y-1.5">
                    {b.list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ),
              )}
              {s.id === "osobni-udaje" && (
                <p>
                  <Link href="/soukromi/" className="font-semibold underline underline-offset-4">Ochrana soukromí a cookies →</Link>
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
