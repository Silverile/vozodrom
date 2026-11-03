import { cardFormGenerations } from "@/lib/catalog-form";

// Generations of one model line for the listing form. Catalogue data changes only with a deploy,
// so browsers may cache the answer for a day.
export async function GET(_: Request, { params }: { params: Promise<{ make: string; line: string }> }) {
  const { make, line } = await params;
  const generations = await cardFormGenerations(make, line);
  return Response.json({ generations }, { headers: { "cache-control": "public, max-age=86400" } });
}
