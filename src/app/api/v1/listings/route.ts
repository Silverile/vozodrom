import { searchListings } from "@/lib/api-v1-search";
import { newListing } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request, params) => searchListings(new URL(request.url).searchParams));
export const POST = endpoint((request, params) => newListing(request), 201);
