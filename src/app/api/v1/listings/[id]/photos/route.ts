import { listingPhotos } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ id: string }>((request, params) => listingPhotos(request, params.id), 201);
export const DELETE = endpoint<{ id: string }>((request, params) => listingPhotos(request, params.id));
