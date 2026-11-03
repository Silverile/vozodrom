import { conversationMessages } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ id: string }>((request, params) => conversationMessages(request, params.id));
export const POST = endpoint<{ id: string }>((request, params) => conversationMessages(request, params.id), 201);
