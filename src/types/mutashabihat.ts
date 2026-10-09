export type AyaMutashabihat = {
  verse_key: string;
  surah: number;
  ayah: number;
  surah_name_arabic: string;
  surah_name_english: string;
  arabic: string;
  translation: string;
  similar_verses: [
    {
      verse_key: string;
      surah: number;
      ayah: number;
      surah_name_arabic: string;
      surah_name_english: string;
      arabic: string;
      translation: string;
    },
  ];
};

export type MutashabihatSurahResponse = {
  data: {
    surah: number;
    surah_name_arabic: string;
    surah_name_english: string;
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    verses: AyaMutashabihat[];
  };
};
