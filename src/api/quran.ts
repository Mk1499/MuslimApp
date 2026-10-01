import { listSurahsResponse } from '@/types/surah';
import { apiClient } from './clients/client';

export async function getSurahsList(): Promise<listSurahsResponse> {
  const response = await apiClient.get<listSurahsResponse>('/quran/surahs');

  return response.data;
}
