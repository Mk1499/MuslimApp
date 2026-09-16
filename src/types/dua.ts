export type RandomDuaaResponse = {
  data: {
    id: number;
    category: string;
    title: string;
    arabic: string;
    transliteration: string;
    translation: string;
    source: string;
    repeat: number;
    category_info: {
      id: string;
      name: string;
      description: string;
    };
  };
};
