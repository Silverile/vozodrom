import { Image } from "expo-image";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { Icon, type IconName } from "./icons";
import { font, formatCzk, formatKm, radius, size, useColors, type Colors } from "./theme";
import type { CardListing } from "./data";

type Tone = "ink" | "muted" | "brand" | "accent" | "warn" | "bad";

export function T({ children, s = "body", w = "medium", tone = "ink", style, lines }: {
  children: ReactNode;
  s?: keyof typeof size;
  w?: keyof typeof font;
  tone?: Tone;
  style?: TextStyle;
  lines?: number;
}) {
  const c = useColors();
  const color = { ink: c.ink, muted: c.muted, brand: c.brand, accent: c.accent, warn: c.warn, bad: c.bad }[tone];
  return (
    <Text numberOfLines={lines} style={[{ fontFamily: font[w], fontSize: size[s], color, lineHeight: size[s] * 1.3, fontVariant: ["tabular-nums"] }, style]}>
      {children}
    </Text>
  );
}

export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return <View style={[{ flex: 1, backgroundColor: c.bg }, style]}>{children}</View>;
}

/** Back button + title; the back target is a 44 pt square. */
export function TopBar({ title, right, closeIcon, onClose }: { title: string; right?: ReactNode; closeIcon?: boolean; onClose?: () => void }) {
  const c = useColors();
  return (
    <View style={styles.topBar}>
      <Pressable accessibilityRole="button" accessibilityLabel={closeIcon ? "Zavřít" : "Zpět"} onPress={onClose ?? (() => router.back())} style={styles.iconButton} hitSlop={6}>
        <Icon name={closeIcon ? "close" : "back"} color={c.ink} size={24} />
      </Pressable>
      <T s="title" w="bold" style={{ flex: 1 }} lines={1}>{title}</T>
      {right}
    </View>
  );
}

export function IconButton({ name, label, onPress, filled }: { name: IconName; label: string; onPress?: () => void; filled?: boolean }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.iconButton, filled && { backgroundColor: "rgba(13,15,18,0.72)" }]}>
      <Icon name={name} color={filled ? "#ffffff" : c.ink} size={22} />
    </Pressable>
  );
}

export function Button({ label, onPress, kind = "primary", icon, flex }: {
  label: string;
  onPress?: () => void;
  kind?: "primary" | "brand" | "quiet" | "danger";
  icon?: IconName;
  flex?: boolean;
}) {
  const c = useColors();
  const bg = { primary: c.accent, brand: c.brand, quiet: c.field, danger: c.field }[kind];
  const fg = { primary: c.accentInk, brand: c.brandInk, quiet: c.ink, danger: c.bad }[kind];
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }, flex && { flex: 1 }]}>
      {icon && <Icon name={icon} color={fg} size={20} />}
      {label ? <Text style={{ fontFamily: font.bold, fontSize: 16, color: fg }}>{label}</Text> : null}
    </Pressable>
  );
}

/** Sticky action bar for the screen's main action, within thumb reach. */
export function ActionBar({ children }: { children: ReactNode }) {
  const c = useColors();
  return <View style={[styles.actionBar, { backgroundColor: c.surface, borderTopColor: c.line }]}>{children}</View>;
}

export function Chip({ label, on, onPress, removable }: { label: string; on?: boolean; onPress?: () => void; removable?: boolean }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} onPress={onPress} style={[styles.chip, { backgroundColor: on ? c.ink : c.field }]}>
      <Text style={{ fontFamily: font.semibold, fontSize: 14, color: on ? c.bg : c.ink }}>{label}</Text>
      {removable && <Icon name="close" size={14} color={on ? c.bg : c.ink} strokeWidth={2.4} />}
    </Pressable>
  );
}

export function Pill({ label, tone = "brand", icon }: { label: string; tone?: "brand" | "warn"; icon?: IconName }) {
  const c = useColors();
  const fg = tone === "brand" ? c.brand : c.warn;
  const bg = tone === "brand" ? c.brandSoft : c.warnSoft;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      {icon && <Icon name={icon} size={13} color={fg} strokeWidth={2.6} />}
      <Text style={{ fontFamily: font.bold, fontSize: 12, color: fg }}>{label}</Text>
    </View>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const c = useColors();
  const box = [styles.card, { backgroundColor: c.surface, borderColor: c.line }, style];
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [...box, pressed && { opacity: 0.9 }]}>{children}</Pressable> : <View style={box}>{children}</View>;
}

