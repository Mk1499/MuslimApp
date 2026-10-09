import { apiClient } from '@/api/APIClients';
import { MutashabihatSurahResponse } from '@/types/mutashabihat';

export async function getSurahsMutashbihat(
  surahNumber: number,
  page = 1,
): Promise<MutashabihatSurahResponse> {
  const response = await apiClient.get<MutashabihatSurahResponse>(
    `/quran/mutashabihat/${surahNumber}?page=${page}`,
  );

  return response.data;
}
