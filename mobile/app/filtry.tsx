import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../components/icons";
import { radius, useColors } from "../components/theme";
import { ActionBar, Button, Chip, Screen, T, TopBar } from "../components/ui";

const FUELS = ["Benzín", "Nafta", "Hybrid", "Elektro", "LPG"];
const GEARBOXES = ["Jakákoli", "Manuál", "Automat"];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 14, gap: 6 }}>
      <T w="semibold" tone="muted">{label}</T>
      {children}
    </View>
  );
}

function Value({ text, placeholder, chevron }: { text?: string; placeholder?: string; chevron?: boolean }) {
  const c = useColors();
  return (
    <Pressable style={[styles.value, { backgroundColor: c.field }]}>
      <T w="semibold" tone={text ? "ink" : "muted"} style={{ fontSize: 16 }}>{text ?? placeholder}</T>
      {chevron && <Icon name="chevron" size={18} color={c.muted} />}
    </Pressable>
  );
}

export default function Filters() {
  const [fuel, setFuel] = useState("Nafta");
  const [gearbox, setGearbox] = useState("Jakákoli");
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title="Filtry" closeIcon right={<Pressable hitSlop={10} style={{ paddingHorizontal: 10 }}><T w="semibold" tone="brand">Vymazat</T></Pressable>} />
        <ScrollView contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}>
          <Field label="Značka a model"><Value text="Škoda Octavia" chevron /></Field>
          <Field label="Generace"><Value text="Octavia III (2013–2020)" chevron /></Field>
          <Field label="Cena"><View style={styles.two}><View style={{ flex: 1 }}><Value placeholder="od" /></View><View style={{ flex: 1 }}><Value text="300 000 Kč" /></View></View></Field>
          <Field label="Rok výroby od · Najeto do"><View style={styles.two}><View style={{ flex: 1 }}><Value text="2015" /></View><View style={{ flex: 1 }}><Value placeholder="km" /></View></View></Field>
          <Field label="Palivo"><View style={styles.wrap}>{FUELS.map((f) => <Chip key={f} label={f} on={fuel === f} onPress={() => setFuel(f)} />)}</View></Field>
          <Field label="Převodovka"><View style={styles.wrap}>{GEARBOXES.map((g) => <Chip key={g} label={g} on={gearbox === g} onPress={() => setGearbox(g)} />)}</View></Field>
          <Field label="Kraj"><Value placeholder="Celá ČR" chevron /></Field>
        </ScrollView>
        <ActionBar><Button label="Zobrazit 128 aut" kind="brand" flex onPress={() => router.back()} /></ActionBar>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  value: { height: 50, borderRadius: radius.field, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  two: { flexDirection: "row", gap: 10 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
