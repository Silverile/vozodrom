export const DEVELOPMENT_WEB_ORIGIN = "http://localhost:8081";
export const developmentWebOrigins = () => process.env.NODE_ENV === "development" ? [DEVELOPMENT_WEB_ORIGIN] : [];

/** Credentials are allowed for exactly the local Expo web origin, exclusively in development. */
export function withDevelopmentCors(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const vary = new Set((headers.get("vary") ?? "").split(",").map((v) => v.trim()).filter(Boolean));
  vary.add("Origin"); headers.set("vary", [...vary].join(", "));
  if (process.env.NODE_ENV === "development" && request.headers.get("origin") === DEVELOPMENT_WEB_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", DEVELOPMENT_WEB_ORIGIN);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Expo-Origin");
    headers.set("Access-Control-Expose-Headers", "set-auth-token");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
