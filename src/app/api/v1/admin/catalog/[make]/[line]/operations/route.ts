import { catalogEditor, saveCatalogOperations } from "@/lib/api-v1-catalog";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint<{ make: string; line: string }>((request, { make, line }) => catalogEditor(request, make, line));
export const POST = endpoint<{ make: string; line: string }>((request, { make, line }) => saveCatalogOperations(request, make, line));
