import { stories } from "@/lib/api-v1";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request, params) => stories(new URL(request.url).searchParams));
