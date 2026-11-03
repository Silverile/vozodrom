import { listingDetail } from "@/lib/api-v1";
import { patchListing, removeListing } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ id: string }>((request, params) => listingDetail(params.id));
export const PATCH = endpoint<{ id: string }>((request, params) => patchListing(request, params.id));
export const DELETE = endpoint<{ id: string }>((request, params) => removeListing(request, params.id));
