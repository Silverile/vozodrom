import { conversations } from "@/lib/api-v1";
import { newConversation } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request, params) => conversations(request));
export const POST = endpoint((request, params) => newConversation(request), 201);
