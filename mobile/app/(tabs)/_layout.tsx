import { router, Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "../../components/icons";
import { useRemote } from "../../components/data";
import { font, useColors } from "../../components/theme";
import { api, authClient } from "../../lib/api";

type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: "index", label: "Domů", icon: "home" },
  { name: "hledat", label: "Hledat", icon: "search" },
  { name: "zpravy", label: "Zprávy", icon: "chat" },
  { name: "profil", label: "Profil", icon: "user" },
];

// Five labelled slots; the middle one is the "+" that opens the add sheet instead of a tab.
function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;
  const session = authClient.useSession();
  const me = useRemote(`tabs:me:${session.data?.user.id ?? "anon"}:${current}`, (signal) => (session.data ? api.me({ signal }) : Promise.resolve(null)));
  const unread = me.data?.unread ?? 0;
  const item = (t: (typeof TABS)[number]) => {
    const on = current === t.name;
    return (
      <Pressable key={t.name} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={t.label} onPress={() => { const route = state.routes.find((r) => r.name === t.name); if (route) navigateToTab(route.key); }} style={styles.item}>
        <View>
          <Icon name={t.icon} size={26} color={on ? c.brand : c.muted} />
          {(t.name === "zpravy" ? unread : 0) ? <View style={[styles.badge, { backgroundColor: c.accent }]}><Text style={{ fontFamily: font.bold, fontSize: 11, color: c.accentInk }}>{unread > 99 ? "99+" : unread}</Text></View> : null}
        </View>
        <Text style={{ fontFamily: font.semibold, fontSize: 12, color: on ? c.ink : c.muted }}>{t.label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={[styles.bar, { backgroundColor: c.surface, borderTopColor: c.line, paddingBottom: Math.max(insets.bottom, 10) }]}>
      {item(TABS[0])}
      {item(TABS[1])}
      <Pressable accessibilityRole="button" accessibilityLabel="Přidat" onPress={() => router.push("/pridat")} style={styles.item}>
        <View style={[styles.add, { backgroundColor: c.accent, borderColor: c.surface }]}><Icon name="plus" size={28} color={c.accentInk} strokeWidth={2.4} /></View>
        <Text style={{ fontFamily: font.semibold, fontSize: 12, color: c.muted }}>Přidat</Text>
      </Pressable>
      {item(TABS[2])}
      {item(TABS[3])}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      {TABS.map((t) => <Tabs.Screen key={t.name} name={t.name} options={{ title: t.label }} />)}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  item: { flex: 1, alignItems: "center", gap: 4, minHeight: 52 },
  add: { width: 54, height: 54, borderRadius: 27, marginTop: -20, borderWidth: 5, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -4, right: -12, borderRadius: 9, paddingHorizontal: 6, paddingVertical: 1 },
});
