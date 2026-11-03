import { userBan } from "@/lib/api-v1-admin";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ id: string }>((request, params) => userBan(request, params.id));
export const DELETE = endpoint<{ id: string }>((request, params) => userBan(request, params.id));
