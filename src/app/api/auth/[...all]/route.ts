import { getAuth } from "@/lib/auth";
import { handleAuthRequest, authPreflight } from "@/lib/auth-http";

// All Better Auth endpoints (sign-in, sign-up, OAuth callbacks, admin) under /api/auth/*.
// The site uses trailingSlash, so Next redirects /api/auth/x to /api/auth/x/; Better Auth's
// router only knows the slash-less paths, so the slash is dropped before handing over.
function handler(request: Request) {
  return handleAuthRequest(request, getAuth().handler);
}

export { handler as GET, handler as POST };
export const OPTIONS = authPreflight;
