// Towns used for listing locations and the "near me" filter. Coordinates are the
// approximate town centres; the first town of each region is its regional capital.

export interface City {
  slug: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
}

const RAW: [name: string, region: string, lat: number, lon: number][] = [
  ["Praha", "Praha", 50.0755, 14.4378],
  ["Kladno", "Středočeský", 50.1473, 14.1029],
  ["Mladá Boleslav", "Středočeský", 50.4114, 14.9032],
  ["Kolín", "Středočeský", 50.0281, 15.2006],
  ["Příbram", "Středočeský", 49.6899, 14.0104],
  ["Benešov", "Středočeský", 49.7816, 14.6869],
  ["Beroun", "Středočeský", 49.9638, 14.072],
  ["Kutná Hora", "Středočeský", 49.9484, 15.2682],
  ["Mělník", "Středočeský", 50.3505, 14.4741],
  ["České Budějovice", "Jihočeský", 48.9745, 14.4743],
  ["Tábor", "Jihočeský", 49.4144, 14.6578],
  ["Písek", "Jihočeský", 49.3088, 14.1475],
  ["Strakonice", "Jihočeský", 49.2614, 13.9024],
  ["Jindřichův Hradec", "Jihočeský", 49.1441, 15.003],
  ["Český Krumlov", "Jihočeský", 48.8127, 14.3175],
  ["Plzeň", "Plzeňský", 49.7384, 13.3736],
  ["Klatovy", "Plzeňský", 49.3955, 13.2951],
  ["Domažlice", "Plzeňský", 49.4405, 12.9298],
  ["Rokycany", "Plzeňský", 49.7427, 13.5946],
  ["Karlovy Vary", "Karlovarský", 50.2319, 12.872],
  ["Cheb", "Karlovarský", 50.0796, 12.3739],
  ["Sokolov", "Karlovarský", 50.1813, 12.6402],
  ["Ústí nad Labem", "Ústecký", 50.6607, 14.0323],
  ["Teplice", "Ústecký", 50.6404, 13.8245],
  ["Děčín", "Ústecký", 50.7821, 14.2148],
  ["Most", "Ústecký", 50.503, 13.6362],
  ["Chomutov", "Ústecký", 50.4605, 13.4178],
  ["Litoměřice", "Ústecký", 50.5335, 14.1318],
  ["Liberec", "Liberecký", 50.7663, 15.0543],
  ["Jablonec nad Nisou", "Liberecký", 50.7243, 15.1711],
  ["Česká Lípa", "Liberecký", 50.6855, 14.5376],
  ["Hradec Králové", "Královéhradecký", 50.2104, 15.8327],
  ["Trutnov", "Královéhradecký", 50.561, 15.9127],
  ["Náchod", "Královéhradecký", 50.4167, 16.1629],
  ["Jičín", "Královéhradecký", 50.4373, 15.3516],
  ["Pardubice", "Pardubický", 50.0343, 15.7812],
  ["Chrudim", "Pardubický", 49.9511, 15.7956],
  ["Svitavy", "Pardubický", 49.756, 16.4683],
  ["Ústí nad Orlicí", "Pardubický", 49.9739, 16.3936],
  ["Jihlava", "Vysočina", 49.3961, 15.5912],
  ["Třebíč", "Vysočina", 49.2149, 15.8817],
  ["Havlíčkův Brod", "Vysočina", 49.6078, 15.5807],
  ["Žďár nad Sázavou", "Vysočina", 49.5627, 15.9392],
  ["Brno", "Jihomoravský", 49.1951, 16.6068],
  ["Znojmo", "Jihomoravský", 48.8555, 16.0488],
  ["Břeclav", "Jihomoravský", 48.759, 16.882],
  ["Hodonín", "Jihomoravský", 48.8489, 17.1324],
  ["Blansko", "Jihomoravský", 49.363, 16.6445],
  ["Vyškov", "Jihomoravský", 49.2775, 16.999],
  ["Olomouc", "Olomoucký", 49.5938, 17.2509],
  ["Prostějov", "Olomoucký", 49.4719, 17.1118],
  ["Přerov", "Olomoucký", 49.4551, 17.4509],
  ["Šumperk", "Olomoucký", 49.9653, 16.9706],
  ["Zlín", "Zlínský", 49.2265, 17.6707],
  ["Uherské Hradiště", "Zlínský", 49.0698, 17.4597],
  ["Kroměříž", "Zlínský", 49.2979, 17.3931],
  ["Vsetín", "Zlínský", 49.3387, 17.9962],
  ["Ostrava", "Moravskoslezský", 49.8209, 18.2625],
  ["Opava", "Moravskoslezský", 49.9387, 17.9026],
  ["Frýdek-Místek", "Moravskoslezský", 49.6881, 18.3536],
  ["Karviná", "Moravskoslezský", 49.854, 18.5417],
  ["Havířov", "Moravskoslezský", 49.7798, 18.4369],
  ["Nový Jičín", "Moravskoslezský", 49.5944, 18.0103],
];

const slugify = (name: string) =>
  name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const CITIES: City[] = RAW.map(([name, region, lat, lon]) => ({ slug: slugify(name), name, region, lat, lon }));

