// Guides for the "Novinky a rady" section. Practical, evergreen articles rather than invented
// news about real companies; legal facts are taken from the statutes and ministry pages that
// the přepis guide and the contract were checked against (October 2026).

export type ArticleCategory = "Rady" | "Úřady" | "Elektromobily" | "Pneumatiky";

export interface Block {
  heading?: string;
  text?: string;
  list?: string[];
  link?: { href: string; label: string };
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: string;
  perex: string;
  date: string;
  /** CategoryIcon slug used as the cover picture */
  icon: string;
  body: Block[];
  sources?: string[];
}

export const articles: Article[] = [
  {
    slug: "zimni-pneumatiky-kdy-jsou-povinne",
    category: "Pneumatiky",
    title: "Zimní pneumatiky: kdy jsou povinné a jaký musí mít dezén",
    perex: "Od listopadu do března rozhoduje stav silnice, ne kalendář. A na hloubce dezénu záleží víc, než se zdá.",
    date: "2026-10-24",
    icon: "zimni",
    body: [
      { text: "Povinnost zimních pneumatik v Česku platí od 1. listopadu do 31. března, ale jen za určitých podmínek. Nestačí tedy, že je listopad; nestačí ani, že je teplo." },
      { heading: "Kdy musíte mít zimní pneumatiky", list: [
        "na silnici je souvislá vrstva sněhu, led nebo námraza,",
        "nebo se dá podle počasí předpokládat, že se během jízdy objeví.",
      ] },
      { heading: "Minimální hloubka dezénu", list: [
        "osobní auta a vozidla do 3,5 t: alespoň 4 mm,",
        "vozidla nad 3,5 t: alespoň 6 mm.",
      ] },
      { text: "Měří se v hlavních drážkách dezénu. Nové zimní pneumatiky mívají kolem 8 až 9 mm, takže 4 mm je hranice, kdy už je čas na novou sadu." },
      { link: { href: "/pneumatiky/?kategorie=zimni", label: "Zimní pneumatiky v inzerci" } },
    ],
    sources: ["zákon č. 361/2000 Sb., § 40a"],
  },
  {
    slug: "prepis-vozidla-krok-za-krokem",
    category: "Úřady",
    title: "Přepis auta krok za krokem: lhůta, doklady a poplatky",
    perex: "Na přepis máte 10 pracovních dnů. Online přes Portál dopravy ušetříte 160 Kč, návštěvě úřadu se ale nevyhnete.",
    date: "2026-10-23",
    icon: "urad",
    body: [
      { text: "Žádost o zápis změny vlastníka se podává do 10 pracovních dnů ode dne převodu vlastnického práva. Správní poplatek za osobní auto je 800 Kč, při podání přes Portál dopravy 640 Kč." },
      { heading: "Co si připravit", list: [
        "doklady totožnosti obou stran,",
        "osvědčení o registraci vozidla (ORV) a technický průkaz, pokud byl vydán,",
        "kupní smlouvu a plnou moc, pokud za někoho jednáte,",
        "platné povinné ručení kupujícího.",
      ] },
      { text: "U starších aut s emisní normou Euro 2 a nižší může při převodu vzniknout emisní poplatek 3 000 až 10 000 Kč." },
      { link: { href: "/prepis-vozidla/", label: "Podrobný průvodce přepisem" } },
    ],
    sources: ["zákon č. 56/2001 Sb., § 8", "portal.gov.cz — Zápis změny vlastníka vozidla"],
  },
  {
    slug: "kupni-smlouva-na-auto-na-co-nezapomenout",
    category: "Rady",
    title: "Kupní smlouva na auto: na co nezapomenout",
    perex: "VIN, stav tachometru, známé vady a způsob platby. A pozor na limit pro platbu v hotovosti.",
    date: "2026-10-21",
    icon: "dokument",
    body: [
      { heading: "Co ve smlouvě nesmí chybět", list: [
        "údaje obou stran a jednoznačná identifikace auta: VIN, registrační značka, číslo ORV,",
        "stav tachometru při předání a prohlášení prodávajícího k jeho pravdivosti,",
        "známé vady, každou zvlášť,",
        "kupní cena, způsob a termín platby, datum předání,",
        "kdo a kdy podá žádost o přepis.",
      ] },
      { heading: "Hotovost jen do 270 000 Kč", text: "Platbu vyšší než 270 000 Kč je nutné provést bezhotovostně. Do limitu se počítají všechny platby téhož plátce témuž příjemci během jednoho dne." },
      { link: { href: "/kupni-smlouva/", label: "Vyplnit kupní smlouvu" } },
    ],
    sources: ["zákon č. 89/2012 Sb., § 2079 a násl.", "zákon č. 254/2004 Sb., § 4"],
  },
  {
    slug: "jak-poznat-stoceny-tachometr",
    category: "Rady",
    title: "Jak poznat stočený tachometr",
    perex: "Historie z technických kontrol, servisní záznamy a opotřebení interiéru řeknou víc než slib prodejce.",
    date: "2026-10-19",
    icon: "lupa",
    body: [
      { text: "Stav tachometru se zapisuje při každé technické kontrole. Když nájezd mezi dvěma kontrolami klesne, je to varovný signál." },
      { heading: "Co porovnat", list: [
        "záznamy z technických kontrol podle VIN,",
        "servisní knížku a faktury s datem a nájezdem,",
        "opotřebení volantu, řadicí páky, pedálů a sedadla řidiče,",
        "přiměřenost nájezdu ke stáří auta.",
      ] },
      { text: "U inzerátů na vozodromu ukazujeme, zda nájezd mezi datovanými kontrolami neklesl. Aktuální stav to ale nepotvrzuje: prohlídku a zkušební jízdu nic nenahradí." },
      { link: { href: "/inzeraty/", label: "Prohlédnout inzeráty se záznamy STK" } },
    ],
  },
  {
    slug: "ojety-elektromobil-stav-baterie",
    category: "Elektromobily",
    title: "Ojetý elektromobil: jak ověřit stav baterie",
    perex: "Kapacita baterie rozhoduje o dojezdu i ceně. Chtějte datovaný protokol, ne odhad z palubního počítače.",
    date: "2026-10-16",
    icon: "baterie",
    body: [
      { text: "Stav baterie se vyjadřuje jako SoH (state of health): kolik procent původní kapacity baterie ještě má." },
      { heading: "Na co se ptát", list: [
        "protokol z diagnostiky s datem a metodou měření,",
        "do kdy platí záruka na baterii a za jakých podmínek,",
        "jak se auto nabíjelo: časté rychlonabíjení baterii zatěžuje víc.",
      ] },
      { text: "Ve vozodromu u elektromobilů zobrazujeme SoH jen tehdy, když ho prodejce doloží protokolem. Bez testu ho neodhadujeme." },
      { link: { href: "/inzeraty/?palivo=elektro", label: "Elektromobily v inzerci" } },
    ],
  },
  {
    slug: "evidencni-kontrola-od-cervence-2025",
    category: "Úřady",
    title: "Evidenční kontrola: co se změnilo od července 2025",
    perex: "Platnost evidenční kontroly se řídí lhůtami technických prohlídek, takže u většiny ojetin ji při přepisu nepotřebujete.",
    date: "2026-10-12",
    icon: "dokument",
    body: [
      { text: "Od 1. 7. 2025 platí evidenční kontrola ve lhůtách stanovených pro technickou prohlídku. Pravidelná technická prohlídka ji v sobě zahrnuje." },
      { text: "Pokud tedy auto prošlo technickou prohlídkou a ta je platná, samostatnou evidenční kontrolu k přepisu obvykle nepotřebujete. Pokud platná není, zajistěte ji na stanici technické kontroly." },
      { link: { href: "/prepis-vozidla/", label: "Průvodce přepisem" } },
    ],
    sources: ["Ministerstvo dopravy — prodloužená platnost evidenční kontroly", "zákon č. 56/2001 Sb., § 10"],
  },
];

/** Reading time in minutes at about 180 words a minute (Czech prose). */
export function readingMinutes(article: Article): number {
  const text = [article.perex, ...article.body.flatMap((b) => [b.heading, b.text, ...(b.list ?? [])])].filter(Boolean).join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 180));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
