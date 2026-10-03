import { getSurahTafseer, getTafseerCollections } from '@/api/tafseer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SurahTafseerParams {
  surahId: number;
  surahNumsOfAyat: number;
  tafseerId: number;
}

// Number of ayat fetched per tafseer request; keeps each response small enough to avoid crashes on long surahs.
const TAFSEER_CHUNK_SIZE = 20;

export default function useTafseerData(surahParams?: SurahTafseerParams) {
  const tafseerCollectionsQuery = useQuery({
    queryKey: ['tafseer-collections'],
    queryFn: () => getTafseerCollections(),
  });

  const tafseerSurahQuery = useQuery({
    queryKey: ['tafseer-surah', surahParams],
    queryFn: () =>
      getSurahTafseer(
        surahParams!.surahId,
        surahParams!.surahNumsOfAyat,
        surahParams!.tafseerId,
      ),
    enabled: !!surahParams,
  });

  const getSurahAyat = (surahID: number) => {
    return new Promise((resolve, reject) => {
      let url = `https://api.qurani.ai/gw/qh/v1/surah/${surahID}`;
      axios
        .get(url)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(err => {
          let msg = err.message;
          if (msg === 'Network Error') {
            console.error('Network Error');
          }
          reject(err);
        });
    });
  };

  const mergeAyaTafsir = (ayatArr: any[], tafsirArr: any[]) => {
    return ayatArr.map(aya => {
      const tafsir = tafsirArr.find(t => t.ayah_number === aya.numberInSurah);
      return { ...aya, tafsir: tafsir?.text };
    });
  };

  const getFullSurahTafseer = async (
    surahID: number,
    surahAyat: number,
    tafsirID: number,
  ) => {
    let url = `http://api.quran-tafseer.com/tafseer/${tafsirID}/${surahID}/1/${surahAyat}`;
    let tafsir = await (await axios.get(url)).data;
    return new Promise((resolve, reject) => {
      getSurahAyat(surahID)
        .then((data: any) => {
          let ayahs = data.data.ayahs;
          resolve(mergeAyaTafsir(ayahs, tafsir));
        })
        .catch(err => {
          let msg = err.message;
          if (msg === 'Network Error') {
            console.error('Network Error');
          }
          reject(err);
        });
    });
  };

  // Fetches only the tafsir text for the [from, to] ayah range, keeping each network response small.
  const getSurahTafseerChunk = async (
    surahID: number,
    tafsirID: number,
    from: number,
    to: number,
  ) => {
    const url = `http://api.quran-tafseer.com/tafseer/${tafsirID}/${surahID}/${from}/${to}`;
    const { data } = await axios.get(url);
    return data;
  };

  const surahAyatQuery = useQuery({
    queryKey: ['surah-ayat', surahParams?.surahId],
    queryFn: async () => {
      const data: any = await getSurahAyat(surahParams!.surahId);
      return data.data.ayahs as any[];
    },
    enabled: !!surahParams,
  });

  const surahTafseerPagesQuery = useInfiniteQuery({
    queryKey: ['tafseer-pages', surahParams?.surahId, surahParams?.tafseerId],
    queryFn: async ({ pageParam }) => {
      const ayahs = surahAyatQuery.data ?? [];
      const from = pageParam;
      const to = Math.min(
        from + TAFSEER_CHUNK_SIZE - 1,
        surahParams!.surahNumsOfAyat,
      );
      const tafsirChunk = await getSurahTafseerChunk(
        surahParams!.surahId,
        surahParams!.tafseerId,
        from,
        to,
      );
      const ayahChunk = ayahs.filter(
        aya => aya.numberInSurah >= from && aya.numberInSurah <= to,
      );
      return {
        items: mergeAyaTafsir(ayahChunk, tafsirChunk),
        nextFrom: to + 1,
      };
    },
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.nextFrom <= (surahParams?.surahNumsOfAyat ?? 0)
        ? lastPage.nextFrom
        : undefined,
    enabled: !!surahParams && !!surahAyatQuery.data,
  });

  return {
    tafseerCollectionsQuery,
    tafseerSurahQuery,
    getFullSurahTafseer,
    surahAyatQuery,
    surahTafseerPagesQuery,
  };
}
