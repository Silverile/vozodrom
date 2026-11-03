import { catalogDrawing } from "@/lib/api-v1-catalog";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const POST = endpoint<{ make: string; line: string }>((request, { make, line }) => catalogDrawing(request, make, line), 201);
