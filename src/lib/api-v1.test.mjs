// Run: node --test src/lib/api-v1.test.mjs
// Real PostgreSQL dialect/queries and Better Auth sessions against an in-memory PGlite DB.
import assert from "node:assert/strict";
import { readFile, readdir, mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import { test, after } from "node:test";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { stripTypeScriptTypes } from "node:module";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins/bearer";
import { admin } from "better-auth/plugins/admin";
import { expo } from "@better-auth/expo";

const state = {};
globalThis[Symbol.for("vozodrom.api-v1.test")] = state;
const uri = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const stateRef = 'globalThis[Symbol.for("vozodrom.api-v1.test")]';
const authStub = uri(`export const getAuth = () => ${stateRef}.auth; export const getSession=async()=>${stateRef}.auth.api.getSession({headers:${stateRef}.legacyHeaders??new Headers()}); export const googleEnabled = () => false; export const signupOpen = () => false; export const STAFF_ROLES = ['moderator','admin']; export const ROLES=['user','dealer','moderator','admin']; export const hasRole=(session,roles)=>!!session&&roles.includes(session.user.role);`);
const dbStub = uri(`export const getDb = () => ${stateRef}.db;`);
const empty = uri("export {};");
const modules = new Map();
// File URLs let Node exercise the real circular domain imports (listing/chat/photo stores).
const moduleDirectory = await mkdtemp(join(tmpdir(), "vozodrom-v1-test-"));
after(async () => {
  if (dirname(resolve(moduleDirectory)) !== resolve(tmpdir()) || !moduleDirectory.includes("vozodrom-v1-test-")) throw new Error("Unexpected test module directory");
  await rm(moduleDirectory, { recursive: true, force: true });
});
async function moduleUrl(url) {
  if (modules.has(url.href)) return modules.get(url.href);
  const loaded = pathToFileURL(join(moduleDirectory, `${modules.size}.mjs`)).href;
  modules.set(url.href, loaded);
  if (url.pathname.endsWith(".json")) {
    await writeFile(new URL(loaded), `export default ${await readFile(url, "utf8")};`);
    return loaded;
  }
  const source = await readFile(url, "utf8");
  const js = stripTypeScriptTypes(source, { mode: "transform" });
  const imports = [...js.matchAll(/(?:from\s*|import\s*|import\(\s*)["']([^"']+)["']/g)];
  let result = js;
  for (const match of imports) {
    const specifier = match[1];
    let replacement;
    if (specifier === "server-only") replacement = empty;
    else if (specifier === "@/db") replacement = dbStub;
    else if (specifier === "./auth" || specifier === "@/lib/auth") replacement = authStub;
    else if (specifier === "@opennextjs/cloudflare") replacement = uri(`export const getCloudflareContext=()=>({env:${stateRef}.env,ctx:{waitUntil:(work)=>${stateRef}.pending.push(work)}});`);
    else if (specifier === "./mail") replacement = uri(`export const sendMail=async()=>{};`);
    else if (specifier === "./card-store") replacement = uri(`export const loadCard=async(make,line,options={})=>structuredClone(${stateRef}.cards?.[make+'--'+line]?.[options.base?'base':'published']);`);
    else if (specifier === "./catalog-built") replacement = uri(`export const builtLine=(make,line)=>${stateRef}.built?.[make+'--'+line];`);
    else if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const target = specifier.startsWith("@/") ? new URL(`../${specifier.slice(2)}`, import.meta.url) : new URL(specifier, url);
      if (!/\.(json|ts)$/.test(target.pathname)) target.pathname += ".ts";
      replacement = await moduleUrl(target);
    } else replacement = import.meta.resolve(specifier);
    result = result.replace(match[0], match[0].replace(specifier, replacement));
  }
  await writeFile(new URL(loaded), result); return loaded;
}

test("v1 public visibility, SQL filters, cursor ties and real bearer/cookie authorization", async () => {
  const pg = new PGlite();
  try {
    state.pending = []; state.photos = new Map();
    state.env = { BETTER_AUTH_URL: "http://localhost:3000", BETTER_AUTH_SECRET: "fixture-websocket-secret",
      PHOTOS: { put: async (key, bytes) => {
        if (state.failRecordUpdate && key.startsWith("internal/") && state.photos.has(key)) throw new Error("Fixture tracking failure");
        state.photos.set(key, typeof bytes === "string" ? new TextEncoder().encode(bytes) : new Uint8Array(bytes));
      }, get: async (key) => {
        const bytes = state.photos.get(key);
        return bytes ? { json: async () => JSON.parse(new TextDecoder().decode(bytes)) } : null;
      }, delete: async (keys) => {
        for (const key of Array.isArray(keys) ? keys : [keys]) state.photos.delete(key);
      } } };
    const root = new URL("../../", import.meta.url);
    const migrationDir = new URL("drizzle/", root);
    for (const name of (await readdir(migrationDir)).filter((n) => n.endsWith(".sql")).sort()) await pg.exec(await readFile(new URL(name, migrationDir), "utf8"));
    const schema = await import(await moduleUrl(new URL("../db/schema.ts", import.meta.url)));
    state.db = drizzle(pg, { schema });
    const { developmentWebOrigins } = await import(await moduleUrl(new URL("./development-cors.ts", import.meta.url)));
    state.auth = betterAuth({
      baseURL: "http://localhost:3000", secret: "test-only-secret-long-enough-for-better-auth-123456",
      database: drizzleAdapter(state.db, { provider: "pg", schema }),
      trustedOrigins: async () => ["vozodrom://", "vozodrom://*", ...developmentWebOrigins()],
      emailAndPassword: { enabled: true }, plugins: [admin(), bearer(), expo()], telemetry: { enabled: false },
    });
    const http = await import(await moduleUrl(new URL("./api-v1-http.ts", import.meta.url)));
    const search = await import(await moduleUrl(new URL("./api-v1-search.ts", import.meta.url)));
    const api = await import(await moduleUrl(new URL("./api-v1.ts", import.meta.url)));
    const signup = await state.auth.handler(new Request("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST", headers: { "content-type": "application/json", "expo-origin": "vozodrom://" },
      body: JSON.stringify({ name: "Fixture", email: "fixture@example.invalid", password: "fixture-password-12345" }),
    }));
    assert.equal(signup.status, 200);
    const signedUp = await signup.json();
    const bearerHeader = signup.headers.get("set-auth-token");
    assert.ok(bearerHeader);
    const request = new Request("http://localhost:3000/api/v1/me/", { headers: { Authorization: `Bearer ${bearerHeader}` } });
    assert.equal((await http.apiSession(request)).user.id, signedUp.user.id);
    const cookie = signup.headers.get("set-cookie").match(/(?:^|,\s*)(better-auth\.session_token=[^;]+)/)?.[1];
    assert.ok(cookie);
    assert.equal((await http.apiSession(new Request(request.url, { headers: { Cookie: cookie } }))).user.id, signedUp.user.id);
    const untrusted = await state.auth.handler(new Request("http://localhost:3000/api/auth/sign-in/email", {
      method: "POST", headers: { "content-type": "application/json", "expo-origin": "untrusted-fixture://" },
      body: JSON.stringify({ email: "fixture@example.invalid", password: "fixture-password-12345" }),
    }));
    assert.equal(untrusted.status, 403);
    assert.equal((await api.capabilities()).auth.expo, true);
    await assert.rejects(http.apiSession(new Request(request.url)), (e) => e.status === 401);
    await assert.rejects(http.apiSession(new Request(request.url, { headers: { Authorization: "Bearer invalid" } })), (e) => e.status === 401);
    await pg.query(`UPDATE "user" SET role='moderator' WHERE id=$1`, [signedUp.user.id]);
    assert.equal((await api.me(request)).permissions.moderate, true);
    await pg.query(`UPDATE "user" SET banned=true WHERE id=$1`, [signedUp.user.id]);
    await assert.rejects(http.apiSession(request), (e) => e.status === 401);
    await pg.query(`UPDATE "user" SET banned=false WHERE id=$1`, [signedUp.user.id]);
    await pg.query(`INSERT INTO "user" (id,name,email,banned) VALUES ('banned','Fixture','banned@example.invalid',true)`);
    const data = { brand: "skoda", model: "octavia", generation: "III", year: 2020, mileageKm: 60000, price: 300000,
      engine: "1.5 TSI", fuel: "benzin", transmission: "manuál", powerKw: 110, body: "kombi", color: "modrá", region: "Praha", city: "praha",
      description: "Fixture", vin: "", features: ["klimatizace"] };
    for (const [id, owner, status, price] of [["a", signedUp.user.id, "published", 100000], ["b", signedUp.user.id, "published", 100000], ["c", signedUp.user.id, "published", 200000], ["draft", signedUp.user.id, "draft", 50000], ["blocked", "banned", "published", 50000]]) {
      await pg.query(`INSERT INTO listing (id,user_id,status,data,published_at) VALUES ($1,$2,$3,$4,'2026-11-01T12:00:00.123456Z')`, [id, owner, status, { ...data, price }]);
    }
    let page = await search.searchListings(new URLSearchParams({ limit: "1", razeni: "nejlevnejsi" }));
    assert.deepEqual(page.items.map((item) => item.id), ["a"]);
    assert.equal("userId" in page.items[0], false);
    const second = await search.searchListings(new URLSearchParams({ limit: "1", razeni: "nejlevnejsi", cursor: page.nextCursor }));
    assert.deepEqual(second.items.map((item) => item.id), ["b"]);
    const third = await search.searchListings(new URLSearchParams({ limit: "1", razeni: "nejlevnejsi", cursor: second.nextCursor }));
    assert.deepEqual(third.items.map((item) => item.id), ["c"]); assert.equal(third.nextCursor, null);
    await assert.rejects(search.searchListings(new URLSearchParams({ razeni: "nejdrazsi", cursor: page.nextCursor })), (e) => e.status === 400);
    await assert.rejects(search.searchListings(new URLSearchParams({ cursor: "%%%" })), (e) => e.status === 400);
    await assert.rejects(search.searchListings(new URLSearchParams({ limit: "-1" })), (e) => e.status === 400);
    await assert.rejects(search.searchListings(new URLSearchParams({ cenaDo: "NaN" })), (e) => e.status === 400);
    assert.deepEqual((await search.searchListings(new URLSearchParams({ cenaOd: "150000", znacka: "skoda", karoserie: "kombi", mesto: "praha", okruh: "25" }))).items.map((i) => i.id), ["c"]);
    assert.equal((await search.searchListings(new URLSearchParams({ q: "' OR 1=1 --" }))).items.length, 0);
    assert.equal((await search.searchListings(new URLSearchParams({ q: "Škoda TSI" }))).items.length, 3);
    const near = await search.searchListings(new URLSearchParams({ razeni: "nejblize", mesto: "praha", okruh: "100", limit: "1" }));
    assert.deepEqual(near.items.map((item) => item.id), ["a"]);
    assert.deepEqual((await search.searchListings(new URLSearchParams({ razeni: "nejblize", mesto: "praha", okruh: "100", limit: "1", cursor: near.nextCursor }))).items.map((item) => item.id), ["b"]);
    assert.equal((await search.searchListings(new URLSearchParams({ prodejce: "autobazar" }))).items.length, 0);
    assert.equal((await search.searchListings(new URLSearchParams({ sStk: "1" }))).items.length, 0);
    await assert.rejects(api.listingDetail("draft"), (e) => e.status === 404);
    await assert.rejects(api.listingDetail("blocked"), (e) => e.status === 404);
    assert.deepEqual(Object.keys((await api.listingDetail("a")).contact).sort(), ["messengers", "phone"]);
    await pg.query(`INSERT INTO garage_car (id,user_id,make_slug,line_slug,data) VALUES ('car',$1,'skoda','octavia',$2)`, [signedUp.user.id, { ...data, nickname: "Fixture" }]);
    for (const [id, hidden] of [["entry-a", null], ["entry-b", null], ["entry-hidden", "Fixture restriction"]]) await pg.query(
      `INSERT INTO log_entry(id,car_id,user_id,title,category,happened_on,created_at,hidden_reason) VALUES ($1,'car',$2,'Fixture','servis','2026-11-01','2026-11-01T12:00:00.123456Z',$3)`, [id, signedUp.user.id, hidden]);
    const firstStory = await api.stories(new URLSearchParams({ limit: "1" }));
    const nextStory = await api.stories(new URLSearchParams({ limit: "1", cursor: firstStory.nextCursor }));
    assert.deepEqual([...firstStory.items, ...nextStory.items].map((i) => i.id), ["entry-b", "entry-a"]);
    assert.equal(nextStory.nextCursor, null);
    await pg.query(`UPDATE garage_car SET hidden_reason='Fixture restriction' WHERE id='car'`);
    assert.equal((await api.stories(new URLSearchParams())).items.length, 0);

    // Writes exercise the same real stores as the web, including their authorization and review.
    const writes = await import(await moduleUrl(new URL("./api-v1-write.ts", import.meta.url)));
    const adminApi = await import(await moduleUrl(new URL("./api-v1-admin.ts", import.meta.url)));
    const listingRoute = await import(await moduleUrl(new URL("../app/api/v1/listings/route.ts", import.meta.url)));
    const { EMPTY_CAR } = await import(await moduleUrl(new URL("./garage.ts", import.meta.url)));
    const { verifyWsToken } = await import(await moduleUrl(new URL("./ws-token.ts", import.meta.url)));
    const identity = async (suffix, role = "user") => {
      const response = await state.auth.api.signUpEmail({ body: { name: "Fixture", email: `${suffix}@example.invalid`, password: "fixture-password-12345" }, asResponse: true });
      assert.equal(response.status, 200);
      const body = await response.json();
      await pg.query(`UPDATE "user" SET role=$1 WHERE id=$2`, [role, body.user.id]);
      return { id: body.user.id, token: response.headers.get("set-auth-token") };
    };
    await pg.query(`UPDATE "user" SET role='user' WHERE id=$1`, [signedUp.user.id]);
    const owner = { id: signedUp.user.id, token: bearerHeader };
    const other = await identity("other"), staff = await identity("staff", "moderator"), administrator = await identity("administrator", "admin");
    const req = (actor, path, method = "GET", body, headers = {}) => new Request(`http://localhost:3000/api/v1/${path}`, {
      method, headers: { ...(actor ? { Authorization: `Bearer ${actor.token}` } : {}), ...(body !== undefined ? { "Content-Type": body instanceof ArrayBuffer ? "image/jpeg" : "application/json" } : {}), ...headers },
      ...(body !== undefined ? { body: body instanceof ArrayBuffer ? body : JSON.stringify(body) } : {}),
    });
    const invoke = (fn, request, ...args) => http.handle(() => fn(request, ...args), request);
    const validDraft = { ...data, model: "Fixture Model", generation: "" };
    assert.equal((await listingRoute.POST(req(null, "listings", "POST", { data: validDraft }), { params: Promise.resolve({}) })).status, 401);
    const created = await listingRoute.POST(req(owner, "listings", "POST", { data: validDraft }), { params: Promise.resolve({}) });
    assert.equal(created.status, 201);
    const ownedId = (await created.json()).id;
    assert.ok((await writes.myListings(req(owner, "me/listings"))).items.some((item) => item.id === ownedId));
    assert.equal((await invoke(writes.patchListing, req(other, "listings", "PATCH", { data: validDraft }), ownedId)).status, 404);
    assert.equal((await invoke(writes.patchListing, req(staff, "listings", "PATCH", { data: validDraft }), ownedId)).status, 404);
    assert.equal((await invoke(writes.removeListing, req(other, "listings", "DELETE"), ownedId)).status, 404);
    assert.equal((await invoke(writes.patchListing, req(owner, "listings", "PATCH", { phone: "invalid" }), ownedId)).status, 422);
    const jpegSegment = (marker, payload) => Buffer.from([255, marker, (payload.length + 2) >> 8, (payload.length + 2) & 255, ...payload]);
    const jpeg = Buffer.concat([Buffer.from([255,216]), jpegSegment(225, Buffer.from("Exif\0\0FixtureGPS")), Buffer.from([255,218,0,2,0x21,255,0,0x22,255,217])]);
    const bytes = jpeg.buffer.slice(jpeg.byteOffset, jpeg.byteOffset + jpeg.byteLength);
    assert.equal((await invoke(writes.listingPhotos, req(other, "photos?w=2&h=2", "POST", bytes), ownedId)).status, 404);
    const photo = await writes.listingPhotos(req(owner, "photos?w=2&h=2", "POST", bytes), ownedId);
    const photo2 = await writes.listingPhotos(req(owner, "photos?w=2&h=2", "POST", bytes), ownedId);
    assert.equal(Buffer.from(state.photos.get(photo.key)).includes(Buffer.from("Exif")), false);
    assert.equal((await invoke(writes.listingPhotos, req(owner, "photos/order", "PATCH", { order: [photo.key, photo.key] }), ownedId)).status, 400);
    assert.deepEqual(await writes.listingPhotos(req(owner, "photos/order", "PATCH", { order: [photo2.key, photo.key] }), ownedId), { ok: true });
    assert.equal((await invoke(writes.listingPhotos, req(owner, "photos?w=2&h=2", "POST", new ArrayBuffer(3 * 1024 * 1024 + 1)), ownedId)).status, 413);
    assert.equal((await invoke(writes.listingAction, req(other, "actions", "POST", { action: "submit" }), ownedId)).status, 404);
    assert.equal((await writes.listingAction(req(owner, "actions", "POST", { action: "submit" }), ownedId)).status, "published");
    assert.equal((await invoke(writes.listingAction, req(owner, "actions", "POST", { action: "reject", rule: "spam", reason: "Fixture restriction" }), ownedId)).status, 404);
    assert.equal((await invoke(writes.listingAction, req(staff, "actions", "POST", { action: "takedown" }), ownedId)).status, 422);
    assert.equal((await writes.listingAction(req(staff, "actions", "POST", { action: "takedown", rule: "spam", reason: "Fixture restriction" }), ownedId)).status, "rejected");
    assert.equal((await writes.patchListing(req(owner, "listing", "PATCH", { data: validDraft }), ownedId)).status, "draft");
    const pendingId = (await writes.newListing(req(other, "listings", "POST", { data: validDraft }))).id;
    await writes.listingPhotos(req(other, "photos?w=2&h=2", "POST", bytes), pendingId);
    assert.equal((await writes.listingAction(req(other, "actions", "POST", { action: "submit" }), pendingId)).status, "pending");
    assert.equal((await writes.listingAction(req(staff, "actions", "POST", { action: "approve" }), pendingId)).status, "published");
    const carData = { ...EMPTY_CAR, brand: "skoda", model: "Fixture Model", year: 2020 };
    const carId = (await writes.newCar(req(owner, "me/garage", "POST", { data: carData }))).id;
    assert.equal((await invoke(writes.garageDetail, req(other, "garage"), carId)).status, 404);
    assert.equal((await writes.garageDetail(req(staff, "garage", "PATCH", { data: { ...carData, nickname: "Fixture edit" } }), carId)).data.nickname, "Fixture edit");
    const entryData = { title: "Fixture entry", body: "Fixture text", category: "servis", happenedOn: "2026-11-01", costCzk: 100, mileageKm: 1000 };
    assert.equal((await invoke(writes.newEntry, req(other, "entries", "POST", entryData), carId)).status, 404);
    assert.equal((await invoke(writes.newEntry, req(staff, "entries", "POST", entryData), carId)).status, 404);
    const entryId = (await writes.newEntry(req(owner, "entries", "POST", entryData), carId)).id;
    assert.ok((await writes.garageEntries(req(owner, "entries"), carId)).items.some((item) => item.id === entryId));
    assert.equal((await invoke(writes.garageEntries, req(other, "entries"), carId)).status, 404);
    assert.equal((await invoke(writes.entryDetail, req(other, "entries", "PATCH", entryData), entryId)).status, 404);
    assert.equal((await writes.entryDetail(req(staff, "entries", "PATCH", { ...entryData, title: "Fixture staff edit" }), entryId)).title, "Fixture staff edit");
    const carPhoto = await writes.garagePhotos(req(owner, "photos?w=2&h=2", "POST", bytes), carId, "car");
    assert.equal((await invoke(writes.garagePhotos, req(other, `photos?key=${encodeURIComponent(carPhoto.key)}`, "DELETE"), carId, "car")).status, 404);
    assert.deepEqual(await writes.reaction(req(other, "like", "PUT"), entryId, "entry-like"), { count: 1 });
    assert.deepEqual(await writes.reaction(req(other, "like", "PUT"), entryId, "entry-like"), { count: 1 });
    assert.equal((await invoke(writes.reaction, req(owner, "like", "PUT"), entryId, "entry-like")).status, 409);
    const commentId = (await writes.newComment(req(other, "comments", "POST", { body: "Fixture comment" }), entryId)).id;
    assert.equal((await invoke(writes.removeComment, req(owner, "comments", "DELETE"), commentId)).status, 404);
    await writes.removeComment(req(staff, "comments", "DELETE"), commentId);
    assert.equal((await invoke(adminApi.adminOverview, req(owner, "admin/overview"))).status, 403);
    assert.equal(typeof (await adminApi.adminOverview(req(staff, "admin/overview"))).pendingListings, "number");
    assert.equal((await invoke(adminApi.adminUsers, req(staff, "admin/users"))).status, 403);
    assert.ok((await adminApi.adminUsers(req(administrator, "admin/users"))).items.some((item) => item.id === owner.id));
    await writes.communityReport(req(other, "community-reports", "POST", { kind: "entry", id: entryId, reason: "Fixture report reason", goodFaith: true }));
    assert.equal((await adminApi.adminCommunityReports(req(staff, "admin/community-reports"))).total, 1);
    assert.equal((await invoke(adminApi.communityDecision, req(owner, "decision", "POST", { action: "hide", rule: "spam", reason: "Fixture restriction" }), "entry", entryId)).status, 403);
    await adminApi.communityDecision(req(staff, "decision", "POST", { action: "hide", rule: "spam", reason: "Fixture restriction" }), "car", carId);
    assert.equal((await invoke(writes.newComment, req(other, "comments", "POST", { body: "Fixture comment" }), entryId)).status, 404);
    assert.equal((await invoke(writes.reaction, req(other, "like", "PUT"), entryId, "entry-like")).status, 404);
    await adminApi.communityDecision(req(staff, "decision", "POST", { action: "restore" }), "car", carId);
    const chatId = (await writes.newConversation(req(other, "conversations", "POST", { listingId: "a" }))).id;
    assert.equal((await invoke(writes.conversationMessages, req(staff, "messages"), chatId)).status, 404);
    const sent = await writes.conversationMessages(req(other, "messages", "POST", { body: "Fixture message" }), chatId);
    assert.equal(sent.body, "Fixture message");
    assert.equal((await writes.conversationMessages(req(owner, "messages"), chatId)).items.at(-1).id, sent.id);
    await writes.readConversation(req(owner, "read", "POST"), chatId);
    const ws = await writes.realtimeToken(req(owner, "realtime/token"));
    assert.equal(await verifyWsToken(ws.token, state.env.BETTER_AUTH_SECRET), owner.id);
    await writes.listingReport(req(null, "listing-reports", "POST", { listingId: "a", category: "deti", explanation: "Fixture report explanation", name: "", email: "", goodFaith: true }));
    assert.equal((await adminApi.adminListingReports(req(staff, "admin/listing-reports"))).total, 1);
    await adminApi.listingDecision(req(staff, "decision", "POST", { decision: "remove", reason: "Fixture restriction", rule: "spam" }), "a");
    await adminApi.userRole(req(administrator, "role", "PATCH", { role: "dealer" }), other.id);
    assert.equal((await http.apiSession(req(other, "me"))).user.role, "dealer");
    assert.equal((await invoke(adminApi.userRole, req(staff, "role", "PATCH", { role: "admin" }), other.id)).status, 403);
    assert.equal((await invoke(adminApi.userRole, req(administrator, "role", "PATCH", { role: "user" }), administrator.id)).status, 409);
    await adminApi.userBan(req(administrator, "ban", "POST", { reason: "Fixture restriction", expiresIn: 60 }), other.id);
    assert.equal((await invoke(writes.myListings, req(other, "me/listings"))).status, 401);
    await adminApi.userBan(req(administrator, "ban", "DELETE"), other.id);
    assert.equal((await pg.query(`SELECT banned FROM "user" WHERE id=$1`, [other.id])).rows[0].banned, false);
    // Development CORS applies to success, auth errors and preflight; production stays closed.
    const originalMode = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "development";
      const authRoute = await import(await moduleUrl(new URL("../app/api/auth/[...all]/route.ts", import.meta.url)));
      const webLogin = (origin) => new Request("http://localhost:3000/api/auth/sign-in/email/", { method: "POST",
        headers: { "content-type": "application/json", Origin: origin }, body: JSON.stringify({ email: "fixture@example.invalid", password: "fixture-password-12345" }) });
      const localLogin = await authRoute.POST(webLogin("http://localhost:8081"));
      assert.equal(localLogin.status, 200);
      assert.equal(localLogin.headers.get("access-control-allow-origin"), "http://localhost:8081");
      assert.ok(localLogin.headers.get("set-cookie").includes("session_token="));
      const authOptions = authRoute.OPTIONS(new Request("http://localhost:3000/api/auth/sign-in/email/", { method: "OPTIONS", headers: { Origin: "http://localhost:8081" } }));
      assert.equal(authOptions.headers.get("access-control-allow-credentials"), "true");
      const foreignLogin = await authRoute.POST(webLogin("http://untrusted.example.invalid"));
      assert.equal(foreignLogin.status, 403); assert.equal(foreignLogin.headers.has("access-control-allow-origin"), false);
      const dev = req(null, "listings", "POST", { data: validDraft }, { Origin: "http://localhost:8081" });
      const denied = await listingRoute.POST(dev, { params: Promise.resolve({}) });
      assert.equal(denied.status, 401); assert.equal(denied.headers.get("access-control-allow-origin"), "http://localhost:8081");
      const preflight = listingRoute.OPTIONS(req(null, "listings", "OPTIONS", undefined, { Origin: "http://localhost:8081" }));
      assert.equal(preflight.status, 204); assert.equal(preflight.headers.get("access-control-allow-credentials"), "true");
      const evil = await listingRoute.POST(req(owner, "listings", "POST", { data: validDraft }, { Origin: "https://untrusted.example.invalid" }), { params: Promise.resolve({}) });
      assert.equal(evil.status, 403); assert.equal(evil.headers.has("access-control-allow-origin"), false);
      process.env.NODE_ENV = "production";
      assert.equal(listingRoute.OPTIONS(req(null, "listings", "OPTIONS", undefined, { Origin: "http://localhost:8081" })).headers.has("access-control-allow-origin"), false);
      const productionLogin = await authRoute.POST(webLogin("http://localhost:8081"));
      assert.equal(productionLogin.status, 403); assert.equal(productionLogin.headers.has("access-control-allow-origin"), false);
      assert.equal((await authRoute.POST(webLogin("http://localhost:3000"))).status, 200);
    } finally { if (originalMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalMode; }

    const referenceRoute = await import(await moduleUrl(new URL("../app/api/v1/reference-data/route.ts", import.meta.url)));
    const referenceResponse = await referenceRoute.GET(req(null, "reference-data"), { params: Promise.resolve({}) });
    assert.equal(referenceResponse.status, 200); assert.match(referenceResponse.headers.get("cache-control"), /^public, max-age=/);
    assert.equal(referenceResponse.headers.get("vary"), "Origin"); assert.equal(referenceResponse.headers.has("set-cookie"), false);
    const reference = await referenceResponse.json();
    assert.ok(reference.fuels.some((option) => option.value === "benzin"));
    assert.ok(reference.cities.some((option) => option.value === "praha" && option.region === "Praha"));
    assert.equal(reference.colors.allowCustom, true);
    assert.equal(reference.reportCategories.find((option) => option.value === "deti").anonymousAllowed, true);
    const draftModule = await import(await moduleUrl(new URL("./listing-draft.ts", import.meta.url)));
    assert.equal(draftModule.cleanDraft({ ...validDraft, description: "x".repeat(reference.limits.listing.description.maxLength + 1) }).description.length, reference.limits.listing.description.maxLength);
    assert.ok(draftModule.draftFieldProblems({ ...validDraft, price: reference.limits.listing.price.min - 1 }).price);

    const { modelLinesOf } = await import(await moduleUrl(new URL("./makes.ts", import.meta.url)));
    const { generationId } = draftModule;
    const generation = modelLinesOf("skoda").find((line) => line.slug === "octavia").generations.find((g) => g.from !== null && g.from <= 2019 && (g.to === null || g.to >= 2019));
    assert.ok(generation);
    const baseCard = { name: "Fixture model", segment: null, summary: "Fixture base", generations: [{
      code: generation.code, name: "Fixture generation", from: generation.from, to: generation.to, current: false,
      bodyTypes: ["kombi"], drivetrains: ["fwd"], transmissions: [{ type: "manual", gears: 6 }], markets: [], trims: [],
      facelifts: [], dimensionsMm: null, trunkL: 500, photo: null,
      engines: [{ fuel: "petrol", displacementCc: 1498, displacementLitresNominal: 1.5, powerKwMin: 110, powerKwMax: 110, variant: "1.5 TSI" }],
    }] };
    const catalogKey = "skoda--octavia";
    state.cards = { [catalogKey]: { base: structuredClone(baseCard), published: structuredClone(baseCard) } }; state.built = {};
    const formRoute = await import(await moduleUrl(new URL("../app/api/v1/catalog/[make]/[line]/form/route.ts", import.meta.url)));
    const formResponse = await formRoute.GET(req(null, "catalog/skoda/octavia/form?year=2019"), { params: Promise.resolve({ make: "skoda", line: "octavia" }) });
    assert.equal(formResponse.status, 200);
    const form = await formResponse.json(), choice = form.generations.find((g) => g.id === generationId(generation));
    assert.ok(choice); assert.deepEqual(choice.gearboxes, ["manuál"]); assert.deepEqual(choice.bodies, ["kombi"]);
    assert.deepEqual(choice.engines[0], { label: "1.5 TSI", fuel: "benzin", kwMin: 110, kwMax: 110 });
    const oldForm = await import(await moduleUrl(new URL("../app/api/katalog/[make]/[line]/route.ts", import.meta.url)));
    const oldHints = await (await oldForm.GET(req(null, "catalog"), { params: Promise.resolve({ make: "skoda", line: "octavia" }) })).json();
    assert.deepEqual(oldHints.generations[0].engines, choice.engines);
    assert.equal((await formRoute.GET(req(null, "form?year=NaN"), { params: Promise.resolve({ make: "skoda", line: "octavia" }) })).status, 400);

    const catalog = await import(await moduleUrl(new URL("./api-v1-catalog.ts", import.meta.url)));
    const publicationHelpers = await import(await moduleUrl(new URL("./catalog-publication.ts", import.meta.url)));
    const operations = await import(await moduleUrl(new URL("./catalog-ops.ts", import.meta.url)));
    assert.equal((await invoke(catalog.catalogEditor, req(owner, "admin/catalog"), "skoda", "octavia")).status, 403);
    assert.equal((await invoke(catalog.catalogEditor, req(staff, "admin/catalog"), "skoda", "octavia")).status, 403);
    assert.equal((await catalog.catalogEditor(req(administrator, "admin/catalog"), "skoda", "octavia")).publicationState, "published");
    const saved = await catalog.saveCatalogOperations(req(administrator, "operations", "POST", { ops: [{ op: "set", path: ["summary"], expect: "Fixture base", value: "Fixture edited" }] }), "skoda", "octavia");
    assert.equal(saved.state, "saved"); assert.equal(saved.rows.length, 1);
    assert.equal((await catalog.catalogEditor(req(administrator, "admin/catalog"), "skoda", "octavia")).publicationState, "saved");
    assert.equal((await invoke(catalog.saveCatalogOperations, req(administrator, "operations", "POST", { ops: [{ op: "set", path: ["summary"], expect: "stale value", value: "Fixture stale" }] }), "skoda", "octavia")).status, 409);
    assert.equal((await invoke(catalog.deleteCatalogOperation, req(staff, "operations", "DELETE"), saved.rows[0].id)).status, 403);
    state.legacyHeaders = req(administrator, "drawing").headers;
    assert.equal((await invoke(catalog.catalogDrawing, req(owner, "drawing", "POST", new ArrayBuffer(0)), "skoda", "octavia")).status, 403);
    assert.equal((await invoke(catalog.catalogDrawing, req(administrator, "drawing", "POST", new ArrayBuffer(0)), "skoda", "octavia")).status, 413);
    const webp = Buffer.alloc(32); webp.write("RIFF"); webp.writeUInt32LE(24, 4); webp.write("WEBPVP8 ", 8); webp.writeUInt32LE(11, 16);
    webp.set([0x9d, 1, 0x2a], 23); webp.writeUInt16LE(960, 26); webp.writeUInt16LE(600, 28);
    const drawing = await catalog.catalogDrawing(req(administrator, "drawing", "POST", webp.buffer.slice(webp.byteOffset, webp.byteOffset + webp.byteLength)), "skoda", "octavia");
    assert.match(drawing.src, /^\/foto\/katalog\/skoda--octavia--[a-z0-9]+\.webp$/);
    await catalog.saveCatalogOperations(req(administrator, "operations", "POST", { ops: [{ op: "drawing", index: 0, src: drawing.src }] }), "skoda", "octavia");
    const originalFetch = globalThis.fetch;
    let dispatches = 0;
    state.env.GITHUB_DEPLOY_TOKEN = "fixture-deploy-token";
    try {
      globalThis.fetch = async (url, init) => {
        assert.match(String(url), /^https:\/\/api.github.com\/repos\/Silverile\/vozodrom\/actions\/workflows\/deploy-cloudflare.yml\/dispatches$/);
        assert.equal(init.method, "POST"); assert.deepEqual(JSON.parse(init.body), { ref: "main" }); dispatches++;
        return new Response(null, { status: 204 });
      };
      const publishedRequest = await catalog.requestCatalogPublication(req(administrator, "publications", "POST", {}));
      assert.equal(dispatches, 1); assert.equal(publishedRequest.state, "publication_requested");
      assert.equal(publishedRequest.dispatchAccepted, true); assert.equal(publishedRequest.deploymentSucceeded, null);
      assert.equal((await catalog.catalogPublicationStatus(req(administrator, "publication"), publishedRequest.id)).state, "publication_requested");
      const editor = await catalog.catalogEditor(req(administrator, "admin/catalog"), "skoda", "octavia");
      state.cards[catalogKey].published = structuredClone(editor.preview);
      // Card JSON alone cannot prove that a separately stored drawing was published.
      assert.equal((await catalog.catalogPublicationStatus(req(administrator, "publication"), publishedRequest.id)).state, "publication_requested");
      const replay = operations.applyOps(baseCard, editor.rows.map((row, index) => operations.rowToOp(row, index)));
      const projected = publicationHelpers.artifactProjection("skoda", "octavia", replay);
      state.built[catalogKey] = { origins: projected.origins, drawings: projected.drawings, faceliftDrawings: projected.faceliftDrawings, generations: [] };
      const visiblePublication = await catalog.catalogPublicationStatus(req(administrator, "publication"), publishedRequest.id);
      assert.equal(visiblePublication.state, "published"); assert.equal(visiblePublication.evidence, "served_assets_match");
      assert.equal(visiblePublication.deploymentSucceeded, null);
      await catalog.saveCatalogOperations(req(administrator, "operations", "POST", { ops: [{ op: "set", path: ["summary"], expect: "Fixture edited", value: "Fixture newer" }] }), "skoda", "octavia");
      assert.equal((await catalog.catalogPublicationStatus(req(administrator, "publication"), publishedRequest.id)).superseded, true);
      assert.equal((await catalog.catalogEditor(req(administrator, "editor"), "skoda", "octavia")).publicationState, "saved");
      state.failRecordUpdate = true;
      const partiallyTracked = await catalog.requestCatalogPublication(req(administrator, "publications", "POST", { makeSlug: "skoda", lineSlug: "octavia" }));
      assert.equal(partiallyTracked.dispatchAccepted, true); assert.equal(partiallyTracked.trackingAvailable, false);
      state.failRecordUpdate = false;
      const photoRoute = await import(await moduleUrl(new URL("../app/foto/[...key]/route.ts", import.meta.url)));
      assert.equal((await photoRoute.GET(req(null, "photo"), { params: Promise.resolve({ key: ["internal", "catalog-publications", `${publishedRequest.id}.json`] }) })).status, 404);
      await catalog.deleteCatalogOperation(req(administrator, "operations", "DELETE"), saved.rows[0].id);
      assert.ok((await catalog.catalogEditor(req(administrator, "editor"), "skoda", "octavia")).conflicts.length > 0);
      assert.equal((await invoke(catalog.requestCatalogPublication, req(administrator, "publications", "POST", {}))).status, 409);
    } finally { globalThis.fetch = originalFetch; state.failRecordUpdate = false; }

    const response = await http.handle(async () => { throw new Error("sensitive database input"); });
    assert.equal(response.status, 500); assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal((await response.text()).includes("sensitive"), false);
  } finally { await Promise.allSettled(state.pending ?? []); await pg.close(); delete globalThis[Symbol.for("vozodrom.api-v1.test")]; }
});

