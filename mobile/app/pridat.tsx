import { router } from "expo-router";
import { authClient } from "../lib/api";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "../components/icons";
import { radius, useColors } from "../components/theme";
import { Button, T } from "../components/ui";

const OPTIONS: { title: string; note: string; icon: IconName; href?: "/prodat" | "/zapis" | "/auto-nove" }[] = [
  { title: "Prodat auto", note: "Inzerát s fotkami, zabere asi 5 minut", icon: "car", href: "/prodat" },
  { title: "Zápis do deníku", note: "Oprava, servis, STK, tankování", icon: "book", href: "/zapis" },
  { title: "Auto do garáže", note: "Začněte vést deník svého vozu", icon: "garage", href: "/auto-nove" },
  { title: "Prodat stroj nebo díl", note: "Připravujeme", icon: "machine" },
];

// The "+" sheet: one choice, all targets in the lower half of the screen.
export default function AddSheet() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const session = authClient.useSession();
  const go = (href: NonNullable<(typeof OPTIONS)[number]["href"]>) => router.replace(session.data ? href : "/prihlaseni");
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Pressable accessibilityLabel="Zavřít" style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} onPress={() => router.back()} />
      <View style={[styles.sheet, { backgroundColor: c.surface, paddingBottom: insets.bottom + 16 }]}>
        <View style={[styles.grab, { backgroundColor: c.line }]} />
        <T w="bold" style={{ fontSize: 21, paddingHorizontal: 6 }}>Co chcete přidat?</T>
        <T tone="muted" style={{ paddingHorizontal: 6, paddingBottom: 10 }}>Vyberte jednu možnost</T>
        {OPTIONS.map((o) => (
          <Pressable key={o.title} accessibilityRole="button" accessibilityState={{ disabled: !o.href }} disabled={!o.href} onPress={o.href ? () => go(o.href!) : undefined} style={({ pressed }) => [styles.option, { borderTopColor: c.line, opacity: o.href ? (pressed ? 0.8 : 1) : 0.7 }]}>
            <View style={[styles.icon, { backgroundColor: c.brandSoft }]}><Icon name={o.icon} size={28} color={c.brand} strokeWidth={2} /></View>
            <View style={{ flex: 1 }}>
              <T w="bold" style={{ fontSize: 16 }}>{o.title}</T>
              <T s="small" tone="muted">{o.note}</T>
            </View>
            {o.href && <Icon name="chevron" size={20} color={c.muted} />}
          </Pressable>
        ))}
        <View style={{ marginTop: 8 }}><Button label="Zrušit" kind="quiet" onPress={() => router.back()} /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 12, paddingTop: 10 },
  grab: { width: 40, height: 5, borderRadius: 3, alignSelf: "center", marginBottom: 14 },
  option: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 6, borderTopWidth: StyleSheet.hairlineWidth },
  icon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
