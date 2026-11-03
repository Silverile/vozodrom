import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold, Barlow_800ExtraBold, useFonts } from "@expo-google-fonts/barlow";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useColors } from "../components/theme";

export default function RootLayout() {
  const [loaded] = useFonts({ Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold, Barlow_800ExtraBold });
  const c = useColors();
  const scheme = useColorScheme();
  if (!loaded) return null;
  return (
    <>
      <StatusBar style={scheme === "light" ? "dark" : "light"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pridat" options={{ presentation: "transparentModal", animation: "fade" }} />
        <Stack.Screen name="filtry" options={{ presentation: "modal" }} />
        <Stack.Screen name="prihlaseni" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
