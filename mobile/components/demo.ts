// Demonstration data for the screens until the API v1 client (mobile/lib/api) lands.
// Photos are Wikimedia Commons files referenced by the catalogue; people, prices and listings are invented.

const commons = "https://upload.wikimedia.org/wikipedia/commons";
export const photos = {
  octaviaIV: `${commons}/f/f8/2022_Skoda_Octavia_SE_TSi.jpg`,
  octaviaCombi: `${commons}/7/75/%C5%A0koda_Octavia_Combi_II_1.9_TDI_%282005%29_%2852074633672%29.jpg`,
  fabiaII: `${commons}/0/0c/2009_Skoda_Fabia_silver_front.jpg`,
};

export interface DemoListing {
  id: string;
  title: string;
  price: number;
  year: number;
  km: number | null;
  fuel: string;
  gearbox: string;
  powerKw: number;
  place: string;
  age: string;
  photo: string;
  photoCount: number;
  stkUntil?: string;
  generation: string;
}

export const listings: DemoListing[] = [
  { id: "1", title: "Škoda Octavia III Combi 2.0 TDI", price: 289000, year: 2017, km: 154020, fuel: "Nafta", gearbox: "Manuál", powerKw: 110, place: "Praha 9", age: "před 2 h", photo: photos.octaviaCombi, photoCount: 14, stkUntil: "05/2027", generation: "Octavia III" },
  { id: "2", title: "Škoda Octavia III 1.6 TDI", price: 219000, year: 2015, km: 201300, fuel: "Nafta", gearbox: "Manuál", powerKw: 81, place: "Brno", age: "včera", photo: photos.octaviaIV, photoCount: 9, generation: "Octavia III" },
  { id: "3", title: "Škoda Octavia III Combi 1.5 TSI", price: 265000, year: 2018, km: null, fuel: "Benzín", gearbox: "Automat", powerKw: 110, place: "Plzeň", age: "před 3 dny", photo: photos.octaviaCombi, photoCount: 6, generation: "Octavia III" },
  { id: "4", title: "Škoda Fabia II 1.2 HTP", price: 89000, year: 2009, km: 210950, fuel: "Benzín", gearbox: "Manuál", powerKw: 51, place: "Olomouc", age: "dnes", photo: photos.fabiaII, photoCount: 8, generation: "Fabia II" },
];

export interface DemoStory {
  id: string;
  author: string;
  initials: string;
  car: string;
  when: string;
  kind: string;
  title: string;
  km: number;
  cost: number;
  likes: number;
  comments: number;
  photo?: string;
}

export const stories: DemoStory[] = [
  { id: "s1", author: "jirka_naftak", initials: "JN", car: "Octavia III Combi", when: "dnes", kind: "Oprava", title: "Výměna rozvodů a vodní pumpy", km: 186400, cost: 14200, likes: 12, comments: 4, photo: photos.octaviaIV },
  { id: "s2", author: "fabiak09", initials: "FA", car: "Fabia II", when: "21. 10.", kind: "Oprava", title: "Nová spojka po 210 tisících", km: 210950, cost: 9800, likes: 5, comments: 1 },
  { id: "s3", author: "superb_tom", initials: "ST", car: "Superb III", when: "19. 10.", kind: "Servis", title: "Pravidelný servis, olej a filtry", km: 98120, cost: 4650, likes: 3, comments: 0 },
];

export const garage = [
  { id: "g1", name: "Octavia III Combi", engine: "2.0 TDI", km: 186400, entries: 23, spent: 87400, photo: photos.octaviaCombi },
  { id: "g2", name: "Fabia II", engine: "1.2 HTP", km: 210950, entries: 9, spent: 31900, photo: photos.fabiaII },
];

export const conversations = [
  { id: "c1", title: "Octavia III Combi · 289 000 Kč", last: "Jasně, servisní knížku přivezu.", time: "18:15", unread: 1, photo: photos.octaviaCombi },
  { id: "c2", title: "Fabia II · 89 000 Kč", last: "Vy: Je možná sleva při rychlém jednání?", time: "včera", unread: 0, photo: photos.fabiaII },
  { id: "c3", title: "Hlídací pes", last: "3 nová auta podle hledání Octavia III", time: "6:00", unread: 1 },
];

export const generations = [
  { id: "octavia-4", name: "Octavia IV", years: "2020 až dosud", listings: 38, logbooks: 9 },
  { id: "octavia-3", name: "Octavia III", years: "2013–2020 · facelift 2017", listings: 128, logbooks: 41 },
  { id: "octavia-2", name: "Octavia II", years: "2004–2013 · facelift 2008", listings: 96, logbooks: 27 },
  { id: "octavia-1", name: "Octavia I", years: "1996–2010", listings: 22, logbooks: 6 },
];

export const reviewQueue = [
  { id: "r1", title: "Škoda Fabia III 1.0 TSI", price: 39000, year: 2019, km: 48000, place: "Brno", age: "před 12 min", reason: "Automatická kontrola: cena je výrazně pod trhem této generace.", photo: photos.fabiaII },
];
