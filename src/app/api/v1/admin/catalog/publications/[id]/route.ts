import { catalogPublicationStatus } from "@/lib/api-v1-catalog";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ id: string }>((request, { id }) => catalogPublicationStatus(request, id));
