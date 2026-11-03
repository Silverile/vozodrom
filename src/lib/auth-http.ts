import { withDevelopmentCors } from "./development-cors";

/** Keep the existing slash normalization; decorate successes and errors alike. */
export async function handleAuthRequest(request: Request, handler: (request: Request) => Promise<Response>) {
  const url = new URL(request.url);
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    request = new Request(url, request);
  }
  return withDevelopmentCors(await handler(request), request);
}
export function authPreflight(request: Request) {
  return withDevelopmentCors(new Response(null, { status: 204, headers: { Allow: "GET, HEAD, POST, OPTIONS", "cache-control": "no-store" } }), request);
}
