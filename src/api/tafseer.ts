import { tafseerClient } from '@/api/APIClients';
import { Tafseer, TafseerAya } from '@/types/tafseer.types';

export async function getTafseerCollections(): Promise<Tafseer[]> {
  const response = await tafseerClient.get<Tafseer[]>('/tafseer/');

  return response.data;
}

export async function getSurahTafseer(
  surahId: number,
  surahNumsOfAyat: number,
  tafseerId: number,
): Promise<TafseerAya[]> {
  const response = await tafseerClient.get<TafseerAya[]>(
    `/tafseer/${tafseerId}/${surahId}/1/${surahNumsOfAyat}`,
  );

  return response.data;
}
