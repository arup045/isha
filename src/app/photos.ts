// ─────────────────────────────────────────────────────────────
//  Isha's photos
//  Drop your image files into  src/photos/  and they show up here
//  automatically — no code changes needed.
//
//  • Name them so they sort in the order you want, e.g.
//      01.jpg, 02.jpg, 03.jpg ...  (or 01-paris.jpg, 02-beach.jpg)
//  • Supported: .jpg .jpeg .png .webp .gif .avif
//  • The Photo-Wishes animation pairs each photo with a wish
//    (wishes live in src/app/wishes.ts).
// ─────────────────────────────────────────────────────────────

const modules = import.meta.glob(
  "../photos/*.{jpg,jpeg,png,webp,gif,avif,JPG,JPEG,PNG,WEBP,GIF,AVIF}",
  { eager: true, import: "default" }
) as Record<string, string>;

export const PHOTOS: string[] = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .map((key) => modules[key]);

export const HAS_REAL_PHOTOS = PHOTOS.length > 0;
