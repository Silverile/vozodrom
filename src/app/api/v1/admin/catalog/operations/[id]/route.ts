import { deleteCatalogOperation } from "@/lib/api-v1-catalog";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const DELETE = endpoint<{ id: string }>((request, { id }) => deleteCatalogOperation(request, id));
