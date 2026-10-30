import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { headers } from "next/headers";
import { cache } from "react";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { sendMail } from "./mail";

export const ROLES = ["user", "dealer", "moderator", "admin"] as const;
export type Role = (typeof ROLES)[number];

/** Roles that may open /admin. Only admins manage users; moderators get content queues. */
export const STAFF_ROLES: readonly Role[] = ["moderator", "admin"];

export function googleEnabled(): boolean {
  const { env } = getCloudflareContext();
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

/** New accounts are accepted only with SIGNUP_OPEN=true (closed until e-mail sending works). */
export function signupOpen(): boolean {
  return getCloudflareContext().env.SIGNUP_OPEN === "true";
}

// Built per request because the database connection is per request (see src/db).
export const getAuth = cache(() => {
  const { env } = getCloudflareContext();
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    telemetry: { enabled: false },
    emailAndPassword: {
      enabled: true,
      disableSignUp: !signupOpen(),
      requireEmailVerification: true,
      minPasswordLength: 10,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Obnovení hesla na Vozodromu",
          text: `Dobrý den,\n\npro nastavení nového hesla otevřete tento odkaz (platí 1 hodinu):\n${url}\n\nPokud jste o změnu nežádali, zprávu ignorujte.`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Potvrďte svůj e-mail na Vozodromu",
          text: `Dobrý den,\n\npro dokončení registrace potvrďte e-mail tímto odkazem:\n${url}\n\nPokud jste se neregistrovali, zprávu ignorujte.`,
        });
      },
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, disableSignUp: !signupOpen() } }
        : undefined,
    account: { accountLinking: { enabled: true, trustedProviders: ["google"] } },
    plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] }), nextCookies()],
  });
});

export type Session = NonNullable<Awaited<ReturnType<ReturnType<typeof getAuth>["api"]["getSession"]>>>;

/** The signed-in user's session for the current request, or null. */
export const getSession = cache(async (): Promise<Session | null> => {
  return getAuth().api.getSession({ headers: await headers() });
});

export function hasRole(session: Session | null, roles: readonly Role[]): boolean {
  return Boolean(session && roles.includes(session.user.role as Role));
}
