export interface QuranWord {
  position: number;
  text_uthmani: string;
  text_uthmani_tajweed?: string;
  line_number: number;
  // 'word' | 'end' (ayah-end ornament) | 'surah_name' | 'basmallah'
  char_type_name: 'word' | 'end' | 'surah_name' | 'basmallah' | string;
  verse_key: string;
  surah_number: number;
  ayah_number: number;
}

export interface QuranPageData {
  page: number;
  total_pages: number;
  lines_per_page: number;
  total_words: number;
  words: QuranWord[];
}

export interface QuranPageResponse {
  success: boolean;
  service: string;
  data: QuranPageData;
}

export interface MushafLine {
  lineNumber: number;
  words: QuranWord[];
}
