import { getSurahTafseer, getTafseerCollections } from '@/api/tafseer';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as surahsList from '@/assets/offline-res/quran-surahs.json';

interface SurahTafseerParams {
  surahId: number;
  surahNumsOfAyat: number;
  tafseerId: number;
}

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
    let newAyat = ayatArr.map((aya, index) => {
      let tafsir = tafsirArr.find(t => {
        return t.ayah_number === aya.numberInSurah;
      });
      aya['tafsir'] = tafsir.text;
      return aya;
    });

    return newAyat;
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

  return {
    tafseerCollectionsQuery,
    tafseerSurahQuery,
    getFullSurahTafseer,
  };
}
