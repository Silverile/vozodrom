import { catalogLine } from "@/lib/api-v1";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ make: string; line: string }>((request, params) => catalogLine(params.make, params.line));
