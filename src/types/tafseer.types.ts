export type Tafseer = {
  id: number;
  name: string;
  language: 'ar' | 'en';
  author: string;
  book_name: string;
};

export type TafseerAya = {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
};
