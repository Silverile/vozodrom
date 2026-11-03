import { reaction } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const PUT = endpoint<{ id: string }>((request, params) => reaction(request, params.id, "entry-like"));
export const DELETE = endpoint<{ id: string }>((request, params) => reaction(request, params.id, "entry-like"));
