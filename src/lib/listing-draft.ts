import { BODY_LABEL, getModel, models } from "./catalog";
import { type FeedVehicle, validateVehicle } from "./feed";
import { getMake, makesIn } from "./makes";

// The car listing a seller fills in on /pridat/. The same checks run in the browser (live hints)
// and on the server (before saving), so a listing that passes one passes the other.

/** For makes without catalogue models, `model` holds the typed model name and `body` is chosen by hand. */
export type Draft = Omit<FeedVehicle, "externalId" | "status" | "updatedAt" | "features" | "city"> & { city: string; vin: string; body: string };

/** A draft being edited in the browser; serverId is set when it edits a saved listing. */
export type LocalDraft = Draft & { serverId: string };

export const EMPTY_DRAFT: Draft = {
  brand: "", model: "", year: 2020, mileageKm: 0, price: 0, engine: "", fuel: "benzin", transmission: "manuál",
  powerKw: 0, color: "", region: "", city: "", description: "", vin: "", body: "",
};

export const EMPTY_LOCAL_DRAFT: LocalDraft = { ...EMPTY_DRAFT, serverId: "" };

const hasShape = (v: unknown, shape: object) =>
  !!v && typeof v === "object" && Object.entries(shape).every(([k, x]) => typeof (v as Record<string, unknown>)[k] === typeof x);

export const isDraft = (v: unknown): v is Draft => hasShape(v, EMPTY_DRAFT);

/** Keeps exactly the Draft fields, with text trimmed and capped, so nothing extra is stored. */
export function cleanDraft(v: Draft): Draft {
  const text = (s: string, max: number) => s.trim().slice(0, max);
  return {
    brand: text(v.brand, 64), model: text(v.model, 80), year: v.year, mileageKm: v.mileageKm, price: v.price,
    engine: text(v.engine, 80), fuel: v.fuel, transmission: v.transmission, powerKw: v.powerKw, color: text(v.color, 40),
    region: v.region, city: v.city, description: text(v.description, 5000), vin: text(v.vin, 17).toUpperCase(), body: v.body,
  };
}

export function vinProblem(vin: string): string | null {
  if (!vin) return null;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return "VIN má 17 znaků a neobsahuje písmena I, O, Q";
  return null;
}

export function draftProblems(draft: Draft): string[] {
  const inCatalog = models.some((m) => m.brandSlug === draft.brand);
  // Catalogue makes are checked exactly like dealer feeds; other makes cannot be checked
  // against model data yet, so model and generation checks are replaced by plain presence checks.
  const vehicleProblems = validateVehicle({ ...draft, city: draft.city || undefined, features: [] });
  return [
    ...(inCatalog || !draft.brand
      ? vehicleProblems
      : [
          ...vehicleProblems.filter((p) => p !== "neznámá značka nebo model" && !p.includes("generace")),
          ...(makesIn("auto").some((m) => m.slug === draft.brand) ? [] : ["neznámá značka"]),
          ...(draft.model.trim() ? [] : ["chybí model"]),
          ...(draft.body in BODY_LABEL ? [] : ["vyberte karoserii"]),
        ]),
    ...(vinProblem(draft.vin) ? [vinProblem(draft.vin)!] : []),
  ];
}

/** "Škoda Octavia, 2019": catalogue models store their slug, other makes the typed or chosen line name. */
export function draftTitle(draft: Draft): string {
  return `${getMake(draft.brand)?.name ?? draft.brand} ${getModel(draft.brand, draft.model)?.name ?? draft.model}, ${draft.year}`;
}
