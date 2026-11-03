import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadListings, useRemote, type CardListing } from "../../components/data";
import { Icon, type IconName } from "../../components/icons";
import { font, useColors } from "../../components/theme";
import { Chip, ListingCard, Screen, StateView, T } from "../../components/ui";

const FUELS = [
  { label: "Nafta", value: "nafta" },
  { label: "Benzín", value: "benzin" },
  { label: "Elektro", value: "elektro" },
];

export default function Search() {
  const c = useColors();
  const [fuel, setFuel] = useState<string | undefined>();
  const [more, setMore] = useState<{ items: CardListing[]; cursor: string | null; loading: boolean }>({ items: [], cursor: null, loading: false });
  const first = useRemote(`listings:${fuel ?? ""}`, (signal) => loadListings({ palivo: fuel, limit: 20 }, signal).then((page) => {
    setMore({ items: [], cursor: page.nextCursor, loading: false });
    return page;
  }));
  const items = [...(first.data?.items ?? []), ...more.items];
  const loadMore = () => {
    if (!more.cursor || more.loading) return;
    const cursor = more.cursor;
    setMore((m) => ({ ...m, loading: true }));
    loadListings({ palivo: fuel, limit: 20, cursor }, new AbortController().signal)
      .then((page) => setMore((m) => ({ items: [...m.items, ...page.items], cursor: page.nextCursor, loading: false })))
      .catch(() => setMore((m) => ({ ...m, loading: false })));
  };
  const tools: { label: string; icon: IconName; onPress: () => void }[] = [
    { label: "Filtry", icon: "filter", onPress: () => router.push("/filtry") },
    { label: "Řadit", icon: "sort", onPress: () => {} },
    { label: "Hlídat", icon: "bell", onPress: () => {} },
  ];
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <T s="title" w="bold" style={{ paddingHorizontal: 16, paddingTop: 10 }}>{first.data ? `Auta · ${items.length}${more.cursor ? "+" : ""}` : "Auta"}</T>
        <View style={styles.chips}>
          {FUELS.map((f) => <Chip key={f.value} label={f.label} on={fuel === f.value} removable={fuel === f.value} onPress={() => setFuel(fuel === f.value ? undefined : f.value)} />)}
        </View>
        <FlatList
          data={items}
          keyExtractor={(l) => l.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<StateView loading={first.loading} error={first.error} empty="Žádné auto neodpovídá filtrům." onRetry={first.reload} />}
          contentContainerStyle={{ paddingBottom: 96, flexGrow: 1 }}
        />
        <View style={[styles.float, { backgroundColor: c.ink }]}>
          {tools.map((t, i) => (
            <Pressable key={t.label} accessibilityRole="button" onPress={t.onPress} style={[styles.tool, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.muted }]}>
              <Icon name={t.icon} size={18} color={c.bg} strokeWidth={2.2} />
              <Text style={{ fontFamily: font.bold, fontSize: 15, color: c.bg }}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 12, flexWrap: "wrap" },
  float: { position: "absolute", alignSelf: "center", bottom: 16, flexDirection: "row", borderRadius: 26, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  tool: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, height: 50 },
});
