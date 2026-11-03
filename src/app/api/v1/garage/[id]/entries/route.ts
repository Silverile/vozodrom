import { newEntry, garageEntries } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ id: string }>((request, params) => garageEntries(request, params.id));
export const POST = endpoint<{ id: string }>((request, params) => newEntry(request, params.id), 201);
