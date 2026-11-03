import { communityReport } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint((request, params) => communityReport(request));
