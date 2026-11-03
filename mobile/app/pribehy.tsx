import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { stories } from "../components/demo";
import { Icon } from "../components/icons";
import { formatCzk, formatKm, useColors } from "../components/theme";
import { Avatar, Card, Chip, Screen, T, TopBar } from "../components/ui";

const FILTERS = ["Vše", "Sleduji", "Moje generace"] as const;

export default function Stories() {
  const c = useColors();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Vše");
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title="Příběhy majitelů" />
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 12 }}>
          {FILTERS.map((f) => <Chip key={f} label={f} on={filter === f} onPress={() => setFilter(f)} />)}
        </View>
        <FlatList
          data={stories}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item: s }) => (
            <Card style={{ marginHorizontal: 12, marginBottom: 12, padding: 0 }}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", padding: 14, paddingBottom: 10 }}>
                <Avatar initials={s.initials} />
                <View><T w="bold">{s.author} · {s.car}</T><T s="small" tone="muted">{s.when} · {s.kind}</T></View>
              </View>
              {s.photo && <Image source={s.photo} style={{ width: "100%", height: 170, backgroundColor: c.field }} contentFit="cover" accessibilityLabel={s.car} />}
              <View style={{ padding: 14, gap: 10 }}>
                <T w="bold" style={{ fontSize: 17 }}>{s.title}</T>
                <View style={{ flexDirection: "row", gap: 24 }}>
                  <View><T s="small" tone="muted">Stav tachometru</T><T w="bold" style={{ fontSize: 17 }}>{formatKm(s.km)}</T></View>
                  <View><T s="small" tone="muted">Cena</T><T w="bold" style={{ fontSize: 17 }}>{formatCzk(s.cost)}</T></View>
                </View>
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}><Icon name="heart" size={18} color={c.muted} /><T tone="muted" w="semibold">{s.likes}</T></View>
                  <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}><Icon name="chat" size={18} color={c.muted} /><T tone="muted" w="semibold">{s.comments} komentářů</T></View>
                </View>
              </View>
            </Card>
          )}
        />
      </SafeAreaView>
    </Screen>
  );
}
