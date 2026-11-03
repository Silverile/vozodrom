import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEMO, useReloadOnFocus, useRemote } from "../../components/data";
import { garage as demoGarage } from "../../components/demo";
import { Icon } from "../../components/icons";
import { font, useColors } from "../../components/theme";
import { Avatar, Button, Card, Chip, IconButton, Screen, StateView, T } from "../../components/ui";
import { api, authClient } from "../../lib/api";

const TABS = ["Garáž", "Moje inzeráty", "Uložené"] as const;

const initialsOf = (name: string) => name.split(/[\s_.-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

interface GarageCard { id: string; title: string; sub: string; photo: string | null; former: boolean }

export default function Profile() {
  const c = useColors();
  const session = authClient.useSession();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Garáž");
  const signedIn = DEMO || Boolean(session.data);
  const userKey = session.data?.user.id ?? "anon";
  const me = useRemote(`me:${userKey}`, (signal) => (DEMO || !session.data ? Promise.resolve(null) : api.me({ signal })));
  const cars = useRemote(`garage:${userKey}`, async (signal): Promise<GarageCard[]> => {
    if (DEMO) return demoGarage.map((g) => ({ id: g.id, title: g.name, sub: `${g.engine} · ${g.entries} zápisů`, photo: g.photo, former: false }));
    if (!session.data) return [];
    const res = await api.garage({ signal });
    return res.items.map((g) => ({ id: g.id, title: g.nickname || g.title, sub: [g.generation, g.year].filter(Boolean).join(" · "), photo: g.photos[0] ? api.assetUrl(g.photos[0].url) : null, former: g.former }));
  });

  useReloadOnFocus(me, cars);

  if (!signedIn) {
    return (
      <Screen>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <T w="bold" style={{ fontSize: 22, paddingHorizontal: 16, paddingTop: 12 }}>Profil</T>
          {session.isPending ? <StateView loading /> : (
            <View style={{ padding: 16, gap: 12 }}>
              <T w="bold" s="title">Přihlaste se</T>
              <T tone="muted">Uvidíte svou garáž, inzeráty, uložená auta a zprávy od prodejců.</T>
              <Button label="Přihlásit se" onPress={() => router.push("/prihlaseni")} />
            </View>
          )}
        </SafeAreaView>
      </Screen>
    );
  }

  const name = DEMO ? "jirka_naftak" : session.data?.user.name ?? "";
  const staff = DEMO || Boolean(me.data && (me.data.permissions.moderate || me.data.permissions.manageUsers));
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} refreshControl={<RefreshControl refreshing={cars.loading && Boolean(cars.data)} onRefresh={() => { me.reload(); cars.reload(); }} tintColor={c.brand} colors={[c.brand]} />}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 8, paddingTop: 4 }}>
            <T w="bold" style={{ flex: 1, fontSize: 22 }}>Profil</T>
            <IconButton name="settings" label="Nastavení" />
          </View>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 16, paddingVertical: 8 }}>
            <Avatar initials={initialsOf(name)} sizePt={64} />
            <View style={{ flex: 1 }}>
              <T w="bold" style={{ fontSize: 20 }} lines={1}>{name}</T>
              {me.data?.role && me.data.role !== "user" ? <T s="small" tone="brand" w="semibold">{me.data.role === "admin" ? "Administrátor" : me.data.role === "moderator" ? "Moderátor" : "Prodejce"}</T> : null}
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 14 }}>
            {TABS.map((t) => <Chip key={t} label={t} on={tab === t} onPress={() => setTab(t)} />)}
          </View>
          {tab === "Garáž" && (
            cars.data?.length ? cars.data.map((g) => (
              <Card key={g.id} style={{ marginHorizontal: 12, marginBottom: 10, padding: 0, flexDirection: "row", opacity: g.former ? 0.8 : 1 }}>
                <Image source={g.photo ?? undefined} style={{ width: 120, height: 96, backgroundColor: c.field }} contentFit="cover" accessibilityLabel={g.title} />
                <View style={{ flex: 1, padding: 12, gap: 2 }}>
                  <T w="bold" style={{ fontSize: 17 }} lines={1}>{g.title}</T>
                  <T s="small" tone="muted">{g.sub}</T>
                  {g.former && <T s="small" tone="muted">Bývalé auto · deník zůstává</T>}
                </View>
              </Card>
            )) : <StateView loading={cars.loading} error={cars.error} empty="V garáži zatím nic není. Přidejte auto přes „+“." onRetry={cars.reload} />
          )}
          {tab !== "Garáž" && <StateView empty="Připravujeme." />}
          {staff && (
            <Card style={{ marginHorizontal: 12, marginTop: 4, flexDirection: "row", alignItems: "center" }} onPress={() => router.push("/sprava")}>
              <View style={{ flex: 1 }}>
                <T w="bold" style={{ fontSize: 16 }}>Správa webu</T>
                <T s="small" tone="muted">Kontrola inzerátů, hlášení a komunity</T>
              </View>
              {DEMO && <View style={{ minWidth: 24, height: 24, borderRadius: 12, backgroundColor: c.accent, alignItems: "center", justifyContent: "center", marginRight: 8 }}><Text style={{ fontFamily: font.bold, fontSize: 12, color: c.accentInk }}>4</Text></View>}
              <Icon name="chevron" color={c.muted} size={20} />
            </Card>
          )}
          {!DEMO && <View style={{ paddingHorizontal: 12, paddingTop: 20 }}><Button label="Odhlásit se" kind="quiet" onPress={() => authClient.signOut()} /></View>}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
