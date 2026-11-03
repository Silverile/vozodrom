import { myListings } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request, params) => myListings(request));
