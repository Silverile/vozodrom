// Wire types only. No database rows, credentials, or runtime imports in this module.
import type { ModelCard } from "./modelCards";
import type { CatalogOp } from "./catalog-ops";
export type { CatalogOp } from "./catalog-ops";
export interface ReferenceOptionDto { value: string; label: string }
export interface FieldConstraintDto { required?: boolean; mustBeTrue?: boolean; minLength?: number; maxLength?: number; min?: number; max?: number; integer?: boolean; nullable?: boolean; allowZeroAsUnknown?: boolean; pattern?: string }
export interface ReferenceDataDto {
  version: 1; currentYear: number;
  entryCategories: ReferenceOptionDto[]; fuels: ReferenceOptionDto[]; bodies: ReferenceOptionDto[]; transmissions: ReferenceOptionDto[];
  drives: ReferenceOptionDto[]; colors: { options: ReferenceOptionDto[]; allowCustom: true };
  regions: ReferenceOptionDto[]; cities: { value: string; label: string; region: string; latitude: number; longitude: number }[];
  equipmentGroups: string[]; equipment: { key: string; label: string; group: string; aliases: string[] }[];
  moderationRules: ReferenceOptionDto[]; reportCategories: (ReferenceOptionDto & { anonymousAllowed: boolean })[]; messengers: ReferenceOptionDto[];
  limits: {
    listing: Record<string, FieldConstraintDto>; garage: Record<string, FieldConstraintDto>; entry: Record<string, FieldConstraintDto>;
    comment: FieldConstraintDto; message: FieldConstraintDto; listingReport: Record<string, FieldConstraintDto>;
    communityReport: { reason: FieldConstraintDto; goodFaithRequired: true };
    moderation: { listingReason: FieldConstraintDto; communityReason: FieldConstraintDto; ruleRequiredForRestriction: true };
    photos: { maxBytes: number; clientMaxSide: number; serverMaxSide: number; listingMaxCount: number; garageMaxCount: number; entryMaxCount: number; listingMinToPublish: number; mimeTypes: string[] };
    catalog: { maxOperationsPerSave: number; maxRequestBytes: number; drawingMaxBytes: number; drawingWidth: 960; drawingHeight: 600; drawingMimeType: "image/webp" };
    dates: { entryMin: string; entryMax: string };
  };
}
export interface ListingFormEngineDto { label: string; fuel: string | null; kwMin: number | null; kwMax: number | null }
export interface ListingFormGenerationDto {
  id: string; code: string | null; name: string | null; from: number | null; to: number | null;
  bodies: string[]; engines: ListingFormEngineDto[]; gearboxes: string[]; photo: string | null;
}
export interface ListingFormDto { makeSlug: string; lineSlug: string; generations: ListingFormGenerationDto[]; allowsCustomEngine: true; allowsCustomModel: true }
export interface CatalogEditDto { id: string; makeSlug: string; lineSlug: string; genIndex: number | null; field: string; value: string; createdAt: string }
export type CatalogPublicationStateDto = "saved" | "publication_requested" | "published";
export interface CatalogEditorDto {
  base: ModelCard; preview: ModelCard; rows: CatalogEditDto[]; conflicts: { id: string; reason: string }[];
  publicationState: "saved" | "published"; publishedEvidence: "served_assets_match" | null;
  maxOperationsPerSave: number; maxRequestBytes: number; origins: (number | null)[]; generationTokens: (string | null)[];
  previewDrawings: { index: number; src: string | null; overridden: boolean }[];
}
export interface CatalogEditLineDto { makeSlug: string; lineSlug: string; operationCount: number; lastSavedAt: string | null }
export interface CatalogPublicationDto {
  id: string; state: CatalogPublicationStateDto; dispatchAccepted: boolean | null; deploymentSucceeded: null;
  evidence: "served_assets_match" | null; requestedAt: string; trackingAvailable: boolean;
  superseded: boolean; conflicts: { makeSlug: string; lineSlug: string; reason: string }[];
}
export type RoleDto = "user" | "dealer" | "moderator" | "admin";
export interface PageDto<T> { items: T[]; nextCursor: string | null }
export interface OffsetPageDto<T> { items: T[]; page: number; pageSize: number; total: number }
export interface OkDto { ok: true }
export interface IdDto { id: string }
export interface ManagedPhotoDto extends PhotoDto { key: string }
export interface ListingInputDto {
  brand: string; model: string; generation: string; year: number; mileageKm: number; price: number;
  engine: string; fuel: string; transmission: string; powerKw: number; body: string; color: string;
  region: string; city: string; description: string; vin: string; features?: string[];
}
export interface ListingPatchDto { data?: ListingInputDto; phone?: string | null; messengers?: string[] }
export interface ListingActionDto { action: "submit" | "cancel" | "withdraw" | "approve" | "reject" | "takedown"; reason?: string; rule?: string }
export interface OwnerListingDto {
  id: string; data: ListingInputDto; status: "draft" | "pending" | "published" | "rejected" | "withdrawn";
  phone: string | null; messengers: string[]; photos: ManagedPhotoDto[]; rejectReason: string | null;
  moderationFlags: string[]; createdAt: string; updatedAt: string; submittedAt: string | null; publishedAt: string | null;
}
export interface GarageDataDto {
  brand: string; model: string; generation: string; nickname: string; year: number; purchaseYear: number;
  color: string; body: string; engine: string; fuel: string; powerKw: number; transmission: string;
  drive: string; vin: string; plate: string; plateVisible: boolean; story: string;
}
export interface GarageDetailDto { id: string; data: GarageDataDto; former: boolean; hiddenReason: string | null; photos: ManagedPhotoDto[]; updatedAt: string }
export interface EntryInputDto { title: string; body: string; category: string; costCzk: number | null; mileageKm: number | null; happenedOn: string }
export interface EntryDetailDto extends EntryInputDto { id: string; carId: string; hiddenReason: string | null; photos: ManagedPhotoDto[]; updatedAt: string }
export type CommunityKindDto = "car" | "entry" | "comment";
export interface CommunityReportInputDto { kind: CommunityKindDto; id: string; reason: string; goodFaith: boolean }
export interface ListingReportInputDto { listingId: string; category: string; explanation: string; name: string; email: string; goodFaith: boolean }
export interface MessageDto { id: string; senderId: string | null; body: string; link: string | null; createdAt: string }
export interface RealtimeTokenDto { token: string; unread: number; path: "/ws/zpravy" }
export interface AdminOverviewDto { users: number; bannedUsers: number; pendingListings: number; listingReports: number; communityReports: number }
export interface AdminListingDto extends OwnerListingDto { ownerId: string }
export interface AdminListingReportDto { id: string; listingId: string; category: string; explanation: string; notifierName: string; notifierEmail: string; createdAt: string; listing: AdminListingDto | null }
export interface AdminCommunityReportDto { id: string; kind: CommunityKindDto; targetId: string; reason: string; createdAt: string; preview: string | null; hidden: boolean | null }
export interface AdminUserDto { id: string; name: string; email: string; emailVerified: boolean; role: RoleDto; banned: boolean; banReason: string | null; banExpires: string | null; createdAt: string }
export interface ModerationDecisionDto { action: "hide" | "restore" | "dismiss"; reason?: string; rule?: string }
export interface PhotoDto { url: string; width: number; height: number }
export interface CapabilitiesDto {
  apiVersion: 1;
  sections: string[];
  auth: { email: true; google: boolean; apple: false; signup: boolean; bearer: true; expo: boolean };
  features: { push: false; catalogPublication: "deploy"; listingSearch: "sql-substring" };
}
export interface MeDto {
  id: string; name: string; email: string; emailVerified: boolean; role: RoleDto;
  permissions: { moderate: boolean; editArticles: boolean; editCatalog: boolean; manageUsers: boolean };
  unread: number;
}
export interface ListingDto {
  id: string; title: string; brandSlug: string; modelSlug: string; generation: string;
  year: number; mileageKm: number; price: number; engine: string; fuel: string;
  transmission: string; powerKw: number; body: string; color: string;
  region: string; city: string; sellerType: string; sellerName: string;
  vin: string; postedAt: string; features: string[]; description: string; photos: PhotoDto[];
  stkHistory: { date: string; odometerKm: number; result: string }[];
  battery: { capacityKwh: number; sohPercent: number | null; testedAt: string | null; testMethod: string | null; warrantyUntil: string | null } | null;
}
export interface ListingDetailDto {
  listing: ListingDto;
  contact: { phone: string | null; messengers: string[] };
  sellerId: string;
}
export interface StoryDto {
  id: string; carId: string; title: string; category: string; costCzk: number | null;
  mileageKm: number | null; happenedOn: string; photo: PhotoDto | null; carTitle: string;
  makeSlug: string; lineSlug: string; likes: number; comments: number; createdAt: string;
}
export interface MakeDto { slug: string; name: string; country: string | null; logoUrl: string | null }
export interface ModelLineDto { slug: string; name: string; from: number | null; to: number | null; current: boolean; bodyTypes: string[] }
export interface CatalogDto { make: MakeDto; line: ModelLineDto; cardUrl: string | null; webUrl: string }
export interface GarageCarDto {
  id: string; title: string; brand: string; model: string; generation: string; nickname: string;
  year: number; former: boolean; hiddenReason: string | null; photos: PhotoDto[]; updatedAt: string;
}
export interface ConversationDto {
  id: string; kind: "listing" | "system"; title: string; counterpart: string | null;
  listingId: string | null; lastMessageAt: string; preview: string; unread: number;
}
export interface ConversationsDto { items: ConversationDto[]; unread: number }
/** Query names deliberately match shareable web search URLs. */
export interface ListingQuery {
  cursor?: string; limit?: number; q?: string; znacka?: string; model?: string; generace?: string;
  palivo?: string; karoserie?: string; prevodovka?: string; kraj?: string; mesto?: string; okruh?: number;
  cenaOd?: number; cenaDo?: number; rokOd?: number; rokDo?: number; najezdOd?: number; najezdDo?: number;
  vykonOd?: number; vykonDo?: number; barva?: string; prodejce?: "soukromy" | "autobazar";
  vybava?: string; sVin?: "1"; sStk?: "1"; bezPoklesu?: "1"; sBaterii?: "1"; dobraCena?: "1";
  razeni?: "nejnovejsi" | "vyhodne" | "nejlevnejsi" | "nejdrazsi" | "najezd" | "rok" | "nejblize";
}
