import { apiClient } from './client';
import { RandomAyaResponse } from '@/types/aya';
import { RandomDuaaResponse } from '@/types/dua';
import { RandomHadithResponse } from '@/types/hadith';

export async function getRandomAya(): Promise<RandomAyaResponse> {
  const response = await apiClient.get<RandomAyaResponse>('/quran/random');

  return response.data;
}

export async function getRandomHadith(): Promise<RandomHadithResponse> {
  const response = await apiClient.get<RandomHadithResponse>('/hadith/random');

  return response.data;
}

export async function getRandomDuaa(): Promise<RandomDuaaResponse> {
  const response = await apiClient.get<RandomDuaaResponse>('/duas/random');

  return response.data;
}
