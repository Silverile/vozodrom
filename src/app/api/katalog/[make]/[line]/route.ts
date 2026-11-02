import type { CardTexts } from "@/lib/catalog-edits";
import { type FormGeneration, engineLabel, toGearbox, toListingFuel } from "@/lib/listing-catalog";
import { loadCard } from "@/lib/card-store";
import { thumb } from "@/lib/modelCards";

// Generations of one model line for the listing form. Catalogue data changes only with a deploy,
// so browsers may cache the answer for a day.
// ?texty=1 answers the catalogue's own texts instead (no edits applied), for the admin editor.
export async function GET(request: Request, { params }: { params: Promise<{ make: string; line: string }> }) {
  const { make, line } = await params;
  if (new URL(request.url).searchParams.get("texty")) {
    const raw = await loadCard(make, line, { edits: false });
    if (!raw) return Response.json({ card: null }, { status: 404 });
    const card: CardTexts = {
      name: raw.name,
      summary: raw.summary,
      generations: raw.generations.map((g) => ({ code: g.code, from: g.from, to: g.to, name: g.name, dateNote: g.dateNote ?? null })),
    };
    return Response.json({ card }, { headers: { "cache-control": "no-store" } });
  }
  const card = await loadCard(make, line);
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
