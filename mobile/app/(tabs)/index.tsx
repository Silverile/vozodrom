import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEMO, loadListings, loadStories, useRemote } from "../../components/data";
import { Icon, type IconName } from "../../components/icons";
import { formatCzk, formatKm, radius, useColors } from "../../components/theme";
import { Card, Row, Screen, SectionHeader, StateView, T } from "../../components/ui";

const CATEGORIES: { label: string; note: string; icon: IconName; open: boolean }[] = [
  { label: "Auta", note: "Inzeráty a katalog", icon: "car", open: true },
  { label: "Stroje", note: "Připravujeme", icon: "machine", open: false },
  { label: "Díly", note: "Připravujeme", icon: "part", open: false },
];

export default function Home() {
  const c = useColors();
  const fresh = useRemote("home:listings", (signal) => loadListings({ limit: 8 }, signal));
  const stories = useRemote("home:stories", (signal) => loadStories(3, signal));
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <T w="heavy" s="display" style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, letterSpacing: -0.3 }}>Vozodrom</T>
          <Pressable accessibilityRole="search" onPress={() => router.push("/hledat")} style={[styles.search, { backgroundColor: c.field }]}>
            <Icon name="search" color={c.muted} size={22} />
            <T tone="muted" style={{ fontSize: 16 }}>Hledat, např. Octavia III</T>
          </Pressable>
          <View style={styles.cats}>
            {CATEGORIES.map((cat) => (
              <Card key={cat.label} style={{ flex: 1, gap: 8, opacity: cat.open ? 1 : 0.85 }} onPress={cat.open ? () => router.push("/hledat") : undefined}>
                <Icon name={cat.icon} size={30} color={c.brand} />
                <T w="bold" style={{ fontSize: 16 }}>{cat.label}</T>
                <T s="small" tone="muted">{cat.note}</T>
              </Card>
            ))}
          </View>
          <SectionHeader title="Nové inzeráty" action="Vše" onAction={() => router.push("/hledat")} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {(fresh.data?.items ?? []).map((l) => (
              <Card key={l.id} style={{ width: 200, padding: 0 }} onPress={() => router.push(`/inzerat/${l.id}`)}>
                <Image source={l.photo ?? undefined} style={{ width: 200, height: 120, backgroundColor: c.field }} contentFit="cover" accessibilityLabel={l.title} />
                <View style={{ padding: 12 }}>
                  <T w="heavy" style={{ fontSize: 19 }}>{formatCzk(l.price)}</T>
                  <T w="semibold" lines={1}>{l.title}</T>
                  <T s="small" tone="muted">{l.year} · {l.km == null ? "km neuvedeno" : formatKm(l.km)}</T>
                </View>
              </Card>
            ))}
          </ScrollView>
          {!fresh.data ? <StateView loading={fresh.loading} error={fresh.error} onRetry={fresh.reload} /> : fresh.data.items.length === 0 ? <StateView empty="Zatím tu nejsou žádné inzeráty. Přidejte první přes „+“." /> : null}
          <SectionHeader title="Příběhy majitelů" action="Vše" onAction={() => router.push("/pribehy")} />
          {stories.data ? stories.data.map((s) => (
            <Row key={s.id} c={c} onPress={() => router.push("/pribehy")}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.brandSoft, alignItems: "center", justifyContent: "center" }}><Icon name="book" color={c.brand} /></View>
              <View style={{ flex: 1 }}>
                <T w="bold" lines={1}>{s.title}</T>
                <T s="small" tone="muted" lines={1}>{[s.car, s.km != null ? formatKm(s.km) : null, s.cost != null ? formatCzk(s.cost) : null].filter(Boolean).join(" · ")}</T>
              </View>
              <T s="small" tone="muted">{s.when}</T>
            </Row>
          )) : <StateView loading={stories.loading} error={stories.error} onRetry={stories.reload} />}
          {DEMO && <T s="small" tone="muted" style={{ paddingHorizontal: 16, paddingTop: 12 }}>Ukázková data · fotky Wikimedia Commons</T>}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { marginHorizontal: 16, height: 52, borderRadius: radius.field + 2, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16 },
  cats: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingTop: 14 },
});
