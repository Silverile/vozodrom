import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { DEMO, loadListing, useRemote } from "../../components/data";
import { Icon } from "../../components/icons";
import { formatCzk, formatKm, useColors } from "../../components/theme";
import { ActionBar, Button, Card, IconButton, Screen, StatGrid, StateView, T } from "../../components/ui";
import { api, ApiError, authClient } from "../../lib/api";
import { useState } from "react";

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const remote = useRemote(`listing:${id}`, (signal) => loadListing(id, signal));
  const session = authClient.useSession();
  const [opening, setOpening] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  async function writeToSeller(title: string) {
    if (!session.data) { router.push("/prihlaseni"); return; }
    setOpening(true);
    setContactError(null);
    try {
      const { id: conversation } = await api.openConversation(id);
      router.push({ pathname: "/zpravy/[id]", params: { id: conversation, title } });
    } catch (e) {
      setContactError(e instanceof ApiError ? e.message : "Konverzaci se nepodařilo otevřít.");
    } finally {
      setOpening(false);
    }
  }
  if (!remote.data) {
    return (
      <Screen>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 8 }}><IconButton name="back" label="Zpět" onPress={() => router.back()} /></View>
          <StateView loading={remote.loading} error={remote.error} onRetry={remote.reload} />
        </SafeAreaView>
      </Screen>
    );
  }
  const { card: l, description, phone, photos } = remote.data;
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View>
          <Image source={photos[0]} style={{ width: "100%", height: 280, backgroundColor: c.field }} contentFit="cover" accessibilityLabel={l.title} />
          <View style={[styles.overlay, { top: insets.top + 4 }]}>
            <IconButton name="back" label="Zpět" filled onPress={() => router.back()} />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <IconButton name="share" label="Sdílet" filled />
              <IconButton name="heart" label="Uložit" filled />
            </View>
          </View>
        </View>
        <View style={{ padding: 16, gap: 2 }}>
          <T w="heavy" style={{ fontSize: 27 }}>{formatCzk(l.price)}</T>
          <T w="semibold" s="title">{l.title}</T>
          <T s="small" tone="muted">{l.place} · vloženo {l.age}</T>
        </View>
        <StatGrid items={[
          { label: "Rok", value: String(l.year) },
          { label: "Najeto", value: l.km == null ? "neuvedeno" : formatKm(l.km) },
          { label: "Palivo", value: l.fuel },
          { label: "Převodovka", value: l.gearbox },
          { label: "Výkon", value: l.powerKw ? `${l.powerKw} kW` : "neuvedeno" },
          { label: "Záznamy STK", value: l.stkRecords ? String(l.stkRecords) : "žádné" },
        ]} />
        {description ? (
          <View style={{ padding: 16, gap: 6 }}>
            <T w="bold" style={{ fontSize: 16 }}>Popis</T>
            <T tone="muted" style={{ lineHeight: 21 }}>{description}</T>
          </View>
        ) : null}
        <Card style={{ marginHorizontal: 16, marginTop: 12, gap: 6 }} onPress={() => router.push("/pribehy")}>
          <T w="bold" style={{ fontSize: 16 }}>Zkušenosti majitelů {l.generation}</T>
          <T tone="muted">Co majitelé této generace opravovali a kolik to stálo.</T>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <T w="semibold" tone="brand">Přečíst deníky</T>
            <Icon name="chevron" color={c.brand} size={18} />
          </View>
        </Card>
        {contactError ? <T tone="warn" w="semibold" style={{ paddingHorizontal: 16, paddingTop: 12 }}>{contactError}</T> : null}
        {DEMO && <T s="small" tone="muted" style={{ paddingHorizontal: 16, paddingTop: 12 }}>Ukázková data · fotka Wikimedia Commons</T>}
      </ScrollView>
      <ActionBar>
        {phone ? <Button label="" icon="phone" kind="quiet" onPress={() => Linking.openURL(`tel:${phone.replace(/\s/g, "")}`)} /> : null}
        <Button label={opening ? "Otevíráme…" : "Napsat prodejci"} flex onPress={DEMO || opening ? undefined : () => writeToSeller(l.title)} />
      </ActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", left: 8, right: 8, flexDirection: "row", justifyContent: "space-between" },
});
