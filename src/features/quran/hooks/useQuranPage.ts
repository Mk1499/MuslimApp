import { useMemo } from 'react';
// Local bundled asset instead of a network call. Metro can `require`/`import`
// .json files directly. Point this at wherever you saved the file, e.g.
// assets/quran-pages.json — see README for the "one big file vs one file per
// page" options.
import quranPages from '@/assets/offline-res/quran-pages.json';
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
  console.log(entry);
  const pageData = entry?.data ?? null;

  const lines = useMemo<MushafLine[]>(() => {
    if (!pageData) return [];
    return groupWordsIntoLines(pageData.words, pageData.lines_per_page);
  }, [pageData]);

  return {
    pageData,
    lines,
    // Reading a bundled asset is synchronous — no real loading state needed.
    loading: false,
    error: pageData ? null : `Page ${pageNumber} not found in bundled data`,
  };
}

function groupWordsIntoLines(
  words: QuranWord[],
  linesPerPage: number,
): MushafLine[] {
  const byLine = new Map<number, QuranWord[]>();

  for (const w of words) {
    if (!byLine.has(w.line_number)) byLine.set(w.line_number, []);
    byLine.get(w.line_number)!.push(w);
  }

  const lines: MushafLine[] = [];
  for (let n = 1; n <= linesPerPage; n++) {
    const lineWords = (byLine.get(n) ?? []).sort(
      (a, b) => a.position - b.position,
    );
    lines.push({ lineNumber: n, words: lineWords });
  }
  return lines;
}
