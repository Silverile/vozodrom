import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReference, useRemote } from "../components/data";
import { ErrorNote, FieldGroup, Input, PhotoStrip } from "../components/form";
import { pickPhotos, type PickedPhoto } from "../components/photos";
import { ActionBar, Button, Chip, Screen, StateView, T, TopBar } from "../components/ui";
import { api, ApiError } from "../lib/api";


const today = () => new Date().toISOString().slice(0, 10);
const digits = (s: string) => s.replace(/\D/g, "");
const toNumber = (s: string) => (digits(s) ? Number(digits(s)) : null);
const spaced = (s: string) => (digits(s) ? Number(digits(s)).toLocaleString("cs-CZ") : "");

export default function NewEntry() {
  const params = useLocalSearchParams<{ carId?: string }>();
  const cars = useRemote("garage:form", (signal) => api.garage({ signal }));
  const ref = useReference();
  const MAX_PHOTOS = ref.data?.limits.photos.entryMaxCount ?? 10;
  const [carId, setCarId] = useState<string | undefined>(params.carId);
  const [category, setCategory] = useState<string>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(today());
  const [km, setKm] = useState("");
  const [cost, setCost] = useState("");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chosenCar = carId ?? (cars.data?.items.length === 1 ? cars.data.items[0].id : undefined);
  const ready = Boolean(chosenCar && category && title.trim().length >= 3 && /^\d{4}-\d{2}-\d{2}$/.test(date));

  async function addPhotos() {
    try { setPhotos([...photos, ...(await pickPhotos(MAX_PHOTOS - photos.length))]); }
    catch (e) { setError(e instanceof Error ? e.message : "Fotky se nepodařilo načíst."); }
  }

  async function save() {
    if (!chosenCar || !category) return;
    setBusy(true);
    setError(null);
    try {
      const { id } = await api.createEntry(chosenCar, { title: title.trim(), body: body.trim(), category, happenedOn: date, mileageKm: toNumber(km), costCzk: toNumber(cost) });
      for (const p of photos) await api.uploadEntryPhoto(id, p.upload);
      router.back();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Zápis se nepodařilo uložit. Zkuste to znovu.");
      setBusy(false);
    }
  }

  return (
    <Screen>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <TopBar title="Nový zápis" closeIcon />
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
            {cars.data ? (
              cars.data.items.length ? (
                <FieldGroup label="Auto">
                  {cars.data.items.map((car) => <Chip key={car.id} label={car.nickname || car.title} on={chosenCar === car.id} onPress={() => setCarId(car.id)} />)}
                </FieldGroup>
              ) : (
                <>
                  <T tone="muted" style={{ marginBottom: 12 }}>Nejdřív přidejte auto do garáže, zápis pak patří k němu.</T>
                  <Button label="Přidat auto do garáže" kind="brand" onPress={() => router.replace("/auto-nove")} />
                </>
              )
            ) : <StateView loading={cars.loading} error={cars.error} onRetry={cars.reload} />}
            {cars.data?.items.length ? (
              <>
                <FieldGroup label="Téma">
                  {(ref.data?.entryCategories ?? []).map((o) => <Chip key={o.value} label={o.label} on={category === o.value} onPress={() => setCategory(o.value)} />)}
                </FieldGroup>
                <Input label="Co se dělo" placeholder="Např. výměna rozvodů a vodní pumpy" value={title} onChangeText={setTitle} />
                <Input label="Stav tachometru (km)" placeholder="186 400" keyboardType="number-pad" value={spaced(km)} onChangeText={setKm} />
                <Input label="Cena celkem (Kč)" placeholder="14 200" keyboardType="number-pad" value={spaced(cost)} onChangeText={setCost} hint="Nepovinné. Pomůže ostatním majitelům odhadnout náklady." />
                <Input label="Datum" placeholder="2026-11-03" value={date} onChangeText={setDate} hint="Rok-měsíc-den" />
                <Input label="Podrobnosti" placeholder="Co přesně se měnilo, kde a proč" multiline value={body} onChangeText={setBody} />
                <PhotoStrip uris={photos.map((p) => p.uri)} max={MAX_PHOTOS} onAdd={addPhotos} onRemove={(i) => setPhotos(photos.filter((_, j) => j !== i))} />
                <ErrorNote text={error} />
              </>
            ) : null}
          </ScrollView>
          {cars.data?.items.length ? (
            <ActionBar><Button label={busy ? "Ukládáme…" : "Uložit zápis"} kind={ready && !busy ? "primary" : "quiet"} flex onPress={ready && !busy ? save : undefined} /></ActionBar>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}
