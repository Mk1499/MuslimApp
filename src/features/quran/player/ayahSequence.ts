import quranPages from '@/assets/offline-res/quran-pages.min.json';
import quranSurahs from '@/assets/offline-res/quran-surahs.json';
import { QuranWord } from '@/types/quran';
import { Surah } from '@/types/surah';

/**
 * Global reading-order sequence of every ayah in the mushaf, derived from
 * the bundled page data. Used to play ayahs continuously across page and
 * surah boundaries and to map an ayah to the page it first appears on.
 */

interface QuranPagesAsset {
  pages: Record<
    string,
    { success: boolean; service: string; data: { words: QuranWord[] } }
  >;
}

const PAGES = quranPages as unknown as QuranPagesAsset;

/** Shape of the bundled `quran-surahs.json` entries. */
interface BundledSurah {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count?: number;
  pages?: number[];
}

const SURAHS = quranSurahs as unknown as BundledSurah[];

export interface AyahRef {
  surah: number;
  ayah: number;
}

const keyOf = (surah: number, ayah: number) => `${surah}:${ayah}`;

function buildSequence() {
  const list: AyahRef[] = [];
  const indexByKey = new Map<string, number>();
  const ayahToPage = new Map<string, number>();
  const ayahTextParts = new Map<string, string[]>();
  const pageToFirstAyah = new Map<number, string>();

  const pageNumbers = Object.keys(PAGES.pages)
    .map(Number)
    .sort((a, b) => a - b);

  for (const page of pageNumbers) {
    const words = PAGES.pages[page]?.data?.words ?? [];
    let firstKey: string | null = null;

    for (const w of words) {
      // Only real ayah words — skip surah-name / basmallah ornaments.
      if (w.char_type_name !== 'word' && w.char_type_name !== 'end') {
        continue;
      }
      const key = keyOf(w.surah_number, w.ayah_number);
      const textParts = ayahTextParts.get(key) ?? [];
      textParts.push(w.text_uthmani);
      ayahTextParts.set(key, textParts);
      if (!indexByKey.has(key)) {
        indexByKey.set(key, list.length);
        list.push({ surah: w.surah_number, ayah: w.ayah_number });
        ayahToPage.set(key, page);
      }
      if (!firstKey) {
        firstKey = key;
      }
    }

    if (firstKey) {
      pageToFirstAyah.set(page, firstKey);
    }
  }

  return { list, indexByKey, ayahToPage, pageToFirstAyah, ayahTextParts };
}

const SEQUENCE = buildSequence();

/** Every ayah in mushaf reading order. */
export const AYAH_LIST = SEQUENCE.list;

/** "surah:ayah" -> index in AYAH_LIST. */
export const AYAH_INDEX = SEQUENCE.indexByKey;

/** "surah:ayah" -> page number where the ayah first appears. */
export const AYAH_TO_PAGE = SEQUENCE.ayahToPage;

/** page number -> "surah:ayah" of the first ayah on that page. */
export const PAGE_TO_FIRST_AYAH = SEQUENCE.pageToFirstAyah;

/** Full Uthmani text for an Ayah, including any continuation across pages. */
export function getAyahText(surah: number, ayah: number): string | undefined {
  const text = SEQUENCE.ayahTextParts.get(keyOf(surah, ayah));
  return text?.join(' ');
}

/** Total number of ayahs in the mushaf. */
export const TOTAL_AYATS = SEQUENCE.list.length;

/** Surah number -> Arabic name, from the bundled surah metadata. */
export const SURAH_NAMES: Record<number, string> = (() => {
  const map: Record<number, string> = {};
  for (const s of SURAHS) {
    map[s.id] = s.name_arabic;
  }
  return map;
})();

/**
 * Full metadata for a surah by number, built from the bundled surah list.
 * Used to open a surah directly (e.g. "Continue" from the home screen's
 * last-read card) without going through the surahs list first.
 */
export function getSurahByNumber(surahNumber: number): Surah | undefined {
  const found = SURAHS.find(s => s.id === surahNumber);
  if (!found) {
    return undefined;
  }

  return {
    number: found.id,
    name_arabic: found.name_arabic,
    name_english: found.name_simple,
    verses_count: found.verses_count,
    pages: found.pages,
  };
}
