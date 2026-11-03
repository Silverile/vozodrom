import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReference, useRemote } from "../components/data";
import { ErrorNote, FieldGroup, Input, PhotoStrip } from "../components/form";
import { pickPhotos, type PickedPhoto } from "../components/photos";
import { engineChoices } from "../components/engines";
import { PickerField } from "../components/picker";
import { ActionBar, Button, Chip, Screen, StateView, T, TopBar } from "../components/ui";
import { api, ApiError, type GarageDataDto } from "../lib/api";

const digits = (s: string) => s.replace(/\D/g, "");

// Adding a car to the garage: make and model from the catalogue, the rest optional, so an owner
// can start the logbook in a minute and fill details later.
export default function NewCar() {
  const ref = useReference();
  const makes = useRemote("catalog:makes", (signal) => api.makes({ signal }));
  const [brand, setBrand] = useState<string>();
  const lines = useRemote(`catalog:lines:${brand ?? ""}`, (signal) => (brand ? api.modelLines(brand, { signal }) : Promise.resolve({ items: [] })));
  const [model, setModel] = useState<string>();
  const [year, setYear] = useState("");
  const form = useRemote(`form:${brand}:${model}:${year}`, (signal) => (brand && model ? api.listingForm(brand, model, year.length === 4 ? Number(year) : undefined, { signal }) : Promise.resolve(null)));
  const [generation, setGeneration] = useState<string>();
  const [nickname, setNickname] = useState("");
  const [engine, setEngine] = useState("");
  const [engineKey, setEngineKey] = useState<string>();
  const [fuel, setFuel] = useState<string>();
  const [transmission, setTransmission] = useState<string>();
  const [story, setStory] = useState("");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ref.data) return <Screen><SafeAreaView style={{ flex: 1 }}><TopBar title="Auto do garáže" closeIcon /><StateView loading={ref.loading} error={ref.error} onRetry={ref.reload} /></SafeAreaView></Screen>;
  const r = ref.data;
  const generations = form.data?.generations ?? [];
  const gen = generations.find((g) => g.id === generation) ?? (generations.length === 1 ? generations[0] : undefined);
  const maxPhotos = r.limits.photos.garageMaxCount;
  const ready = Boolean(brand && model && year.length === 4);

  async function save() {
    if (!brand || !model) return;
    setBusy(true);
    setError(null);
    const data: GarageDataDto = {
      brand, model, generation: gen?.id ?? "", nickname: nickname.trim(), year: Number(year), purchaseYear: Number(year),
      color: "", body: gen?.bodies.length === 1 ? gen.bodies[0] : "", engine: engine.trim(), fuel: fuel ?? "", powerKw: 0,
      transmission: transmission ?? "", drive: "", vin: "", plate: "", plateVisible: false, story: story.trim(),
    };
    try {
      const { id } = await api.createCar(data);
      for (const p of photos) await api.uploadCarPhoto(id, p.upload);
      router.replace({ pathname: "/zapis", params: { carId: id } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Auto se nepodařilo uložit. Zkuste to znovu.");
      setBusy(false);
    }
  }

  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title="Auto do garáže" closeIcon />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
            <PickerField label="Značka" placeholder="Vyberte značku" value={brand} loading={makes.loading} error={makes.error}
              options={(makes.data?.items ?? []).map((m) => ({ value: m.slug, label: m.name }))}
              onChange={(v) => { setBrand(v); setModel(undefined); setGeneration(undefined); }} />
            <PickerField label="Model" placeholder={brand ? "Vyberte model" : "Nejdřív značka"} value={model} disabled={!brand} loading={lines.loading} error={lines.error}
              options={(lines.data?.items ?? []).map((l) => ({ value: l.slug, label: l.name, note: [l.from, l.current ? "dosud" : l.to].filter(Boolean).join("–") || undefined }))}
              onChange={(v) => { setModel(v); setGeneration(undefined); }} />
            <Input label="Rok výroby" placeholder="2016" keyboardType="number-pad" maxLength={4} value={year} onChangeText={(v) => setYear(digits(v))} />
            {generations.length > 1 && (
              <FieldGroup label="Generace">
                {generations.map((g) => <Chip key={g.id} label={[g.name ?? g.code, g.from && `${g.from}–${g.to ?? ""}`].filter(Boolean).join(" · ")} on={gen?.id === g.id} onPress={() => setGeneration(g.id)} />)}
              </FieldGroup>
            )}
            {gen && gen.engines.length > 0 && (
              <FieldGroup label="Motor">
                {engineChoices(gen.engines).slice(0, 12).map((c) => <Chip key={c.key} label={c.chip} on={engineKey === c.key && engine === c.label} onPress={() => { setEngineKey(c.key); setEngine(c.label); if (c.engine.fuel) setFuel(c.engine.fuel); }} />)}
              </FieldGroup>
            )}
            <Input label={gen?.engines.length ? "Jiný motor" : "Motor"} placeholder="Např. 2.0 TDI" value={engine} onChangeText={setEngine} />
            <FieldGroup label="Palivo">{r.fuels.map((o) => <Chip key={o.value} label={o.label} on={fuel === o.value} onPress={() => setFuel(o.value)} />)}</FieldGroup>
            <FieldGroup label="Převodovka">{r.transmissions.map((o) => <Chip key={o.value} label={o.label} on={transmission === o.value} onPress={() => setTransmission(o.value)} />)}</FieldGroup>
            <Input label="Přezdívka auta" placeholder="Nepovinné, např. Stříbrná střela" value={nickname} onChangeText={setNickname} />
            <Input label="Příběh auta" placeholder="Odkud je, co už má za sebou" multiline value={story} onChangeText={setStory} />
            <PhotoStrip uris={photos.map((p) => p.uri)} max={maxPhotos} onAdd={async () => {
              try { setPhotos([...photos, ...(await pickPhotos(maxPhotos - photos.length))]); } catch (e) { setError(e instanceof Error ? e.message : "Fotky se nepodařilo načíst."); }
            }} onRemove={(i) => setPhotos(photos.filter((_, j) => j !== i))} />
            <T s="small" tone="muted" style={{ marginBottom: 12 }}>SPZ ani VIN se neukládají. Další údaje doplníte později.</T>
            <ErrorNote text={error} />
          </ScrollView>
          <ActionBar><Button label={busy ? "Ukládáme…" : "Přidat do garáže"} kind={ready && !busy ? "primary" : "quiet"} flex onPress={ready && !busy ? save : undefined} /></ActionBar>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}
