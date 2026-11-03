import { garage } from "@/lib/api-v1";
import { newCar } from "@/lib/api-v1-write";
import { endpoint, OPTIONS } from "@/lib/api-v1-http";
export { OPTIONS };
export const GET = endpoint((request, params) => garage(request));
export const POST = endpoint((request, params) => newCar(request), 201);