/** Labelled facts: every figure carries its name. */
export function StatGrid({ items, columns = 3 }: { items: { label: string; value: string }[]; columns?: number }) {
  const c = useColors();
  return (
    <View style={[styles.grid, { borderColor: c.line, backgroundColor: c.line }]}>
      {items.map((it) => (
        <View key={it.label} style={{ width: `${100 / columns}%`, padding: 1 / 2 }}>
          <View style={{ backgroundColor: c.surface, paddingVertical: 10, paddingHorizontal: 12 }}>
            <T s="small" tone="muted">{it.label}</T>
            <T w="bold" style={{ fontSize: 16 }}>{it.value}</T>
          </View>
        </View>
      ))}
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.section}>
      <T s="title" w="bold">{title}</T>
      {action && <Pressable onPress={onAction} hitSlop={10}><T w="semibold" tone="brand">{action}</T></Pressable>}
    </View>
  );
}

export function Avatar({ initials, sizePt = 44 }: { initials: string; sizePt?: number }) {
  const c = useColors();
  return (
    <View style={{ width: sizePt, height: sizePt, borderRadius: sizePt / 2, backgroundColor: c.brandSoft, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: font.heavy, fontSize: sizePt * 0.36, color: c.brand }}>{initials}</Text>
    </View>
  );
}

export function specLine(l: CardListing) {
  return [l.year, l.km == null ? "km neuvedeno" : formatKm(l.km), l.fuel, l.gearbox, `${l.powerKw} kW`].join(" · ");
}

export function ListingCard({ listing, saved }: { listing: CardListing; saved?: boolean }) {
  const c = useColors();
  return (
    <Card onPress={() => router.push(`/inzerat/${listing.id}`)} style={{ marginHorizontal: 12, marginBottom: 12, padding: 0 }}>
      <View>
        <Image source={listing.photo ?? undefined} style={{ width: "100%", height: 196, backgroundColor: c.field }} contentFit="cover" accessibilityLabel={listing.title} />
        <View style={{ position: "absolute", right: 10, top: 10 }}><IconButton name="heart" label={saved ? "Odebrat z uložených" : "Uložit"} filled /></View>
        {listing.photoCount > 0 && <View style={[styles.counter]}><Text style={{ fontFamily: font.semibold, fontSize: 12, color: "#fff" }}>1 / {listing.photoCount}</Text></View>}
      </View>
      <View style={{ padding: 14, gap: 2 }}>
        <T w="heavy" style={{ fontSize: 21 }}>{formatCzk(listing.price)}</T>
        <T w="semibold">{listing.title}</T>
        <T s="small" tone="muted">{specLine(listing)}</T>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <T s="small" tone="muted">{listing.place} · {listing.age}</T>
          {listing.km == null ? <Pill label="Stav km neuveden" tone="warn" /> : listing.stkRecords > 0 ? <Pill label={`Záznamy STK: ${listing.stkRecords}`} icon="check" /> : null}
        </View>
      </View>
    </Card>
  );
}

/** Loading, error and empty states share one place, so no screen shows a blank. */
export function StateView({ loading, error, empty, onRetry }: { loading?: boolean; error?: string | null; empty?: string; onRetry?: () => void }) {
  const c = useColors();
  if (loading) return <View style={styles.state}><ActivityIndicator color={c.brand} /><T tone="muted">Načítáme…</T></View>;
  if (error) return (
    <View style={styles.state}>
      <T w="bold" style={{ fontSize: 16 }}>Nepodařilo se načíst</T>
      <T tone="muted" style={{ textAlign: "center" }}>{error}</T>
      {onRetry && <Button label="Zkusit znovu" kind="quiet" onPress={onRetry} />}
    </View>
  );
  if (empty) return <View style={styles.state}><T tone="muted" style={{ textAlign: "center" }}>{empty}</T></View>;
  return null;
}

export function Row({ children, onPress, c }: { children: ReactNode; onPress?: () => void; c: Colors }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: c.line, backgroundColor: pressed ? c.field : "transparent" }]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  button: { height: 52, borderRadius: 14, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minWidth: 52 },
  actionBar: { flexDirection: "row", gap: 10, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 30, borderTopWidth: StyleSheet.hairlineWidth },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, height: 40, borderRadius: radius.chip },
  pill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 12 },
  card: { borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden", padding: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden", marginHorizontal: 16 },
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  counter: { position: "absolute", left: 10, bottom: 10, backgroundColor: "rgba(13,15,18,0.72)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  state: { alignItems: "center", justifyContent: "center", gap: 10, padding: 32 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
});
