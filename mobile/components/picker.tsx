import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "./icons";
import { font, radius, useColors, noWebOutline } from "./theme";
import { StateView, T, TopBar } from "./ui";

export interface Option { value: string; label: string; note?: string }

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** A field that opens a full-screen searchable list: makes, models, regions, cities. */
export function PickerField({ label, placeholder, value, options, onChange, loading, error, disabled }: {
  label: string;
  placeholder: string;
  value: string | undefined;
  options: Option[];
  onChange: (value: string) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}) {
  const c = useColors();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = fold(query.trim());
    return q ? options.filter((o) => fold(o.label).includes(q)) : options;
  }, [options, query]);
  const current = options.find((o) => o.value === value);
  return (
    <View style={{ gap: 6, marginBottom: 14, opacity: disabled ? 0.55 : 1 }}>
      <T w="semibold" tone="muted">{label}</T>
      <Pressable accessibilityRole="button" disabled={disabled} onPress={() => setOpen(true)} style={[styles.value, { backgroundColor: c.field }]}>
        <T w="semibold" tone={current ? "ink" : "muted"} style={{ fontSize: 16, flex: 1 }} lines={1}>{current?.label ?? placeholder}</T>
        <Icon name="chevron" size={18} color={c.muted} />
      </Pressable>
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: c.bg }}>
          <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
            <View style={{ paddingTop: 4 }}><TopBar title={label} closeIcon onClose={() => setOpen(false)} /></View>
            {options.length > 8 && (
              <View style={[styles.search, { backgroundColor: c.field }]}>
                <Icon name="search" size={20} color={c.muted} />
                <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Hledat" placeholderTextColor={c.muted} selectionColor={c.brand} style={[{ flex: 1, color: c.ink, fontFamily: font.semibold, fontSize: 16 }, noWebOutline]} />
              </View>
            )}
            <FlatList
              data={shown}
              keyExtractor={(o) => o.value}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<StateView loading={loading} error={error} empty="Nic nenalezeno." />}
              renderItem={({ item }) => (
                <Pressable onPress={() => { onChange(item.value); setOpen(false); setQuery(""); }} style={({ pressed }) => [styles.row, { borderBottomColor: c.line, backgroundColor: pressed ? c.field : "transparent" }]}>
                  <View style={{ flex: 1 }}>
                    <T w={item.value === value ? "bold" : "medium"} style={{ fontSize: 16 }}>{item.label}</T>
                    {item.note ? <T s="small" tone="muted">{item.note}</T> : null}
                  </View>
                  {item.value === value && <Icon name="check" size={20} color={c.brand} strokeWidth={2.4} />}
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  value: { height: 52, borderRadius: radius.field, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14 },
  search: { marginHorizontal: 16, marginBottom: 8, height: 48, borderRadius: radius.field, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
});
