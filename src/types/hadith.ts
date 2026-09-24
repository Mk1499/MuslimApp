export type RandomHadithResponse = {
  data: {
    id: string;
    collection: string;
    collection_name: string;
    hadithnumber: string;
    arabic: string;
    english: string;
    grade: string;
  };
};

export type HadithCollection = {
  key: string;
  name: string;
  arabic_name?: string;
  author?: string;
  reliability?: string;
  total_hadiths: number;
};

export type HadithItem = {
  id: string;
  collection: string;
  collection_name: string;
  hadithnumber: number;
  arabic: string;
  english: string;
  grade: string;
};

export type HadithCollectionResponse = {
  data: {
    collections: HadithCollection[];
  };
};

export type HadithCollectionByKeyResponse = {
  data: {
    hadiths: HadithItem[];
    page: number;
    limit: number;
    total_pages: number;
  };
};
