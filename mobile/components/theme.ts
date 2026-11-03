import { Platform, useColorScheme, type TextStyle } from "react-native";

// Asfalt tokens, copied from the web (src/app/globals.css) so the app and vozodrom.cz read as one product.
const dark = {
  bg: "#0d0f12",
  surface: "#15181d",
  field: "#1b1f25",
  ink: "#f1f3f5",
  muted: "#9aa3ad",
  line: "#262a31",
  brand: "#2fd0a0",
  brandInk: "#05261d",
  brandSoft: "#123a30",
  accent: "#ff6a2a",
  accentInk: "#160b04",
  warn: "#ffb36b",
  warnSoft: "#3a2614",
  bad: "#ff8a80",
  good: "#4ee08f",
  scrim: "rgba(0,0,0,0.55)",
};

const light: typeof dark = {
  bg: "#f4f6f8",
  surface: "#ffffff",
  field: "#eceff3",
  ink: "#14181d",
  muted: "#5a6370",
  line: "#d9dee4",
  brand: "#0b8466",
  brandInk: "#ffffff",
  brandSoft: "#d9f3ea",
  accent: "#b83f08",
  accentInk: "#ffffff",
  warn: "#995400",
  warnSoft: "#fff0da",
  bad: "#b42318",
  good: "#17803f",
  scrim: "rgba(0,0,0,0.45)",
};

export type Colors = typeof dark;

export function useColors(): Colors {
  return useColorScheme() === "light" ? light : dark;
}

export const font = {
  regular: "Barlow_400Regular",
  medium: "Barlow_500Medium",
  semibold: "Barlow_600SemiBold",
  bold: "Barlow_700Bold",
  heavy: "Barlow_800ExtraBold",
};

/** Four sizes do the work; rank comes from weight. */
export const size = { small: 13, body: 15, title: 19, display: 30 };

export const radius = { chip: 20, field: 12, card: 16, sheet: 22 };

export const formatKm = (km: number) => `${km.toLocaleString("cs-CZ")} km`;
export const formatCzk = (czk: number) => `${czk.toLocaleString("cs-CZ")} Kč`;

/** The browser draws its own focus ring on web inputs; our fields show focus with the brand border. */
export const noWebOutline = (Platform.OS === "web" ? { outlineStyle: "none" } : {}) as TextStyle;
