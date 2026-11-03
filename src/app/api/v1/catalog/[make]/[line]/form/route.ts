import { listingForm } from "@/lib/catalog-form";
import { publicEndpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = publicEndpoint<{ make: string; line: string }>((request, { make, line }) => listingForm(make, line, new URL(request.url).searchParams));