test("native client forwards fresh credentials only to private endpoints and preserves API failures", async () => {
  const { createApiClient, ApiError } = await import(await moduleUrl(new URL("../../mobile/lib/api/client.ts", import.meta.url)));
  let cookie = "first", calls = [];
  const client = createApiClient({ baseUrl: "https://api.example.invalid", getSessionHeaders: async () => cookie ? ({ Cookie: cookie }) : ({}), fetch: async (url, init) => {
    calls.push({ url, init }); return Response.json({ items: [], nextCursor: null });
  } });
  await client.listings({ q: "a & b", cenaDo: 200000 });
  assert.equal(calls[0].init.headers.has("Cookie"), false);
  assert.equal(new URL(calls[0].url).searchParams.get("q"), "a & b");
  await client.me(); cookie = "second"; await client.me();
  assert.equal(calls[1].init.headers.get("Cookie"), "first"); assert.equal(calls[2].init.headers.get("Cookie"), "second");
  assert.equal(calls[1].init.credentials, "omit");
  cookie = ""; await client.me();
  assert.equal(calls[3].init.headers.has("Cookie"), false);
  assert.equal(calls[3].init.credentials, "include");
  assert.equal(client.assetUrl("/foto/fixture.webp"), "https://api.example.invalid/foto/fixture.webp");
  cookie = "write-session";
  await client.listingAction("fixture-id", { action: "submit" });
  assert.equal(calls[4].init.method, "POST");
  assert.equal(calls[4].init.headers.get("Cookie"), "write-session");
  assert.deepEqual(JSON.parse(calls[4].init.body), { action: "submit" });
  const upload = new Uint8Array([1, 2, 3]).buffer;
  await client.uploadListingPhoto("fixture-id", { body: upload, width: 2, height: 3, contentType: "image/webp" });
  assert.equal(calls[5].init.body, upload);
  assert.equal(calls[5].init.headers.get("Content-Type"), "image/webp");
  assert.equal(new URL(calls[5].url).searchParams.get("w"), "2");
  const denied = createApiClient({ fetch: async () => Response.json({ error: { code: "unauthorized", message: "Fixture" } }, { status: 401 }) });
  await assert.rejects(denied.me(), (error) => error instanceof ApiError && error.status === 401 && error.code === "unauthorized");
  const { nextAuthFetch } = await import(await moduleUrl(new URL("../../mobile/lib/api/auth-fetch.ts", import.meta.url)));
  const previousFetch = globalThis.fetch;
  let authUrl;
  try {
    globalThis.fetch = async (input) => { authUrl = input instanceof Request ? input.url : String(input); return Response.json({}); };
    await nextAuthFetch("https://api.example.invalid/api/auth/sign-in/email", { method: "POST", body: "{}" });
    assert.equal(authUrl, "https://api.example.invalid/api/auth/sign-in/email/");
    await nextAuthFetch(new Request("https://api.example.invalid/api/auth/get-session?fixture=1"));
    assert.equal(authUrl, "https://api.example.invalid/api/auth/get-session/?fixture=1");
  } finally { globalThis.fetch = previousFetch; }
});

