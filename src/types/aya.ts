export type RandomAyaResponse = {
  data: {
    surah: {
      number: number;
      name_arabic: string;
      name_english: string;
      name_translation: string;
    };
    verse: {
      verse_key: string;
      ayah: number;
      arabic: string;
    };
  };
};