/** Radius options in km; 0 means the town itself. */
export const RADII = [0, 25, 50, 100, 200] as const;

export function getCity(slug: string | null | undefined): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function citiesIn(region: string): City[] {
  return CITIES.filter((c) => c.region === region);
}

export function regionCapital(region: string): City | undefined {
  return CITIES.find((c) => c.region === region);
}

/** Great-circle distance in km. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function nearestCity(point: { lat: number; lon: number }): City {
  return CITIES.reduce((best, c) => (distanceKm(point, c) < distanceKm(point, best) ? c : best));
}

/** Towns from a comma-separated list of slugs ("brno,olomouc"); unknown slugs are dropped. */
export function parseCityList(value: string | null | undefined): City[] {
  const slugs = [...new Set((value ?? "").split(",").map((s) => s.trim()).filter(Boolean))];
  return slugs.map(getCity).filter((c): c is City => Boolean(c));
}

/** Distance in km from a town to the nearest of the chosen towns (Infinity if none). */
export function nearestDistance(citySlug: string, centers: City[]): number {
  const city = getCity(citySlug);
  if (!city || centers.length === 0) return Infinity;
  return Math.min(...centers.map((c) => distanceKm(city, c)));
}

/** Whether a listing in `citySlug` lies within `radius` km of any chosen town; 0 means the towns themselves. */
export function withinAny(citySlug: string, centers: City[], radius: number): boolean {
  if (radius === 0) return centers.some((c) => c.slug === citySlug);
  return nearestDistance(citySlug, centers) <= radius;
}

/** Pages that keep the location in their URL (?mesto=…&okruh=…). */
export const SEARCH_PAGE = /^\/(inzeraty|technika|moto|dily|pneumatiky)\/?$/;

/** Locative with its preposition, for phrases like "V Praze dne …" in documents. */
const LOCATIVE: Record<string, string> = {
  Praha: "v Praze", Kladno: "v Kladně", "Mladá Boleslav": "v Mladé Boleslavi", Kolín: "v Kolíně", Příbram: "v Příbrami",
  Benešov: "v Benešově", Beroun: "v Berouně", "Kutná Hora": "v Kutné Hoře", Mělník: "v Mělníku",
  "České Budějovice": "v Českých Budějovicích", Tábor: "v Táboře", Písek: "v Písku", Strakonice: "ve Strakonicích",
  "Jindřichův Hradec": "v Jindřichově Hradci", "Český Krumlov": "v Českém Krumlově", Plzeň: "v Plzni", Klatovy: "v Klatovech",
  Domažlice: "v Domažlicích", Rokycany: "v Rokycanech", "Karlovy Vary": "v Karlových Varech", Cheb: "v Chebu",
  Sokolov: "v Sokolově", "Ústí nad Labem": "v Ústí nad Labem", Teplice: "v Teplicích", Děčín: "v Děčíně", Most: "v Mostě",
  Chomutov: "v Chomutově", Litoměřice: "v Litoměřicích", Liberec: "v Liberci", "Jablonec nad Nisou": "v Jablonci nad Nisou",
  "Česká Lípa": "v České Lípě", "Hradec Králové": "v Hradci Králové", Trutnov: "v Trutnově", Náchod: "v Náchodě",
  Jičín: "v Jičíně", Pardubice: "v Pardubicích", Chrudim: "v Chrudimi", Svitavy: "ve Svitavách",
  "Ústí nad Orlicí": "v Ústí nad Orlicí", Jihlava: "v Jihlavě", Třebíč: "v Třebíči", "Havlíčkův Brod": "v Havlíčkově Brodě",
  "Žďár nad Sázavou": "ve Žďáru nad Sázavou", Brno: "v Brně", Znojmo: "ve Znojmě", Břeclav: "v Břeclavi",
  Hodonín: "v Hodoníně", Blansko: "v Blansku", Vyškov: "ve Vyškově", Olomouc: "v Olomouci", Prostějov: "v Prostějově",
  Přerov: "v Přerově", Šumperk: "v Šumperku", Zlín: "ve Zlíně", "Uherské Hradiště": "v Uherském Hradišti",
  Kroměříž: "v Kroměříži", Vsetín: "ve Vsetíně", Ostrava: "v Ostravě", Opava: "v Opavě", "Frýdek-Místek": "ve Frýdku-Místku",
  Karviná: "v Karviné", Havířov: "v Havířově", "Nový Jičín": "v Novém Jičíně",
};

/** "v Praze" for a known town name (any case, with or without diacritics), otherwise undefined. */
export function locativeOf(name: string): string | undefined {
  const key = slugify(name.trim());
  const city = CITIES.find((c) => c.slug === key);
  return city ? LOCATIVE[city.name] : undefined;
}

/** "Jihomoravský kraj", "Kraj Vysočina", "hl. m. Praha". */
export function regionLabel(region: string): string {
  if (region === "Praha") return "hl. m. Praha";
  if (region === "Vysočina") return "Kraj Vysočina";
  return `${region} kraj`;
}

/** Event that opens the location picker from anywhere on the page. */
export const OPEN_LOCATION_PICKER = "vozodrom:open-location-picker";
