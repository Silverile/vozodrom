import { type FormGeneration, engineLabel, toGearbox, toListingFuel } from "@/lib/listing-catalog";
import { cardOf, thumb } from "@/lib/modelCards";

// Generations of one model line for the listing form. Catalogue data changes only with a deploy,
// so browsers may cache the answer for a day.
export async function GET(_: Request, { params }: { params: Promise<{ make: string; line: string }> }) {
  const { make, line } = await params;
  const card = cardOf(make, line);
  if (!card) return Response.json({ generations: [] }, { headers: { "cache-control": "public, max-age=86400" } });
  const generations: FormGeneration[] = card.generations
    .filter((g) => g.code || g.name)
    .map((g) => ({
      code: g.code ?? g.name!,
      name: g.name,
      from: g.from,
      to: g.to,
      bodies: g.bodyTypes,
      engines: (g.engines ?? [])
        .map((e) => ({ label: engineLabel(e), fuel: toListingFuel(e.fuel), kwMin: e.powerKwMin, kwMax: e.powerKwMax }))
        .filter((e) => e.label),
      gearboxes: [...new Set((g.transmissions ?? []).map((t) => toGearbox(t.type)))],
      photo: g.photo ? thumb(g.photo.url, 330) : null,
    }));
  return Response.json({ generations }, { headers: { "cache-control": "public, max-age=86400" } });
}
