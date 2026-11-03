import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../components/icons";
import { font, radius, useColors, noWebOutline } from "../../components/theme";
import { Screen, StateView, T, TopBar } from "../../components/ui";
import { api, ApiError, authClient, type MessageDto } from "../../lib/api";

const POLL_MS = 10000; // until the app joins the /ws/zpravy socket, a quiet poll keeps the thread fresh

const time = (iso: string) => new Date(iso).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });

export default function Thread() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const c = useColors();
  const session = authClient.useSession();
  const me = session.data?.user.id;
  const [messages, setMessages] = useState<MessageDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const list = useRef<FlatList<MessageDto>>(null);

  useEffect(() => {
    let alive = true;
    const load = () => api.messages(id)
      .then((page) => { if (!alive) return; setMessages(page.items); setError(null); api.readConversation(id).catch(() => {}); })
      .catch((e: unknown) => { if (alive) setError(e instanceof ApiError ? e.message : "Zprávy se nepodařilo načíst."); });
    load();
    const timer = setInterval(load, POLL_MS);
    return () => { alive = false; clearInterval(timer); };
  }, [id]);

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const message = await api.sendMessage(id, body);
      setMessages((m) => [...(m ?? []), message]);
      setDraft("");
      requestAnimationFrame(() => list.current?.scrollToEnd({ animated: true }));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Zprávu se nepodařilo odeslat.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <TopBar title={title ?? "Zprávy"} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          {messages ? (
            <FlatList
              ref={list}
              data={messages}
              keyExtractor={(m) => m.id}
              contentContainerStyle={{ padding: 14, gap: 8, flexGrow: 1, justifyContent: "flex-end" }}
              onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
              ListEmptyComponent={<StateView empty="Zatím žádné zprávy. Napište první." />}
              renderItem={({ item: m }) => {
                const mine = m.senderId != null && m.senderId === me;
                const system = m.senderId == null;
                return (
                  <View style={[styles.bubble, mine ? { alignSelf: "flex-end", backgroundColor: c.brand, borderBottomRightRadius: 4 } : { alignSelf: system ? "center" : "flex-start", backgroundColor: c.field, borderBottomLeftRadius: system ? 16 : 4 }]}>
                    <T style={{ color: mine ? c.brandInk : c.ink, lineHeight: 20 }}>{m.body}</T>
                    <T s="small" style={{ color: mine ? c.brandInk : c.muted, opacity: 0.8, marginTop: 4 }}>{time(m.createdAt)}</T>
                  </View>
                );
              }}
            />
          ) : <View style={{ flex: 1 }}><StateView loading={!error} error={error} /></View>}
          {messages && error ? <T tone="warn" w="semibold" style={{ paddingHorizontal: 16, paddingBottom: 6 }}>{error}</T> : null}
          <View style={[styles.composer, { backgroundColor: c.surface, borderTopColor: c.line }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Napište zprávu…"
              placeholderTextColor={c.muted}
              selectionColor={c.brand}
              multiline
              style={[noWebOutline, styles.input, { backgroundColor: c.field, color: c.ink }]}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Odeslat" onPress={send} disabled={!draft.trim() || sending} style={[styles.send, { backgroundColor: draft.trim() ? c.accent : c.field }]}>
              <Icon name="send" size={22} color={draft.trim() ? c.accentInk : c.muted} strokeWidth={2.4} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: "80%", paddingHorizontal: 13, paddingVertical: 10, borderRadius: 16 },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: 8, padding: 10, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, minHeight: 46, maxHeight: 120, borderRadius: 23, paddingHorizontal: 16, paddingVertical: 12, fontFamily: font.medium, fontSize: 15 },
  send: { width: 46, height: 46, borderRadius: radius.chip + 3, alignItems: "center", justifyContent: "center" },
});
