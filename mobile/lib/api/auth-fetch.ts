/** Next uses trailingSlash=true. Avoid its preflight redirect before the auth route can add CORS. */
export const nextAuthFetch: typeof fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (url.pathname.startsWith("/api/auth/") && !url.pathname.endsWith("/")) url.pathname += "/";
  return globalThis.fetch(input instanceof Request ? new Request(url, input) : url.toString(), init);
};
