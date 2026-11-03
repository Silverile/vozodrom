import { adminUsers } from "@/lib/api-v1-admin";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request, params) => adminUsers(request));
