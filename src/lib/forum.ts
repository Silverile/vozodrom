// Test forum: a handful of threads that show the planned structure. Every author and post is
// invented and labelled as a test post; real posting needs accounts, moderation and the
// notice-and-action process described on /forum/pravidla/.

export interface ForumCategory {
  slug: string;
  label: string;
  description: string;
}

export interface Post {
  author: string;
  date: string;
  text: string;
  /** marked by the thread author as the answer that helped */
  solution?: boolean;
}

export interface Thread {
  slug: string;
  category: string;
  title: string;
  views: number;
  /** catalogue model the thread is about, if any */
  model?: { brand: string; model: string };
  posts: Post[];
}

export const FORUM_CATEGORIES: ForumCategory[] = [
  { slug: "vyber-auta", label: "Výběr auta", description: "Co koupit, srovnání modelů a motorů, rady před koupí." },
  { slug: "technika", label: "Technika a opravy", description: "Závady, servis, údržba a díly." },
  { slug: "elektromobily", label: "Elektromobily a hybridy", description: "Baterie, nabíjení, dojezd a provoz." },
  { slug: "urady", label: "Úřady a legislativa", description: "Přepis, STK, pojištění a smlouvy." },
  { slug: "pneumatiky", label: "Pneumatiky a kola", description: "Výběr pneumatik, rozměry, sezónní přezouvání." },
];

const T = "Testovací uživatel";

