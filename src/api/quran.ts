import { listSurahsResponse } from '@/types/surah';
import { apiClient } from './client';

export async function getSurahsList(): Promise<listSurahsResponse> {
  const response = await apiClient.get<listSurahsResponse>('/quran/surahs');

  return response.data;
}
