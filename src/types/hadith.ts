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

export type HadithCollectionResponse = {
  data: {
    collections: [
      {
        key: string;
        name: string;
        arabic_name: string;
        author: string;
        reliability: string;
        total_hadiths: number;
      },
    ];
  };
};
