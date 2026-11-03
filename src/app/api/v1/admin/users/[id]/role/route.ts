import { userRole } from "@/lib/api-v1-admin";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const PATCH = endpoint<{ id: string }>((request, params) => userRole(request, params.id));
