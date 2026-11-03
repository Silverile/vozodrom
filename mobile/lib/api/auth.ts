import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { API_BASE_URL, createApiClient } from "./client";
import { nextAuthFetch } from "./auth-fetch";

/** Native cookies and cached sessions belong to the Expo plugin's SecureStore adapter.
 * Use authClient.signIn.email/social, signUp.email, signOut and useSession in screens.
 * No token is duplicated into component state, AsyncStorage, or the API client.
 */
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: { customFetchImpl: nextAuthFetch },
  plugins: [expoClient({ scheme: "vozodrom", storagePrefix: "vozodrom", storage: SecureStore })],
});

/** Existing imports from mobile/lib/api now use the current SecureStore session automatically. */
export const api = createApiClient({
  getSessionHeaders: async () => {
    // On web the browser owns HttpOnly cookies; SecureStore has no web implementation.
    if (Platform.OS === "web") return new Headers();
    const cookie = await authClient.getCookie();
    const headers = new Headers();
    if (cookie) headers.set("Cookie", cookie);
    return headers;
  },
});
