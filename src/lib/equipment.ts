// Car equipment ("výbava") sellers can tick. A listing stores the keys; search, cards and filters
// work with the Czech labels, which stay the same strings test and feed listings already used
// ("Navigace", "Tažné zařízení"…), so old links like ?vybava=Navigace keep working. Free text
// from feeds is mapped through the aliases; anything unknown is kept as it was written.

export type EquipmentGroup = "Bezpečnost" | "Komfort" | "Multimédia" | "Exteriér" | "Historie a stav";

export interface EquipmentItem {
  key: string;
  label: string;
  group: EquipmentGroup;
  /** other ways sellers and feeds write it, compared without diacritics and case */
  aliases?: string[];
}

export const EQUIPMENT_GROUPS: EquipmentGroup[] = ["Bezpečnost", "Komfort", "Multimédia", "Exteriér", "Historie a stav"];

export const EQUIPMENT: EquipmentItem[] = [
  { key: "abs", label: "ABS", group: "Bezpečnost" },
  { key: "esp", label: "ESP", group: "Bezpečnost", aliases: ["stabilizace", "esc"] },
  { key: "airbagy-bocni", label: "Boční airbagy", group: "Bezpečnost" },
  { key: "isofix", label: "Isofix", group: "Bezpečnost" },
  { key: "asistent-pruhu", label: "Asistent jízdy v pruhu", group: "Bezpečnost", aliases: ["lane assist"] },
  { key: "nouzove-brzdeni", label: "Nouzové brzdění", group: "Bezpečnost", aliases: ["front assist"] },
  { key: "mrtvy-uhel", label: "Hlídání mrtvého úhlu", group: "Bezpečnost", aliases: ["blind spot"] },
  { key: "parkovaci-senzory", label: "Parkovací senzory", group: "Bezpečnost", aliases: ["parkovaci cidla", "pdc"] },
  { key: "parkovaci-kamera", label: "Parkovací kamera", group: "Bezpečnost", aliases: ["couvaci kamera"] },
  { key: "kamera-360", label: "Kamera 360°", group: "Bezpečnost" },

  { key: "klimatizace", label: "Klimatizace", group: "Komfort", aliases: ["klima"] },
  { key: "automaticka-klimatizace", label: "Automatická klimatizace", group: "Komfort", aliases: ["klimatronic", "climatronic"] },
  { key: "tempomat", label: "Tempomat", group: "Komfort" },
  { key: "adaptivni-tempomat", label: "Adaptivní tempomat", group: "Komfort", aliases: ["acc"] },
  { key: "elektricka-okna", label: "Elektrická okna", group: "Komfort", aliases: ["el. okna", "elektricke stahovani oken"] },
  { key: "elektricka-zrcatka", label: "Elektrická zrcátka", group: "Komfort", aliases: ["el. zrcatka"] },
  { key: "vyhrivana-sedadla", label: "Vyhřívaná sedadla", group: "Komfort" },
  { key: "vyhrivany-volant", label: "Vyhřívaný volant", group: "Komfort" },
  { key: "elektricka-sedadla", label: "Elektricky nastavitelná sedadla", group: "Komfort" },
  { key: "kuze", label: "Kožené čalounění", group: "Komfort", aliases: ["kuze", "kozena sedadla"] },
  { key: "bezklicove-odemykani", label: "Bezklíčové odemykání", group: "Komfort", aliases: ["keyless"] },
  { key: "start-tlacitkem", label: "Startování tlačítkem", group: "Komfort", aliases: ["start stop tlacitko"] },
  { key: "elektricke-vika", label: "Elektrické víko kufru", group: "Komfort" },
  { key: "panorama", label: "Panoramatická střecha", group: "Komfort" },
  { key: "stresni-okno", label: "Střešní okno", group: "Komfort", aliases: ["sibr"] },
  { key: "nezavisle-topeni", label: "Nezávislé topení", group: "Komfort", aliases: ["webasto"] },

  { key: "navigace", label: "Navigace", group: "Multimédia", aliases: ["gps"] },
  { key: "carplay", label: "Apple CarPlay / Android Auto", group: "Multimédia", aliases: ["apple carplay", "android auto", "carplay"] },
  { key: "bluetooth", label: "Bluetooth", group: "Multimédia", aliases: ["hands free", "handsfree"] },
  { key: "dab", label: "DAB rádio", group: "Multimédia", aliases: ["dab"] },
  { key: "head-up", label: "Head-up displej", group: "Multimédia", aliases: ["hud"] },
  { key: "digitalni-pristroje", label: "Digitální přístrojový štít", group: "Multimédia", aliases: ["virtual cockpit"] },
  { key: "ozvuceni", label: "Prémiové ozvučení", group: "Multimédia" },

  { key: "led", label: "LED světlomety", group: "Exteriér", aliases: ["led svetla"] },
  { key: "xenon", label: "Xenonové světlomety", group: "Exteriér", aliases: ["xenony", "bixenon"] },
  { key: "lita-kola", label: "Litá kola", group: "Exteriér", aliases: ["alu kola", "alu disky"] },
  { key: "tazne", label: "Tažné zařízení", group: "Exteriér", aliases: ["tazne"] },
  { key: "stresni-nosic", label: "Střešní nosič", group: "Exteriér", aliases: ["stresni ralling", "podelniky"] },
  { key: "tonovana-skla", label: "Tónovaná skla", group: "Exteriér" },
  { key: "mlhovky", label: "Mlhovky", group: "Exteriér" },

  { key: "servisni-knizka", label: "Servisní knížka", group: "Historie a stav", aliases: ["servisni historie"] },
  { key: "prvni-majitel", label: "První majitel", group: "Historie a stav", aliases: ["1. majitel"] },
  { key: "koupeno-v-cr", label: "Koupeno v ČR", group: "Historie a stav", aliases: ["koupeno v cr"] },
  { key: "garazovano", label: "Garážováno", group: "Historie a stav" },
  { key: "zimni-pneu", label: "Sada zimních pneumatik", group: "Historie a stav", aliases: ["zimni pneu", "zimni kola"] },
];

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const BY_KEY = new Map(EQUIPMENT.map((e) => [e.key, e]));
const BY_NAME = new Map(EQUIPMENT.flatMap((e) => [e.label, ...(e.aliases ?? [])].map((name) => [fold(name), e] as const)));

/** Keys known to the dictionary, in dictionary order, without repeats. */
export function cleanEquipment(keys: unknown): string[] {
  if (!Array.isArray(keys)) return [];
  const wanted = new Set(keys.filter((k): k is string => typeof k === "string"));
  return EQUIPMENT.filter((e) => wanted.has(e.key)).map((e) => e.key);
}

/** Labels of stored keys, for listings, cards and the search filter. */
export const equipmentLabels = (keys: string[] | undefined): string[] => (keys ?? []).flatMap((k) => BY_KEY.get(k)?.label ?? []);

/** A feed's or old listing's free text as the dictionary label, or the text itself when unknown. */
export const equipmentLabel = (text: string): string => BY_NAME.get(fold(text))?.label ?? text.trim();

/** Does an item match what the seller typed into the equipment search? */
export const equipmentMatches = (item: EquipmentItem, query: string): boolean =>
  !query.trim() || [item.label, ...(item.aliases ?? [])].some((name) => fold(name).includes(fold(query)));
