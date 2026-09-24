import { useMemo } from 'react';
// Local bundled asset instead of a network call. Metro can `require`/`import`
// .json files directly. Point this at wherever you saved the file, e.g.
// assets/quran-pages.json — see README for the "one big file vs one file per
// page" options.
// import quranPages from '@/assets/offline-res/quran-pages.json';
import quranPages from '@/assets/offline-res/quran-pages.min.json';
import { QuranPageData, QuranWord, MushafLine } from '@/types/quran';

// The asset is keyed by page number as a string, e.g. { "177": { success, service, data } }
type QuranPagesAsset = {
  pages: Record<
    string,
    { success: boolean; service: string; data: QuranPageData }
  >;
};

const PAGES = quranPages as unknown as QuranPagesAsset;
console.log(PAGES);

export function useQuranPage(pageNumber: number) {
  const entry = PAGES.pages[pageNumber];
  const pageData = entry?.data ?? null;

  const lines = useMemo<MushafLine[]>(() => {
    if (!pageData) return [];
    return groupWordsIntoLines(pageData.words);
  }, [pageData]);

  console.log({ lines });

  return {
    pageData,
    lines,
    // Reading a bundled asset is synchronous — no real loading state needed.
    loading: false,
    error: pageData ? null : `Page ${pageNumber} not found in bundled data`,
  };
}

/** Groups words by line_number, preserving the order words appear in the source array. */
function groupWordsIntoLines(words: QuranWord[]): MushafLine[] {
  const byLine = new Map<number, QuranWord[]>();

  for (const word of words) {
    const lineWords = byLine.get(word.line_number);
    if (lineWords) {
      lineWords.push(word);
    } else {
      byLine.set(word.line_number, [word]);
    }
  }

  return Array.from(byLine.entries())
    .sort(([a], [b]) => a - b)
    .map(([lineNumber, lineWords]) => ({ lineNumber, words: lineWords }));
}
