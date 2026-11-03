import type {
  CapabilitiesDto, MeDto, PageDto, ListingDto, ListingDetailDto, StoryDto, MakeDto,
  ModelLineDto, CatalogDto, GarageCarDto, ConversationsDto, ListingQuery,
  OkDto, IdDto, OwnerListingDto, ListingInputDto, ListingPatchDto, ListingActionDto, ManagedPhotoDto,
  GarageDataDto, GarageDetailDto, EntryInputDto, EntryDetailDto, CommunityKindDto, CommunityReportInputDto,
  ListingReportInputDto, MessageDto, RealtimeTokenDto, OffsetPageDto, AdminOverviewDto, AdminListingDto,
  AdminListingReportDto, AdminCommunityReportDto, AdminUserDto, ModerationDecisionDto, RoleDto,
  ReferenceDataDto, ListingFormDto, CatalogEditorDto, CatalogEditDto, CatalogOp, CatalogEditLineDto, CatalogPublicationDto,
} from "./types";

// Expo inlines this exact env access; the native client needs no Node runtime/types.
declare const process: { env: { EXPO_PUBLIC_API_URL?: string } };
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://vozodrom.cz").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message); this.name = "ApiError";
  }
}
export interface ApiClientOptions {
  baseUrl?: string;
  /** Expo: asynchronously await authClient.getCookie(). Bearer: return Authorization.
   * Read credentials at request time so sign-out/account changes never reuse an old token.
   * Persist credentials with SecureStore in the auth layer, never in this client.
   */
  getSessionHeaders?: () => HeadersInit | Promise<HeadersInit>;
  fetch?: typeof fetch;
  timeoutMs?: number;
}
export interface RequestOptions { signal?: AbortSignal }
export interface StoryQuery { znacka?: string; model?: string; tema?: string; cursor?: string; limit?: number }
export interface AdminQuery { page?: number; limit?: number; q?: string; status?: OwnerListingDto["status"] }
export interface PhotoUpload { body: Blob | ArrayBuffer; width: number; height: number; contentType: "image/jpeg" | "image/webp" }
type Query = Record<string, string | number | undefined>;
export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = (options.baseUrl ?? API_BASE_URL).replace(/\/+$/, "");
  const parsedBase = new URL(baseUrl);
  if (!["https:", "http:"].includes(parsedBase.protocol) || parsedBase.username || parsedBase.password || parsedBase.search || parsedBase.hash)
    throw new Error("Invalid API base URL");
  const transport = options.fetch ?? globalThis.fetch;
  async function get<T>(path: string, query: Query = {}, request: RequestOptions = {}, authenticated = false,
    mutation?: { method: string; body?: unknown; photo?: PhotoUpload }): Promise<T> {
    const url = new URL(`${baseUrl}/api/v1/${path.replace(/^\/+|\/+$/g, "")}/`);
    for (const [key, value] of Object.entries(query)) if (value !== undefined) url.searchParams.set(key, String(value));
    const headers = new Headers(authenticated ? await options.getSessionHeaders?.() : undefined);
    headers.set("Accept", "application/json");
    let body: BodyInit | undefined;
    if (mutation?.photo) { headers.set("Content-Type", mutation.photo.contentType); body = mutation.photo.body; }
    else if (mutation?.body !== undefined) { headers.set("Content-Type", "application/json"); body = JSON.stringify(mutation.body); }
    const abort = new AbortController();
    let timedOut = false;
    const onAbort = () => abort.abort();
    request.signal?.addEventListener("abort", onAbort, { once: true });
    if (request.signal?.aborted) abort.abort();
    const timer = setTimeout(() => { timedOut = true; abort.abort(); }, options.timeoutMs ?? 15000);
    try {
      // Native cookie jars can overwrite a Cookie header supplied from SecureStore.
      const manualSession = headers.has("Cookie") || headers.has("Authorization");
      const response = await transport(url.toString(), { method: mutation?.method ?? "GET", headers, body, credentials: authenticated && !manualSession ? "include" : "omit", signal: abort.signal });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const error = (data as { error?: { code?: unknown; message?: unknown } } | null)?.error;
        throw new ApiError(response.status, typeof error?.code === "string" ? error.code : "http_error",
          typeof error?.message === "string" ? error.message : "Požadavek se nepodařilo zpracovat.");
      }
      if (data === null) throw new ApiError(response.status, "invalid_response", "Neplatná odpověď serveru.");
      return data as T;
    } catch (error) {
      if (timedOut) throw new ApiError(0, "timeout", "Server neodpověděl včas.");
      if (request.signal?.aborted || error instanceof ApiError) throw error;
      throw new ApiError(0, "network_error", "Nepodařilo se připojit k serveru.");
    } finally {
      clearTimeout(timer);
      request.signal?.removeEventListener("abort", onAbort);
    }
  }
  const segment = encodeURIComponent;
  const send = <T>(path: string, method: string, body?: unknown, request?: RequestOptions) => get<T>(path, {}, request, true, { method, body });
  const upload = (path: string, photo: PhotoUpload, request?: RequestOptions) => get<ManagedPhotoDto>(path, { w: photo.width, h: photo.height }, request, true, { method: "POST", photo });
  const deletePhoto = (path: string, key: string, request?: RequestOptions) => get<OkDto>(path, { key }, request, true, { method: "DELETE" });
  return {
    baseUrl,
    /** Resolve public relative photo/card URLs. Never attach session headers to asset requests. */
    assetUrl: (path: string) => new URL(path, `${baseUrl}/`).toString(),
    capabilities: (request?: RequestOptions) => get<CapabilitiesDto>("capabilities", {}, request),
    referenceData: (request?: RequestOptions) => get<ReferenceDataDto>("reference-data", {}, request),
    me: (request?: RequestOptions) => get<MeDto>("me", {}, request, true),
    listings: (query: ListingQuery = {}, request?: RequestOptions) => get<PageDto<ListingDto>>("listings", { ...query }, request),
    listing: (id: string, request?: RequestOptions) => get<ListingDetailDto>(`listings/${encodeURIComponent(id)}`, {}, request),
    stories: (query: StoryQuery = {}, request?: RequestOptions) => get<PageDto<StoryDto>>("stories", { ...query }, request),
    makes: (request?: RequestOptions) => get<{ items: MakeDto[] }>("catalog/makes", {}, request),
    modelLines: (make: string, request?: RequestOptions) => get<{ items: ModelLineDto[] }>(`catalog/makes/${encodeURIComponent(make)}/lines`, {}, request),
    catalog: (make: string, line: string, request?: RequestOptions) => get<CatalogDto>(`catalog/${encodeURIComponent(make)}/${encodeURIComponent(line)}`, {}, request),
    listingForm: (make: string, line: string, year?: number, request?: RequestOptions) => get<ListingFormDto>(`catalog/${segment(make)}/${segment(line)}/form`, { year }, request),
    garage: (request?: RequestOptions) => get<{ items: GarageCarDto[] }>("me/garage", {}, request, true),
    conversations: (request?: RequestOptions) => get<ConversationsDto>("conversations", {}, request, true),
    myListings: (request?: RequestOptions) => get<{ items: OwnerListingDto[] }>("me/listings", {}, request, true),
    createListing: (data: ListingInputDto, request?: RequestOptions) => send<IdDto>("listings", "POST", { data }, request),
    updateListing: (id: string, data: ListingPatchDto, request?: RequestOptions) => send<OwnerListingDto>(`listings/${segment(id)}`, "PATCH", data, request),
    deleteListing: (id: string, request?: RequestOptions) => send<OkDto>(`listings/${segment(id)}`, "DELETE", undefined, request),
    listingAction: (id: string, action: ListingActionDto, request?: RequestOptions) => send<OwnerListingDto>(`listings/${segment(id)}/actions`, "POST", action, request),
    uploadListingPhoto: (id: string, photo: PhotoUpload, request?: RequestOptions) => upload(`listings/${segment(id)}/photos`, photo, request),
    deleteListingPhoto: (id: string, key: string, request?: RequestOptions) => deletePhoto(`listings/${segment(id)}/photos`, key, request),
    orderListingPhotos: (id: string, order: string[], request?: RequestOptions) => send<OkDto>(`listings/${segment(id)}/photos/order`, "PATCH", { order }, request),
    createCar: (data: GarageDataDto, request?: RequestOptions) => send<IdDto>("me/garage", "POST", { data }, request),
    garageCar: (id: string, request?: RequestOptions) => get<GarageDetailDto>(`garage/${segment(id)}`, {}, request, true),
    updateCar: (id: string, data: GarageDataDto, former?: boolean, request?: RequestOptions) => send<GarageDetailDto>(`garage/${segment(id)}`, "PATCH", { data, former }, request),
    deleteCar: (id: string, request?: RequestOptions) => send<OkDto>(`garage/${segment(id)}`, "DELETE", undefined, request),
    createEntry: (carId: string, data: EntryInputDto, request?: RequestOptions) => send<IdDto>(`garage/${segment(carId)}/entries`, "POST", data, request),
    garageEntries: (carId: string, query: { cursor?: string; limit?: number } = {}, request?: RequestOptions) => get<PageDto<EntryDetailDto>>(`garage/${segment(carId)}/entries`, { ...query }, request, true),
    entry: (id: string, request?: RequestOptions) => get<EntryDetailDto>(`entries/${segment(id)}`, {}, request, true),
    updateEntry: (id: string, data: EntryInputDto, request?: RequestOptions) => send<EntryDetailDto>(`entries/${segment(id)}`, "PATCH", data, request),
    deleteEntry: (id: string, request?: RequestOptions) => send<OkDto>(`entries/${segment(id)}`, "DELETE", undefined, request),
    uploadCarPhoto: (id: string, photo: PhotoUpload, request?: RequestOptions) => upload(`garage/${segment(id)}/photos`, photo, request),
    deleteCarPhoto: (id: string, key: string, request?: RequestOptions) => deletePhoto(`garage/${segment(id)}/photos`, key, request),
    orderCarPhotos: (id: string, order: string[], request?: RequestOptions) => send<OkDto>(`garage/${segment(id)}/photos/order`, "PATCH", { order }, request),
    uploadEntryPhoto: (id: string, photo: PhotoUpload, request?: RequestOptions) => upload(`entries/${segment(id)}/photos`, photo, request),
    deleteEntryPhoto: (id: string, key: string, request?: RequestOptions) => deletePhoto(`entries/${segment(id)}/photos`, key, request),
    orderEntryPhotos: (id: string, order: string[], request?: RequestOptions) => send<OkDto>(`entries/${segment(id)}/photos/order`, "PATCH", { order }, request),
    likeCar: (id: string, on: boolean, request?: RequestOptions) => send<{ count: number }>(`stories/cars/${segment(id)}/like`, on ? "PUT" : "DELETE", undefined, request),
    followCar: (id: string, on: boolean, request?: RequestOptions) => send<{ count: number }>(`stories/cars/${segment(id)}/follow`, on ? "PUT" : "DELETE", undefined, request),
    likeEntry: (id: string, on: boolean, request?: RequestOptions) => send<{ count: number }>(`stories/entries/${segment(id)}/like`, on ? "PUT" : "DELETE", undefined, request),
    addComment: (id: string, body: string, request?: RequestOptions) => send<IdDto>(`stories/entries/${segment(id)}/comments`, "POST", { body }, request),
    deleteComment: (id: string, request?: RequestOptions) => send<OkDto>(`comments/${segment(id)}`, "DELETE", undefined, request),
    reportCommunity: (data: CommunityReportInputDto, request?: RequestOptions) => send<OkDto>("community-reports", "POST", data, request),
    reportListing: (data: ListingReportInputDto, request?: RequestOptions) => send<OkDto>("listing-reports", "POST", data, request),
    openConversation: (listingId: string, request?: RequestOptions) => send<IdDto>("conversations", "POST", { listingId }, request),
    messages: (id: string, before?: string, request?: RequestOptions) => get<{ items: MessageDto[]; nextBefore: string | null }>(`conversations/${segment(id)}/messages`, { before }, request, true),
    sendMessage: (id: string, body: string, request?: RequestOptions) => send<MessageDto>(`conversations/${segment(id)}/messages`, "POST", { body }, request),
    readConversation: (id: string, request?: RequestOptions) => send<OkDto>(`conversations/${segment(id)}/read`, "POST", undefined, request),
    realtimeToken: (request?: RequestOptions) => get<RealtimeTokenDto>("realtime/token", {}, request, true),
    adminOverview: (request?: RequestOptions) => get<AdminOverviewDto>("admin/overview", {}, request, true),
    adminListings: (query: AdminQuery = {}, request?: RequestOptions) => get<OffsetPageDto<AdminListingDto>>("admin/listings", { ...query }, request, true),
    adminListingReports: (query: AdminQuery = {}, request?: RequestOptions) => get<OffsetPageDto<AdminListingReportDto>>("admin/listing-reports", { ...query }, request, true),
    adminCommunityReports: (query: AdminQuery = {}, request?: RequestOptions) => get<OffsetPageDto<AdminCommunityReportDto>>("admin/community-reports", { ...query }, request, true),
    decideListingReports: (id: string, data: { decision: "remove" | "dismiss"; reason: string; rule?: string }, request?: RequestOptions) => send<OkDto>(`admin/listing-reports/${segment(id)}/decision`, "POST", data, request),
    decideCommunity: (kind: CommunityKindDto, id: string, data: ModerationDecisionDto, request?: RequestOptions) => send<OkDto>(`admin/community/${kind}/${segment(id)}/decision`, "POST", data, request),
    adminUsers: (query: AdminQuery = {}, request?: RequestOptions) => get<OffsetPageDto<AdminUserDto>>("admin/users", { ...query }, request, true),
    setUserRole: (id: string, role: RoleDto, request?: RequestOptions) => send<OkDto>(`admin/users/${segment(id)}/role`, "PATCH", { role }, request),
    banUser: (id: string, reason: string, expiresIn?: number, request?: RequestOptions) => send<OkDto>(`admin/users/${segment(id)}/ban`, "POST", { reason, expiresIn }, request),
    unbanUser: (id: string, request?: RequestOptions) => send<OkDto>(`admin/users/${segment(id)}/ban`, "DELETE", undefined, request),
    catalogEdits: (request?: RequestOptions) => get<{ items: CatalogEditLineDto[] }>("admin/catalog", {}, request, true),
    catalogEditor: (make: string, line: string, request?: RequestOptions) => get<CatalogEditorDto>(`admin/catalog/${segment(make)}/${segment(line)}`, {}, request, true),
    saveCatalogOperations: (make: string, line: string, ops: CatalogOp[], request?: RequestOptions) => send<{ rows: CatalogEditDto[]; state: "saved" }>(`admin/catalog/${segment(make)}/${segment(line)}/operations`, "POST", { ops }, request),
    deleteCatalogOperation: (id: string, request?: RequestOptions) => send<OkDto>(`admin/catalog/operations/${segment(id)}`, "DELETE", undefined, request),
    uploadCatalogDrawing: (make: string, line: string, body: Blob | ArrayBuffer, request?: RequestOptions) => get<{ src: string }>(`admin/catalog/${segment(make)}/${segment(line)}/drawing`, {}, request, true,
      { method: "POST", photo: { body, contentType: "image/webp", width: 960, height: 600 } }),
    /** Dispatch publishes globally; an optional target limits which model this tracking record verifies. */
    publishCatalog: (target: { makeSlug: string; lineSlug: string } | undefined = undefined, request?: RequestOptions) => send<CatalogPublicationDto>("admin/catalog/publications", "POST", target ?? {}, request),
    catalogPublication: (id: string, request?: RequestOptions) => get<CatalogPublicationDto>(`admin/catalog/publications/${segment(id)}`, {}, request, true),
  };
}
