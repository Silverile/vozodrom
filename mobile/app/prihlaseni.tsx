import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEMO, useRemote } from "../components/data";
import { font, radius, useColors, noWebOutline } from "../components/theme";
import { Button, Card, Chip, Screen, T, TopBar } from "../components/ui";
import { api, authClient } from "../lib/api";

type Mode = "signin" | "signup";
const MIN_PASSWORD = 10; // matches emailAndPassword.minPasswordLength on the server
// Expo Go opens links with its own exp:// scheme, which production auth does not trust,
// so Google sign-in can only return to an installed build with the vozodrom:// scheme.
const IN_EXPO_GO = Constants.executionEnvironment === "storeClient";

function Input({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  const c = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6, marginBottom: 14 }}>
      <T w="semibold" tone="muted">{label}</T>
      <TextInput
        placeholderTextColor={c.muted}
        selectionColor={c.brand}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[noWebOutline, styles.input, { backgroundColor: c.field, color: c.ink, borderColor: focused ? c.brand : "transparent" }]}
        {...props}
      />
      {hint ? <T s="small" tone="muted">{hint}</T> : null}
    </View>
  );
}

export default function SignIn() {
  const c = useColors();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const caps = useRemote("capabilities", (signal) => (DEMO ? Promise.resolve(null) : api.capabilities({ signal })));
  const google = (caps.data?.auth.google ?? false) && !IN_EXPO_GO;
  const signupOpen = caps.data?.auth.signup ?? true;

  const valid = /.+@.+\..+/.test(email.trim()) && password.length >= (mode === "signup" ? MIN_PASSWORD : 1) && (mode === "signin" || name.trim().length > 1);

  async function submit() {
    setBusy(true);
    setError(null);
    const result = mode === "signin"
      ? await authClient.signIn.email({ email: email.trim(), password })
      : await authClient.signUp.email({ email: email.trim(), password, name: name.trim() });
    setBusy(false);
    if (result.error) {
      setError(messageFor(result.error.status, mode));
      return;
    }
    if (mode === "signup") setSent(true);
    else router.back();
  }

  async function withGoogle() {
    setError(null);
    const result = await authClient.signIn.social({ provider: "google", callbackURL: "/profil" });
    if (result.error) setError("Přihlášení přes Google se nepovedlo. Zkuste to znovu.");
  }

  if (sent) {
    return (
      <Screen>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <TopBar title="Registrace" closeIcon />
          <View style={{ padding: 16, gap: 10 }}>
            <T w="bold" s="title">Potvrďte svůj e-mail</T>
            <T tone="muted">Poslali jsme odkaz na {email.trim()}. Po kliknutí na něj budete přihlášeni. Odkaz najdete i ve složce Hromadné nebo Spam.</T>
            <Button label="Rozumím" kind="brand" onPress={() => router.back()} />
          </View>
        </SafeAreaView>
      </Screen>
    );
  }

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <TopBar title={mode === "signin" ? "Přihlášení" : "Registrace"} closeIcon />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 18 }}>
              <Chip label="Mám účet" on={mode === "signin"} onPress={() => { setMode("signin"); setError(null); }} />
              <Chip label="Nový účet" on={mode === "signup"} onPress={() => { setMode("signup"); setError(null); }} />
            </View>
            {mode === "signup" && !signupOpen ? (
              <Card><T>Registrace je teď dočasně uzavřená. Zkuste to prosím později.</T></Card>
            ) : (
              <>
                {mode === "signup" && <Input label="Přezdívka" placeholder="Jak vás uvidí ostatní" value={name} onChangeText={setName} autoComplete="nickname" textContentType="nickname" />}
                <Input label="E-mail" placeholder="vas@email.cz" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
                <Input
                  label="Heslo"
                  placeholder={mode === "signup" ? `Alespoň ${MIN_PASSWORD} znaků` : "Vaše heslo"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  textContentType={mode === "signup" ? "newPassword" : "password"}
                  onSubmitEditing={valid ? submit : undefined}
                />
                {error ? <View style={[styles.error, { backgroundColor: c.warnSoft }]}><T tone="warn" w="semibold">{error}</T></View> : null}
                <Button label={busy ? "Čekejte…" : mode === "signin" ? "Přihlásit se" : "Vytvořit účet"} kind={valid && !busy ? "primary" : "quiet"} onPress={valid && !busy ? submit : undefined} />
                {google && (
                  <View style={{ marginTop: 10 }}><Button label="Pokračovat přes Google" kind="quiet" onPress={withGoogle} /></View>
                )}
                {mode === "signin" && (
                  <Pressable onPress={() => Linking.openURL(`${api.baseUrl}/zapomenute-heslo/`)} hitSlop={10} style={{ alignSelf: "center", marginTop: 18, padding: 6 }}>
                    <T w="semibold" tone="brand">Zapomněli jste heslo?</T>
                  </Pressable>
                )}
                {mode === "signup" && (
                  <T s="small" tone="muted" style={{ marginTop: 14 }}>Registrací souhlasíte s podmínkami a zásadami ochrany soukromí Vozodromu.</T>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

function messageFor(status: number | undefined, mode: Mode) {
  if (status === 401 || status === 400) return mode === "signin" ? "E-mail nebo heslo nesedí." : "Zkontrolujte e-mail a heslo.";
  if (status === 403) return mode === "signin" ? "Nejdřív potvrďte e-mail odkazem, který jsme vám poslali." : "Registrace teď není možná.";
  if (status === 422) return "Účet s tímto e-mailem už existuje. Přihlaste se.";
  if (status === 429) return "Příliš mnoho pokusů. Zkuste to za chvíli.";
  return "Nepodařilo se spojit se serverem. Zkuste to znovu.";
}

const styles = StyleSheet.create({
  input: { height: 52, borderRadius: radius.field, paddingHorizontal: 14, fontFamily: font.semibold, fontSize: 16, borderWidth: 2 },
  error: { borderRadius: radius.field, padding: 12, marginBottom: 12 },
});
