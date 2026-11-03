import { ListingError } from "./listing-store";

// Lossless removal of JPEG EXIF/XMP/IPTC/comments and WebP EXIF/XMP, including GPS.
// Pixel re-encoding/orientation and the 1920 px resize remain the client's responsibility.
const invalid = (): never => { throw new ListingError(415, "Poškozený formát fotky."); };
function concat(parts: Uint8Array[]) {
  const result = new Uint8Array(parts.reduce((n, part) => n + part.byteLength, 0));
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.byteLength; }
  return result.buffer;
}
export function stripPhotoMetadata(body: ArrayBuffer): ArrayBuffer {
  const bytes = new Uint8Array(body);
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    const parts: Uint8Array[] = []; let position = 2, keptFrom = 0, scanning = false;
    while (position < bytes.length) {
      if (scanning) {
        while (position < bytes.length) {
          if (bytes[position] !== 0xff) { position++; continue; }
          let next = position + 1;
          while (bytes[next] === 0xff) next++;
          if (bytes[next] === 0 || (bytes[next] >= 0xd0 && bytes[next] <= 0xd7)) { position = next + 1; continue; }
          break;
        }
      }
      const start = position;
      if (bytes[position++] !== 0xff) return invalid();
      while (bytes[position] === 0xff) position++;
      const marker = bytes[position++];
      if (marker === undefined || marker === 0 || marker === 0xd8) return invalid();
      if (marker === 0xd9) { parts.push(bytes.subarray(keptFrom, position)); return concat(parts); }
      if (marker === 1 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (position + 2 > bytes.length) return invalid();
      const size = (bytes[position] << 8) | bytes[position + 1];
      if (size < 2 || position + size > bytes.length) return invalid();
      const end = position + size;
      if (marker === 0xe1 || marker === 0xed || marker === 0xfe) {
        parts.push(bytes.subarray(keptFrom, start)); keptFrom = end;
      }
      scanning = marker === 0xda;
      position = end;
    }
    return invalid();
  }
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    const view = new DataView(body);
    if (view.getUint32(4, true) + 8 !== bytes.length) return invalid();
    const header = bytes.slice(0, 12), parts = [header];
    for (let position = 12; position < bytes.length;) {
      if (position + 8 > bytes.length) return invalid();
      const type = ascii(position, position + 4), size = view.getUint32(position + 4, true);
      const end = position + 8 + size + (size & 1);
      if (end > bytes.length) return invalid();
      if (type !== "EXIF" && type !== "XMP ") {
        const chunk = bytes.slice(position, end);
        if (type === "VP8X") {
          if (size < 10) return invalid();
          chunk[8] &= ~0x0c;
        }
        parts.push(chunk);
      }
      position = end;
    }
    const output = concat(parts);
    new DataView(output).setUint32(4, output.byteLength - 8, true);
    return output;
  }
  return body; // storePhoto reports the established unsupported-format/empty-body errors.
}
