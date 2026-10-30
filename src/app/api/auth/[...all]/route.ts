import { getAuth } from "@/lib/auth";

// All Better Auth endpoints (sign-in, sign-up, OAuth callbacks, admin) under /api/auth/*.
// The site uses trailingSlash, so Next redirects /api/auth/x to /api/auth/x/; Better Auth's
// router only knows the slash-less paths, so the slash is dropped before handing over.
function handler(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    request = new Request(url, request);
  }
  return getAuth().handler(request);
}

export { handler as GET, handler as POST };
