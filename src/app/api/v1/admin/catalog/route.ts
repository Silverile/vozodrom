import { catalogOverview } from "@/lib/api-v1-catalog";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request) => catalogOverview(request));
