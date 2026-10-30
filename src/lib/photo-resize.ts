"use client";

// Photos are shrunk in the browser before upload: at most 1920 px on the longer side, WebP (JPEG
// where WebP encoding is missing). Re-encoding also drops EXIF metadata such as GPS position.
const MAX_SIDE = 1920;

export interface ResizedPhoto {
  blob: Blob;
  width: number;
  height: number;
}

export async function resizePhoto(file: File): Promise<ResizedPhoto> {
  // from-image applies the camera's orientation flag, so portrait photos stay upright.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  const webp = await encode("image/webp");
  const blob = webp?.type === "image/webp" ? webp : await encode("image/jpeg");
  if (!blob) throw new Error("Fotku se nepodařilo zpracovat.");
  return { blob, width, height };
}
