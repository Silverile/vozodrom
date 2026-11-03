import { catalogLines } from "@/lib/api-v1";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ make: string }>((request, params) => catalogLines(params.make));
