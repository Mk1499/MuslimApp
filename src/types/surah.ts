export type Surah = {
  number: number;
  name_arabic: string;
  name_english: string;
  name_complex: string;
  name_translation: string;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  verses_count: number;
  pages: number[];
  audio: {
    reciters_available: number;
    example_audio: string;
  };
};

export type listSurahsResponse = {
  data: {
    total: number;
    surahs: Surah[];
  };
};
