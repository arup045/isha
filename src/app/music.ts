// ─────────────────────────────────────────────────────────────
//  Isha's birthday music
//  Drop audio files into  src/music/  and they play in the
//  background automatically — one after another, on a loop.
//
//  • Name them so they sort in the order you want, e.g.
//      01.mp3, 02.mp3 ...
//  • Supported: .mp3 .m4a .ogg .wav .aac
//  • If this folder is empty, the site falls back to the two
//    Spotify tracks instead.
// ─────────────────────────────────────────────────────────────

const modules = import.meta.glob(
  "../music/*.{mp3,m4a,ogg,wav,aac,MP3,M4A,OGG,WAV,AAC}",
  { eager: true, import: "default" }
) as Record<string, string>;

export const TRACKS: string[] = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .map((key) => modules[key]);

export const HAS_LOCAL_MUSIC = TRACKS.length > 0;