test("photo metadata stripping preserves encoded payload and removes JPEG/WebP private metadata", async () => {
  const { stripPhotoMetadata } = await import(await moduleUrl(new URL("./photo-metadata.ts", import.meta.url)));
  const chunk = (name, payload) => {
    const result = Buffer.alloc(8 + payload.length + (payload.length & 1));
    result.write(name, 0, 4, "ascii"); result.writeUInt32LE(payload.length, 4); payload.copy(result, 8); return result;
  };
  const extended = Buffer.alloc(10); extended[0] = 0x0c;
  const pixels = Buffer.from("Fixture encoded pixel payload");
  const chunks = Buffer.concat([chunk("VP8X", extended), chunk("VP8 ", pixels), chunk("EXIF", Buffer.from("Fixture GPS")), chunk("XMP ", Buffer.from("Fixture metadata"))]);
  const header = Buffer.alloc(12); header.write("RIFF"); header.writeUInt32LE(chunks.length + 4, 4); header.write("WEBP", 8);
  const input = Buffer.concat([header, chunks]);
  const output = Buffer.from(stripPhotoMetadata(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength)));
  assert.ok(output.includes(pixels));
  assert.equal(output.includes(Buffer.from("Fixture GPS")), false);
  assert.equal(output.includes(Buffer.from("Fixture metadata")), false);
  assert.equal(output[20] & 0x0c, 0);
  assert.equal(output.readUInt32LE(4) + 8, output.length);
  const malformed = Buffer.from(input); malformed.writeUInt32LE(0xffffffff, 4);
  assert.throws(() => stripPhotoMetadata(malformed.buffer.slice(malformed.byteOffset, malformed.byteOffset + malformed.byteLength)), (error) => error.status === 415);
  const jpeg = Buffer.from([255,216,255,225,0,8,69,120,105,102,0,0,255,218,0,2,0x21,255,0,0x22,255,217]);
  const jpegOutput = Buffer.from(stripPhotoMetadata(jpeg.buffer.slice(jpeg.byteOffset, jpeg.byteOffset + jpeg.byteLength)));
  assert.equal(jpegOutput.includes(Buffer.from("Exif")), false);
  assert.ok(jpegOutput.includes(Buffer.from([0x21,255,0,0x22])));
});

