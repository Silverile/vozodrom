import { listingDecision } from "@/lib/api-v1-admin";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ id: string }>((request, params) => listingDecision(request, params.id));
