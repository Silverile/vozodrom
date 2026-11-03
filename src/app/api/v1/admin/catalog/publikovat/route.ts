import { requestCatalogPublication } from "@/lib/api-v1-catalog";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint((request) => requestCatalogPublication(request), 202);
