import { apiClient } from './client';
import { RandomAyaResponse } from '@/types/aya';

export async function getRandomAya(): Promise<RandomAyaResponse> {
  const response = await apiClient.get<RandomAyaResponse>('/quran/random');

  return response.data;
}
