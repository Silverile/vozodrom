import "server-only";
import { loadCard } from "./card-store";
import { getMake, modelLinesOf } from "./makes";
import { cardGeneration, coversYear, engineLabel, toGearbox, toListingFuel, BODY_KEYS, type FormGeneration } from "./listing-catalog";
import { generationId } from "./listing-draft";
import { thumb } from "./modelCards";
import { ApiError } from "./api-v1-http";
import type { ListingFormDto } from "./api-v1-contract";

/** The exact normalized card projection used by the current web form. */
export async function cardFormGenerations(make: string, line: string): Promise<FormGeneration[]> {
  const card = await loadCard(make, line);
  return (card?.generations ?? []).filter((g) => g.code || g.name).map((g) => ({
    code: g.code ?? g.name!, name: g.name, from: g.from, to: g.to, bodies: g.bodyTypes,
    engines: (g.engines ?? []).map((e) => ({ label: engineLabel(e), fuel: toListingFuel(e.fuel), kwMin: e.powerKwMin, kwMax: e.powerKwMax })).filter((e) => e.label),
    gearboxes: [...new Set((g.transmissions ?? []).map((t) => toGearbox(t.type)))], photo: g.photo ? thumb(g.photo.url, 330) : null,
  }));
}
export async function listingForm(make: string, line: string, params: URLSearchParams): Promise<ListingFormDto> {
  if (!getMake(make)?.sections.includes("auto")) throw new ApiError(404, "not_found", "Značka nenalezena.");
  const model = modelLinesOf(make).find((item) => item.slug === line);
  if (!model) throw new ApiError(404, "not_found", "Model nenalezen.");
  const raw = params.get("year"), year = raw === null ? undefined : Number(raw);
  if (year !== undefined && (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 1)) throw new ApiError(400, "invalid_year", "Neplatný rok.");
  const cards = await cardFormGenerations(make, line);
  const dated = model.generations.filter((g) => g.from !== null);
  const choices = year === undefined ? dated : dated.filter((g) => coversYear(g, year));
  return { makeSlug: make, lineSlug: line, allowsCustomEngine: true, allowsCustomModel: true,
    generations: choices.map((g) => {
      const matched = cardGeneration(g, cards, year) ?? (year === undefined ? undefined : cards.filter((c) => c.from !== null && coversYear(c, year)).at(-1));
      const bodies = (matched?.bodies.length ? matched.bodies : model.bodyTypes.length ? model.bodyTypes : Object.keys(BODY_KEYS)).filter((b) => b in BODY_KEYS);
      return { id: generationId(g), code: g.code, name: matched?.name ?? null, from: g.from, to: g.to, bodies,
        engines: (matched?.engines ?? []).map((e) => ({ label: e.label, fuel: e.fuel, kwMin: e.kwMin, kwMax: e.kwMax })),
        gearboxes: [...(matched?.gearboxes ?? [])], photo: matched?.photo ?? null };
    }),
  };
}
