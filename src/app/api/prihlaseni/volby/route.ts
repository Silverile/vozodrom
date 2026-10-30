import { googleEnabled, signupOpen } from "@/lib/auth";

// What the sign-in dialog may offer. These come from Worker variables, which prerendered pages cannot read.
export function GET() {
  return Response.json({ google: googleEnabled(), signupOpen: signupOpen() }, { headers: { "cache-control": "public, max-age=300" } });
}
