import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import type { PhotoUpload } from "../lib/api";

// Same rule as the web (src/lib/photo-resize.ts): at most 1920 px on the longer side, JPEG,
// re-encoded so EXIF (GPS, camera serial) is dropped before the photo leaves the phone.
const MAX_SIDE = 1920;

export interface PickedPhoto { uri: string; upload: PhotoUpload }

export async function pickPhotos(limit: number): Promise<PickedPhoto[]> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error("Bez přístupu k fotkám nelze přidat obrázek. Povolte ho v nastavení telefonu.");
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: limit > 1,
    selectionLimit: limit,
    quality: 1,
    exif: false,
  });
  if (result.canceled) return [];
  const out: PickedPhoto[] = [];
  for (const asset of result.assets.slice(0, limit)) out.push(await shrink(asset.uri, asset.width, asset.height));
  return out;
}

async function shrink(uri: string, width: number, height: number): Promise<PickedPhoto> {
  const scale = Math.min(1, MAX_SIDE / Math.max(width || MAX_SIDE, height || MAX_SIDE));
  const context = ImageManipulator.manipulate(uri);
  if (scale < 1) context.resize(width >= height ? { width: Math.round(width * scale), height: null } : { width: null, height: Math.round(height * scale) });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.82 });
  const body = await (await fetch(saved.uri)).blob();
  return { uri: saved.uri, upload: { body, width: saved.width, height: saved.height, contentType: "image/jpeg" } };
}