export const threads: Thread[] = [
  {
    slug: "octavia-combi-15-tsi-nebo-20-tdi",
    category: "vyber-auta",
    title: "Octavia Combi: 1.5 TSI, nebo 2.0 TDI na 15 tisíc km ročně?",
    views: 1840,
    model: { brand: "skoda", model: "octavia" },
    posts: [
      { author: `${T} 214`, date: "2026-10-22", text: "Ročně najezdím kolem 15 tisíc km, většinou okresky a občas dálnice. Vyplatí se ještě diesel, nebo brát benzín?" },
      { author: `${T} 87`, date: "2026-10-22", text: "Při takovém nájezdu bych bral benzín. Rozdíl ve spotřebě vám vyšší pořizovací cenu a dražší servis dieselu za pár let nevrátí.", solution: true },
      { author: `${T} 530`, date: "2026-10-23", text: "Záleží i na tom, kolik jezdíte krátké trasy. Na samé krátké jízdy se diesel s filtrem pevných částic moc nehodí." },
    ],
  },
  {
    slug: "na-co-se-divat-pri-prohlidce-ojeteho-auta",
    category: "vyber-auta",
    title: "Na co se dívat při prohlídce ojetého auta?",
    views: 3120,
    posts: [
      { author: `${T} 19`, date: "2026-10-18", text: "Jdu se poprvé sám podívat na ojeté auto. Máte nějaký checklist?" },
      { author: `${T} 402`, date: "2026-10-18", text: "Doklady a VIN na karoserii, historie STK a nájezdu, servisní knížka, studený start motoru, rovnoměrné mezery karoserie a stav pneumatik. A vždycky zkušební jízda.", solution: true },
      { author: `${T} 77`, date: "2026-10-19", text: "Doplním: nechte si auto prověřit v nezávislém servisu, stojí to pár stovek a ušetří starosti." },
    ],
  },
  {
    slug: "kodiaq-nebo-tiguan-pro-rodinu",
    category: "vyber-auta",
    title: "Kodiaq, nebo Tiguan pro rodinu se dvěma dětmi?",
    views: 960,
    model: { brand: "skoda", model: "kodiaq" },
    posts: [
      { author: `${T} 655`, date: "2026-10-20", text: "Hledáme SUV do 700 tisíc, dvě děti, kočárek a pes. Kodiaq má větší kufr, ale líbí se mi i Tiguan." },
      { author: `${T} 301`, date: "2026-10-21", text: "S kočárkem a psem bych bral Kodiaq, ten prostor navíc oceníte hlavně na dovolené." },
    ],
  },
  {
    slug: "klepani-podvozku-pri-prejezdu-retarderu",
    category: "technika",
    title: "Klepání v podvozku při přejezdu retardérů",
    views: 1410,
    posts: [
      { author: `${T} 88`, date: "2026-10-15", text: "Při přejezdu retardérů mi vpředu klepe. Co bývá nejčastější příčina?" },
      { author: `${T} 190`, date: "2026-10-15", text: "Nejčastěji tyčky stabilizátoru nebo silentbloky ramen. Nechte to zkontrolovat na zvedáku, dá se to rychle najít." , solution: true },
    ],
  },
  {
    slug: "kdy-menit-rozvody",
    category: "technika",
    title: "Kdy měnit rozvody, když výrobce uvádí delší interval?",
    views: 2270,
    posts: [
      { author: `${T} 45`, date: "2026-10-12", text: "Mám ojetinu bez záznamu o výměně rozvodů. Měnit hned, nebo věřit intervalu?" },
      { author: `${T} 612`, date: "2026-10-12", text: "Bez dokladu o výměně bych to bral jako nevyměněné a nechal udělat hned. Je to levnější než oprava motoru." , solution: true },
      { author: `${T} 33`, date: "2026-10-13", text: "Souhlas, a rovnou s vodní pumpou, pokud ji pohání rozvody." },
    ],
  },
  {
    slug: "soh-baterie-pri-koupi-ojeteho-elektromobilu",
    category: "elektromobily",
    title: "Jak ověřit stav baterie (SoH) u ojetého elektromobilu?",
    views: 1990,
    posts: [
      { author: `${T} 501`, date: "2026-10-21", text: "Prodejce tvrdí, že baterie je jako nová. Jak to ověřit?" },
      { author: `${T} 118`, date: "2026-10-21", text: "Chtějte protokol z diagnostiky s datem, ideálně z autorizovaného servisu. Odhad z palubního počítače nebo z dojezdu nestačí.", solution: true },
      { author: `${T} 9`, date: "2026-10-22", text: "A podívejte se, do kdy platí záruka na baterii. Často je delší než na zbytek auta." },
    ],
  },
  {
    slug: "nabijeni-doma-bez-wallboxu",
    category: "elektromobily",
    title: "Nabíjení doma ze zásuvky, nebo wallbox?",
    views: 870,
    posts: [
      { author: `${T} 266`, date: "2026-10-17", text: "Najezdím 40 km denně. Stačí obyčejná zásuvka?" },
      { author: `${T} 402`, date: "2026-10-18", text: "Na 40 km denně přes noc většinou stačí, ale nechte elektrikáře zkontrolovat okruh, nabíjení zatěžuje zásuvku hodiny v kuse." },
    ],
  },
  {
    slug: "prepis-kdyz-prodavajici-nespolupracuje",
    category: "urady",
    title: "Prodávající nechce jít na přepis, co teď?",
    views: 2640,
    posts: [
      { author: `${T} 700`, date: "2026-10-19", text: "Koupil jsem auto, zaplatil, ale prodávající se na úřad pořád nemá. Lhůta běží." },
      { author: `${T} 81`, date: "2026-10-19", text: "Zákon na to pamatuje: když druhá strana v lhůtě nespolupracuje, můžete požádat o zápis sám (§ 8a zákona 56/2001 Sb.). Úřad pak vyzve prodávajícího. Víc v průvodci přepisem na tomto webu.", solution: true },
    ],
  },
  {
    slug: "pojisteni-pri-koupi-auta",
    category: "urady",
    title: "Od kdy musí mít kupující povinné ručení?",
    views: 1120,
    posts: [
      { author: `${T} 145`, date: "2026-10-14", text: "Auto přebírám až příští týden. Kdy si mám sjednat ručení?" },
      { author: `${T} 77`, date: "2026-10-14", text: "Nejpozději k převzetí, aby nevznikla mezera v pojištění. Prodávající pak svoji pojišťovnu informuje o změně vlastníka.", solution: true },
    ],
  },
  {
    slug: "celorocni-pneumatiky-ano-ci-ne",
    category: "pneumatiky",
    title: "Celoroční pneumatiky do města: ano, nebo ne?",
    views: 1530,
    posts: [
      { author: `${T} 230`, date: "2026-10-10", text: "Jezdím hlavně po Praze, na hory skoro vůbec. Má smysl řešit dvě sady?" },
      { author: `${T} 512`, date: "2026-10-11", text: "Pro město a nížiny jsou kvalitní celoročky rozumný kompromis. Hlídejte jen, aby měly symbol vločky v hoře (3PMSF).", solution: true },
    ],
  },
  {
    slug: "stari-pneumatik-dot",
    category: "pneumatiky",
    title: "Kupuji použité pneumatiky, jak staré ještě brát?",
    views: 780,
    posts: [
      { author: `${T} 61`, date: "2026-10-09", text: "Nabízí mi letní sadu s dezénem 6 mm, ale DOT je z roku 2020." },
      { author: `${T} 340`, date: "2026-10-09", text: "Kromě dezénu sledujte i stáří a praskliny na bocích. Šest let staré pneumatiky bych kupoval jen levně a po důkladné prohlídce." },
    ],
  },
];

export function getThread(slug: string): Thread | undefined {
  return threads.find((t) => t.slug === slug);
}

export function threadsIn(category: string): Thread[] {
  return threads.filter((t) => t.category === category);
}

export const lastActivity = (t: Thread) => t.posts[t.posts.length - 1].date;
