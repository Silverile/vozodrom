import { removeComment } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const DELETE = endpoint<{ id: string }>((request, params) => removeComment(request, params.id));
