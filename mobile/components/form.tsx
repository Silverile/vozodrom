import { Image } from "expo-image";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { Icon } from "./icons";
import { font, radius, useColors, noWebOutline } from "./theme";
import { T } from "./ui";

/** A labelled text field; the label always stays visible above the value. */
export function Input({ label, hint, multiline, ...props }: TextInputProps & { label: string; hint?: string }) {
  const c = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6, marginBottom: 14 }}>
      <T w="semibold" tone="muted">{label}</T>
      <TextInput
        placeholderTextColor={c.muted}
        selectionColor={c.brand}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[noWebOutline, styles.input, multiline && styles.multiline, { backgroundColor: c.field, color: c.ink, borderColor: focused ? c.brand : "transparent" }]}
        {...props}
      />
      {hint ? <T s="small" tone="muted">{hint}</T> : null}
    </View>
  );
}

export function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <T w="semibold" tone="muted">{label}</T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
    </View>
  );
}

export function ErrorNote({ text }: { text: string | null }) {
  const c = useColors();
  if (!text) return null;
  return <View style={{ backgroundColor: c.warnSoft, borderRadius: radius.field, padding: 12, marginBottom: 12 }}><T tone="warn" w="semibold">{text}</T></View>;
}

/** Thumbnails of chosen photos plus an add tile; long lists scroll sideways. */
export function PhotoStrip({ uris, onAdd, onRemove, max }: { uris: string[]; onAdd: () => void; onRemove: (i: number) => void; max: number }) {
  const c = useColors();
  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <T w="semibold" tone="muted">Fotky · {uris.length} z {max}</T>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {uris.map((uri, i) => (
          <View key={uri}>
            <Image source={uri} style={{ width: 96, height: 72, borderRadius: 10, backgroundColor: c.field }} contentFit="cover" />
            <Pressable accessibilityRole="button" accessibilityLabel="Odebrat fotku" onPress={() => onRemove(i)} hitSlop={8} style={[styles.remove, { backgroundColor: c.bg }]}>
              <Icon name="close" size={14} color={c.ink} strokeWidth={2.4} />
            </Pressable>
          </View>
        ))}
        {uris.length < max && (
          <Pressable accessibilityRole="button" accessibilityLabel="Přidat fotky" onPress={onAdd} style={[styles.add, { borderColor: c.line }]}>
            <Icon name="plus" size={24} color={c.brand} />
            <T s="small" tone="brand" w="semibold">Přidat</T>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 52, borderRadius: radius.field, paddingHorizontal: 14, paddingVertical: 12, fontFamily: font.semibold, fontSize: 16, borderWidth: 2 },
  multiline: { minHeight: 120, textAlignVertical: "top" },
  remove: { position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  add: { width: 96, height: 72, borderRadius: 10, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 2 },
});
