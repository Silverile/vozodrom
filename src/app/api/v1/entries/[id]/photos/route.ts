import { garagePhotos } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ id: string }>((request, params) => garagePhotos(request, params.id, "entry"), 201);
export const DELETE = endpoint<{ id: string }>((request, params) => garagePhotos(request, params.id, "entry"));
