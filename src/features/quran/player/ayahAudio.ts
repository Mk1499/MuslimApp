import { QuranWord } from '@/types/quran';

/**
 * Reciter folder on https://everyayah.com/data.
 * See the full list of available reciters at https://everyayah.com/reciters.html
 * e.g. `Abdul_Basit_Murattal_192kbps`, `Abdurrahmaan_As-Sudais_192kbps`.
 */
export const RECITER_FOLDER = 'Alafasy_128kbps';

/**
 * Display names for common everyayah.com reciter folders. Anything not listed
 * falls back to the raw folder name.
 */
export const RECITER_NAMES: Record<string, string> = {
  Alafasy_128kbps: 'Mishary Rashid Alafasy',
  Alafasy_64kbps: 'Mishary Rashid Alafasy',
  Alafasy_32kbps: 'Mishary Rashid Alafasy',
  'Abdurrahmaan_As-Sudais_192kbps': 'Abdurrahman As-Sudais',
  'Abdurrahmaan_As-Sudais_128kbps': 'Abdurrahman As-Sudais',
  'Abdul_Basit_Murattal_192kbps': 'Abdul Basit Abdus-Samad (Murattal)',
  'Abdul_Basit_Mujawwad_192kbps': 'Abdul Basit Abdus-Samad (Mujawwad)',
  Abdulsamad_192kbps: 'Abdul Basit Abdus-Samad',
  'Ahmed_ibn_Ali_al-Ajamy_128kbps': 'Ahmed ibn Ali al-Ajamy',
  'Al-Husary_128kbps': 'Mahmoud Khalil Al-Husary',
  'Al-Husary_Mujawwad_128kbps': 'Mahmoud Khalil Al-Husary (Mujawwad)',
  'Maher_AlMuaiqly_128kbps': 'Maher Al-Muaiqly',
  Minshawy_128kbps: 'Mohamed Al-Minshawy',
  'Minshawy_Mujawwad_128kbps': 'Mohamed Al-Minshawy (Mujawwad)',
  'Saood_ash-Shuraym_128kbps': 'Saood ash-Shuraym',
  Hani_Rifai_192kbps: 'Hani Rifai',
};

export function getReciterDisplayName(folder: string = RECITER_FOLDER): string {
  return RECITER_NAMES[folder] ?? folder;
}

/**
 * How many ayahs (including the one pressed) to preload as a playlist.
 * Playback runs through them one after another, then stops.
 */
export const PRELOAD_NEXT_AYATS = 5;

const BASE_URL = 'https://everyayah.com/data';

const pad3 = (n: number) => String(n).padStart(3, '0');

/** "surah:ayah" key used to dedupe / highlight an ayah. */
export function getAyahKey(
  word: Pick<QuranWord, 'surah_number' | 'ayah_number'>,
): string {
  return `${word.surah_number}:${word.ayah_number}`;
}

/**
 * Builds the CDN stream URL for an ayah, e.g.
 * https://everyayah.com/data/Alafasy_128kbps/001001.mp3
 */
export function getAyahStreamUrl(
  word: Pick<QuranWord, 'surah_number' | 'ayah_number'>,
): string {
  return `${BASE_URL}/${RECITER_FOLDER}/${pad3(word.surah_number)}${pad3(
    word.ayah_number,
  )}.mp3`;
}

/** Builds a track-player track for a single ayah. */
export function buildAyahTrack(
  surahNumber: number,
  ayahNumber: number,
): import('react-native-track-player').Track {
  return {
    id: `${surahNumber}:${ayahNumber}`,
    url: `${BASE_URL}/${RECITER_FOLDER}/${pad3(surahNumber)}${pad3(
      ayahNumber,
    )}.mp3`,
    title: `آية ${ayahNumber}`,
    artist: `سورة ${surahNumber}`,
  };
}
