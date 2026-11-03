import { garagePhotos } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const PATCH = endpoint<{ id: string }>((request, params) => garagePhotos(request, params.id, "car"));
