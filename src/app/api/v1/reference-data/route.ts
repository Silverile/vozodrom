import { referenceData } from "@/lib/api-v1-reference";
import { publicEndpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = publicEndpoint(referenceData);
