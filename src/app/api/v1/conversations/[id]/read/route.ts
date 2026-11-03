import { readConversation } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ id: string }>((request, params) => readConversation(request, params.id));
