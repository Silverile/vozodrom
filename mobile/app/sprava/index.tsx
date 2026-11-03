import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReference, useRemote } from "../../components/data";
import { ErrorNote, Input } from "../../components/form";
import { Icon } from "../../components/icons";
import { formatCzk, formatKm, useColors } from "../../components/theme";
import { ActionBar, Button, Card, Chip, Screen, StatGrid, StateView, T, TopBar } from "../../components/ui";
import { api, ApiError, type AdminListingDto } from "../../lib/api";


// Moderation: one pending listing at a time, why it is held, and both decisions within thumb reach.
export default function Review() {
  const c = useColors();
  const ref = useReference();
  const overview = useRemote("admin:overview", (signal) => api.adminOverview({ signal }));
  const queue = useRemote("admin:listings", (signal) => api.adminListings({ limit: 20 }, { signal }));
  const [index, setIndex] = useState(0);
  const [rule, setRule] = useState<string>();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = (queue.data?.items ?? []).filter((l) => l.status === "pending");
  const item: AdminListingDto | undefined = items[index];

  async function decide(action: "approve" | "reject") {
    if (!item) return;
    setBusy(true);
    setError(null);
    try {
      await api.listingAction(item.id, action === "approve" ? { action } : { action, rule, reason: reason.trim() });
      setRule(undefined);
      setReason("");
      setIndex((i) => i + 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Rozhodnutí se nepodařilo uložit.");
    } finally {
      setBusy(false);
    }
  }

  const header = overview.data ? (
    <View style={{ marginBottom: 12 }}>
      <StatGrid items={[
        { label: "Inzeráty ke kontrole", value: String(overview.data.pendingListings) },
        { label: "Hlášení inzerátů", value: String(overview.data.listingReports) },
        { label: "Hlášení komunity", value: String(overview.data.communityReports) },
      ]} />
    </View>
  ) : null;

  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title={item ? `Ke kontrole · ${index + 1} z ${items.length}` : "Správa"} />
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          {header}
          {!queue.data ? <StateView loading={queue.loading} error={queue.error} onRetry={queue.reload} /> : !item ? (
            <StateView empty={items.length ? "Fronta je hotová. Díky!" : "Žádný inzerát nečeká na kontrolu."} />
          ) : (
            <>
              <Card style={{ marginHorizontal: 12, padding: 0 }}>
                {item.photos[0] ? <Image source={api.assetUrl(item.photos[0].url)} style={{ width: "100%", height: 180, backgroundColor: c.field }} contentFit="cover" /> : null}
                <View style={{ padding: 14, gap: 2 }}>
                  <T w="heavy" style={{ fontSize: 21 }}>{formatCzk(item.data.price)}</T>
                  <T w="semibold">{[item.data.brand, item.data.model, item.data.generation, item.data.engine].filter(Boolean).join(" ")}</T>
                  <T s="small" tone="muted">{item.data.year} · {formatKm(item.data.mileageKm)} · {item.data.city || item.data.region}</T>
                  {item.data.description ? <T tone="muted" style={{ marginTop: 8 }} lines={6}>{item.data.description}</T> : null}
                </View>
              </Card>
              {item.moderationFlags.length ? (
                <Card style={{ marginHorizontal: 12, marginTop: 12, gap: 6, borderColor: c.warn, backgroundColor: c.warnSoft }}>
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}><Icon name="warn" size={20} color={c.warn} /><T w="bold" tone="warn" style={{ fontSize: 16 }}>Proč čeká</T></View>
                  {item.moderationFlags.map((f) => <T key={f}>{f}</T>)}
                </Card>
              ) : null}
              <Card style={{ marginHorizontal: 12, marginTop: 12 }}>
                <T w="bold" style={{ fontSize: 16, marginBottom: 10 }}>Při zamítnutí</T>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {(ref.data?.moderationRules ?? []).map((o) => <Chip key={o.value} label={o.label.replace(/ \(.*\)$/, "")} on={rule === o.value} onPress={() => setRule(o.value)} />)}
                </View>
                <Input label="Vysvětlení pro prodejce" placeholder="Co má prodejce opravit" multiline value={reason} onChangeText={setReason} />
              </Card>
              <View style={{ paddingHorizontal: 12, paddingTop: 12 }}><ErrorNote text={error} /></View>
            </>
          )}
        </ScrollView>
        {item ? (
          <ActionBar>
            <Button label="Zamítnout" kind="danger" flex onPress={!busy && rule && reason.trim().length >= 5 ? () => decide("reject") : undefined} />
            <Button label="Schválit" kind="brand" flex onPress={busy ? undefined : () => decide("approve")} />
          </ActionBar>
        ) : null}
      </SafeAreaView>
    </Screen>
  );
}
