import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ago, useReloadOnFocus, useRemote } from "../../components/data";
import { Icon } from "../../components/icons";
import { font, useColors } from "../../components/theme";
import { Button, Row, Screen, StateView, T } from "../../components/ui";
import { api, authClient } from "../../lib/api";

export default function Messages() {
  const c = useColors();
  const session = authClient.useSession();
  const userKey = session.data?.user.id ?? "anon";
  const threads = useRemote(`conversations:${userKey}`, (signal) => (session.data ? api.conversations({ signal }) : Promise.resolve(null)));
  useReloadOnFocus(threads);
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <T w="heavy" s="display" style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>Zprávy</T>
        {!session.data ? (
          session.isPending ? <StateView loading /> : (
            <View style={{ padding: 16, gap: 12 }}>
              <T tone="muted">Po přihlášení tu najdete rozhovory s prodejci a upozornění hlídacího psa.</T>
              <Button label="Přihlásit se" onPress={() => router.push("/prihlaseni")} />
            </View>
          )
        ) : (
          <FlatList
            data={threads.data?.items ?? []}
            keyExtractor={(m) => m.id}
            onRefresh={threads.reload}
            refreshing={threads.loading && Boolean(threads.data)}
            ListEmptyComponent={<StateView loading={threads.loading} error={threads.error} empty="Zatím žádné zprávy. Napište prodejci z detailu inzerátu." onRetry={threads.reload} />}
            renderItem={({ item: m }) => (
              <Row c={c} onPress={() => router.push({ pathname: "/zpravy/[id]", params: { id: m.id, title: m.title } })}>
                <View style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: c.brandSoft, alignItems: "center", justifyContent: "center" }}>
                  <Icon name={m.kind === "system" ? "bell" : "car"} color={c.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <T w="bold" lines={1}>{m.title}</T>
                  <T tone="muted" lines={1}>{m.preview}</T>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <T s="small" tone="muted">{ago(m.lastMessageAt)}</T>
                  {m.unread ? <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: c.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 }}><Text style={{ fontFamily: font.bold, fontSize: 12, color: c.accentInk }}>{m.unread}</Text></View> : null}
                </View>
              </Row>
            )}
          />
        )}
      </SafeAreaView>
    </Screen>
  );
}
