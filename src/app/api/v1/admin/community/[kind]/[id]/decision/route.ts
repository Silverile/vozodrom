import { communityDecision } from "@/lib/api-v1-admin";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ kind: string; id: string }>((request, params) => communityDecision(request, params.kind, params.id));
