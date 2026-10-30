// Short-lived signed tokens that let a browser open the chat WebSocket. The Next app issues them
// to a signed-in user (/api/zpravy/token/); the Worker entry checks them before the connection
// reaches the user's Inbox Durable Object. WebCrypto only, so both sides can use this file.

const TTL_SECONDS = 60;
const encoder = new TextEncoder();

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))));
}

export async function createWsToken(userId: string, secret: string): Promise<string> {
  const payload = `${userId}.${Math.floor(Date.now() / 1000) + TTL_SECONDS}`;
  return `${payload}.${await sign(`ws:${payload}`, secret)}`;
}

/** The user id when the token is genuine and not expired, else null. */
export async function verifyWsToken(token: string, secret: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, signature] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return null;
  const expected = await sign(`ws:${userId}.${exp}`, secret);
  // Constant-time comparison of equal-length strings.
  if (expected.length !== signature.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0 ? userId : null;
}