test("publication evidence matches artifacts produced by the actual catalog build script", async () => {
  const { artifactProjection } = await import(await moduleUrl(new URL("./catalog-publication.ts", import.meta.url)));
  const { applyOps, rowToOp } = await import(await moduleUrl(new URL("./catalog-ops.ts", import.meta.url)));
  const fixtureRoot = join(moduleDirectory, "build-parity");
  const target = resolve(fixtureRoot, "public/katalog-data");
  assert.ok(target.startsWith(resolve(moduleDirectory) + "/") || target.startsWith(resolve(moduleDirectory) + "\\"));
  for (const directory of ["scripts", "src/lib", "src/data"]) await mkdir(join(fixtureRoot, directory), { recursive: true });
  const project = new URL("../../", import.meta.url);
  for (const filename of ["scripts/app-model-cards.mjs", "src/lib/catalog-ops.ts", "src/data/front-drawings.json", "src/data/front-drawing-review.json"])
    await writeFile(join(fixtureRoot, filename), await readFile(new URL(filename, project)));
  const gen = (code, from) => ({ code, name: code, from, to: from + 10, current: false, bodyTypes: [], engines: [], transmissions: [], drivetrains: [], markets: [], trims: [], dimensionsMm: null, trunkL: null, photo: null,
    facelifts: [{ year: from + 5, to: null, name: "Fixture facelift", code: null, note: null, photo: null, drawing: "/foto/katalog/fixture.webp" }] });
  const base = { name: "Fixture model", segment: null, summary: "Fixture base", generations: [gen("A", 1990), gen("B", 2000)] };
  await writeFile(join(fixtureRoot, "src/data/model-cards-index.json"), JSON.stringify({ skoda: { octavia: base } }));
  for (const ops of [
    [{ op: "set", path: ["generations", 0, "from"], value: 1991, expect: 1990 }, { op: "drawing", index: 0, src: "/foto/katalog/fixture-front.webp" }],
    [{ op: "move", path: ["generations"], from: 1, to: 0 }, { op: "drawing", index: 1, src: null }],
    [{ op: "remove", path: ["generations", 0] }],
  ]) {
    const rows = ops.map((op, index) => ({ id: `fixture-${index}`, makeSlug: "skoda", lineSlug: "octavia", genIndex: null, field: "op", value: JSON.stringify(op), createdAt: "2026-11-01T00:00:00Z" }));
    await writeFile(join(fixtureRoot, "src/data/catalog-edits.json"), JSON.stringify({ edits: rows }));
    const child = spawnSync(process.execPath, [join(fixtureRoot, "scripts/app-model-cards.mjs")], { cwd: fixtureRoot, encoding: "utf8" });
    assert.equal(child.status, 0, child.stderr);
    const built = JSON.parse(await readFile(join(fixtureRoot, "src/data/catalog-built.json"), "utf8")).lines["skoda--octavia"];
    const card = JSON.parse(await readFile(join(fixtureRoot, "public/katalog-data/skoda/octavia.json"), "utf8"));
    const actual = { card, origins: built.origins, drawings: built.drawings, faceliftDrawings: built.faceliftDrawings };
    const expected = artifactProjection("skoda", "octavia", applyOps(base, rows.map((row, index) => rowToOp(row, index))));
    assert.deepEqual(expected, actual);
  }
});
