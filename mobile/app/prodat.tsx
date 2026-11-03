import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReference, useRemote } from "../components/data";
import { ErrorNote, FieldGroup, Input, PhotoStrip } from "../components/form";
import { pickPhotos, type PickedPhoto } from "../components/photos";
import { engineChoices } from "../components/engines";
import { PickerField } from "../components/picker";
import { formatCzk, formatKm, useColors } from "../components/theme";
import { ActionBar, Button, Card, Chip, Screen, StatGrid, StateView, T, TopBar } from "../components/ui";
import { api, ApiError, type ListingInputDto } from "../lib/api";

const STEPS = ["Vůz", "Stav a cena", "Místo a popis", "Fotky"] as const;
const digits = (s: string) => s.replace(/\D/g, "");
const photosWord = (n: number) => (n === 1 ? "fotka" : n >= 2 && n <= 4 ? "fotky" : "fotek");
const spaced = (s: string) => (digits(s) ? Number(digits(s)).toLocaleString("cs-CZ") : "");

// Selling a car in four short steps; the catalogue fills what it knows (generation, engines,
// bodies, gearboxes) so the seller mostly taps instead of typing.
export default function Sell() {
  const c = useColors();
  const ref = useReference();
  const makes = useRemote("catalog:makes", (signal) => api.makes({ signal }));
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<string>();
  const lines = useRemote(`catalog:lines:${brand ?? ""}`, (signal) => (brand ? api.modelLines(brand, { signal }) : Promise.resolve({ items: [] })));
  const [model, setModel] = useState<string>();
  const [year, setYear] = useState("");
  const form = useRemote(`form:${brand}:${model}:${year}`, (signal) => (brand && model && year.length === 4 ? api.listingForm(brand, model, Number(year), { signal }) : Promise.resolve(null)));
  const [generation, setGeneration] = useState<string>();
  const [engine, setEngine] = useState("");
  const [engineKey, setEngineKey] = useState<string>();
  const [fuel, setFuel] = useState<string>();
  const [powerKw, setPowerKw] = useState("");
  const [body, setBody] = useState<string>();
  const [transmission, setTransmission] = useState<string>();
  const [km, setKm] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [vin, setVin] = useState("");
  const [region, setRegion] = useState<string>();
  const [city, setCity] = useState<string>();
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  if (!ref.data) return <Screen><SafeAreaView style={{ flex: 1 }}><TopBar title="Prodat auto" closeIcon /><StateView loading={ref.loading} error={ref.error} onRetry={ref.reload} /></SafeAreaView></Screen>;
  const r = ref.data;
  const generations = form.data?.generations ?? [];
  const gen = generations.find((g) => g.id === generation) ?? (generations.length === 1 ? generations[0] : undefined);
  const label = (list: { value: string; label: string }[], v?: string) => list.find((o) => o.value === v)?.label ?? v ?? "";
  const minPhotos = r.limits.photos.listingMinToPublish;
  const maxPhotos = r.limits.photos.listingMaxCount;
  const bodyValue = body ?? (gen?.bodies.length === 1 ? gen.bodies[0] : undefined);
  const gearValue = transmission ?? (gen?.gearboxes.length === 1 ? gen.gearboxes[0] : undefined);

  const stepReady = [
    Boolean(brand && model && year.length === 4 && gen && engine.trim() && fuel && bodyValue && gearValue && Number(digits(powerKw)) > 0),
    Boolean(digits(km) && Number(digits(price)) > 0),
    Boolean(region && city && description.trim().length >= 20),
    photos.length >= minPhotos,
  ];

  function chooseEngine(key: string, e: { label: string; fuel: string | null; kwMin: number | null; kwMax: number | null }) {
    setEngineKey(key);
    setEngine(e.label);
    if (e.fuel) setFuel(e.fuel);
    setPowerKw(e.kwMin != null && e.kwMin === e.kwMax ? String(e.kwMin) : "");
  }

  async function publish() {
    if (!brand || !model || !gen || !fuel || !bodyValue || !gearValue || !region || !city) return;
    setBusy(true);
    setError(null);
    const data: ListingInputDto = {
      brand, model, generation: gen.id, year: Number(year), mileageKm: Number(digits(km)), price: Number(digits(price)),
      engine: engine.trim(), fuel, transmission: gearValue, powerKw: Number(digits(powerKw)), body: bodyValue, color: color.trim(),
      region, city, description: description.trim(), vin: vin.trim().toUpperCase(),
    };
    try {
      const { id } = await api.createListing(data);
      for (const p of photos) await api.uploadListingPhoto(id, p.upload);
      if (phone.trim()) await api.updateListing(id, { phone: phone.trim() });
      const result = await api.listingAction(id, { action: "submit" });
      setDone(result.status === "published" ? "Inzerát je zveřejněný." : "Inzerát čeká na kontrolu. Dáme vám vědět ve Zprávách.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Inzerát se nepodařilo odeslat. Koncept zůstal uložený v Profilu.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Screen>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <TopBar title="Prodat auto" closeIcon />
          <View style={{ padding: 16, gap: 12 }}>
            <T w="bold" s="title">Hotovo</T>
            <T tone="muted">{done}</T>
            <Button label="Zpět na Vozodrom" kind="brand" onPress={() => router.back()} />
          </View>
        </SafeAreaView>
      </Screen>
    );
  }

  const last = step === STEPS.length - 1;
  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title={`Prodat auto · ${step + 1} ze ${STEPS.length}`} closeIcon />
        <View style={{ flexDirection: "row", gap: 6, paddingHorizontal: 16, paddingBottom: 8 }}>
          {STEPS.map((s, i) => <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= step ? c.brand : c.line }} />)}
        </View>
        <T w="bold" s="title" style={{ paddingHorizontal: 16, paddingBottom: 6 }}>{STEPS[step]}</T>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
            {step === 0 && (
              <>
                <PickerField label="Značka" placeholder="Vyberte značku" value={brand} loading={makes.loading} error={makes.error}
                  options={(makes.data?.items ?? []).map((m) => ({ value: m.slug, label: m.name }))}
                  onChange={(v) => { setBrand(v); setModel(undefined); setGeneration(undefined); }} />
                <PickerField label="Model" placeholder={brand ? "Vyberte model" : "Nejdřív značka"} value={model} disabled={!brand} loading={lines.loading} error={lines.error}
                  options={(lines.data?.items ?? []).map((l) => ({ value: l.slug, label: l.name }))}
                  onChange={(v) => { setModel(v); setGeneration(undefined); }} />
                <Input label="Rok výroby" placeholder="2017" keyboardType="number-pad" maxLength={4} value={year} onChangeText={(v) => { setYear(digits(v)); setGeneration(undefined); }} />
                {year.length === 4 && model && !form.data && <StateView loading={form.loading} error={form.error} onRetry={form.reload} />}
                {form.data && generations.length === 0 && <T tone="warn" w="semibold" style={{ marginBottom: 12 }}>Pro tento rok katalog generaci nezná. Zkontrolujte rok výroby.</T>}
                {generations.length > 1 && (
                  <FieldGroup label="Generace">{generations.map((g) => <Chip key={g.id} label={[g.name ?? g.code, g.from && `${g.from}–${g.to ?? ""}`].filter(Boolean).join(" · ")} on={gen?.id === g.id} onPress={() => setGeneration(g.id)} />)}</FieldGroup>
                )}
                {gen && (
                  <>
                    {gen.engines.length > 0 && <FieldGroup label="Motor">{engineChoices(gen.engines).map((c) => <Chip key={c.key} label={c.chip} on={engineKey === c.key && engine === c.label} onPress={() => chooseEngine(c.key, c.engine)} />)}</FieldGroup>}
                    <Input label={gen.engines.length ? "Motor není v seznamu?" : "Motor"} placeholder="Např. 2.0 TDI" value={engine} onChangeText={setEngine} />
                    <FieldGroup label="Palivo">{r.fuels.map((o) => <Chip key={o.value} label={o.label} on={fuel === o.value} onPress={() => setFuel(o.value)} />)}</FieldGroup>
                    <Input label="Výkon (kW)" placeholder="110" keyboardType="number-pad" value={powerKw} onChangeText={(v) => setPowerKw(digits(v))} />
                    <FieldGroup label="Karoserie">{(gen.bodies.length ? r.bodies.filter((b) => gen.bodies.includes(b.value)) : r.bodies).map((o) => <Chip key={o.value} label={o.label} on={bodyValue === o.value} onPress={() => setBody(o.value)} />)}</FieldGroup>
                    <FieldGroup label="Převodovka">{(gen.gearboxes.length ? r.transmissions.filter((t) => gen.gearboxes.includes(t.value)) : r.transmissions).map((o) => <Chip key={o.value} label={o.label} on={gearValue === o.value} onPress={() => setTransmission(o.value)} />)}</FieldGroup>
                  </>
                )}
              </>
            )}
            {step === 1 && (
              <>
                <Input label="Stav tachometru (km)" placeholder="154 020" keyboardType="number-pad" value={spaced(km)} onChangeText={setKm} />
                <Input label="Cena (Kč)" placeholder="289 000" keyboardType="number-pad" value={spaced(price)} onChangeText={setPrice} />
                {r.colors.options.length > 0 && <FieldGroup label="Barva">{r.colors.options.map((o) => <Chip key={o.value} label={o.label} on={color === o.value} onPress={() => setColor(o.value)} />)}</FieldGroup>}
                <Input label={r.colors.options.length ? "Jiná barva" : "Barva"} placeholder="Nepovinné, např. stříbrná metalíza" value={color} onChangeText={setColor} maxLength={r.limits.listing.color?.maxLength ?? 40} />
                <Input label="VIN" placeholder="17 znaků z technického průkazu" autoCapitalize="characters" maxLength={17} value={vin} onChangeText={setVin} hint="Kupující si podle VIN ověří historii vozu. Inzerát s VIN působí důvěryhodněji." />
              </>
            )}
            {step === 2 && (
              <>
                <PickerField label="Kraj" placeholder="Vyberte kraj" value={region} options={r.regions} onChange={(v) => { setRegion(v); setCity(undefined); }} />
                <PickerField label="Město" placeholder={region ? "Vyberte město" : "Nejdřív kraj"} value={city} disabled={!region}
                  options={r.cities.filter((x) => x.region === region).map((x) => ({ value: x.value, label: x.label }))} onChange={setCity} />
                <Input label="Popis" placeholder="Servisní historie, co bylo měněno, co je potřeba udělat" multiline value={description} onChangeText={setDescription} hint="Alespoň 20 znaků. Pište konkrétně: co a kdy se měnilo." />
                <Input label="Telefon" placeholder="Nepovinné" keyboardType="phone-pad" value={phone} onChangeText={setPhone} hint="Bez telefonu vás kupující kontaktují přes Zprávy." />
              </>
            )}
            {step === 3 && (
              <>
                <PhotoStrip uris={photos.map((p) => p.uri)} max={maxPhotos} onAdd={async () => {
                  try { setPhotos([...photos, ...(await pickPhotos(maxPhotos - photos.length))]); } catch (e) { setError(e instanceof Error ? e.message : "Fotky se nepodařilo načíst."); }
                }} onRemove={(i) => setPhotos(photos.filter((_, j) => j !== i))} />
                <T s="small" tone="muted" style={{ marginBottom: 16 }}>Ke zveřejnění je potřeba alespoň {minPhotos} {photosWord(minPhotos)}. První fotka bude hlavní.</T>
                <Card style={{ gap: 10, marginBottom: 12 }}>
                  <T w="bold" style={{ fontSize: 16 }}>Shrnutí</T>
                  <T w="semibold">{[makes.data?.items.find((m) => m.slug === brand)?.name, lines.data?.items.find((l) => l.slug === model)?.name, gen?.name, engine].filter(Boolean).join(" ")}</T>
                  <StatGrid inset items={[
                    { label: "Rok", value: year },
                    { label: "Najeto", value: digits(km) ? formatKm(Number(digits(km))) : "—" },
                    { label: "Cena", value: digits(price) ? formatCzk(Number(digits(price))) : "—" },
                    { label: "Palivo", value: label(r.fuels, fuel) },
                    { label: "Karoserie", value: label(r.bodies, bodyValue) },
                    { label: "Město", value: label(r.cities, city) },
                  ]} />
                </Card>
              </>
            )}
            <ErrorNote text={error} />
          </ScrollView>
          <ActionBar>
            {step > 0 && <Button label="Zpět" kind="quiet" onPress={() => setStep(step - 1)} />}
            <Button
              label={busy ? "Odesíláme…" : last ? "Odeslat inzerát" : "Pokračovat"}
              kind={stepReady[step] && !busy ? "primary" : "quiet"}
              flex
              onPress={!stepReady[step] || busy ? undefined : last ? publish : () => setStep(step + 1)}
            />
          </ActionBar>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}
