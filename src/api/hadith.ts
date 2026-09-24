import { HadithCollectionResponse } from '@/types/hadith';
import { apiClient } from './client';

export async function getHadithCollections(): Promise<HadithCollectionResponse> {
  const response = await apiClient.get<HadithCollectionResponse>(
    '/hadith/collections',
  );

  return response.data;
}
