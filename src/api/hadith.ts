import {
  HadithCollectionResponse,
  HadithCollectionByKeyResponse,
} from '@/types/hadith';
import { apiClient } from './client';

export async function getHadithCollections(): Promise<HadithCollectionResponse> {
  const response = await apiClient.get<HadithCollectionResponse>(
    '/hadith/collections',
  );

  return response.data;
}

export async function getHadithCollectionByKey(
  key: string,
  page = 1,
): Promise<HadithCollectionByKeyResponse> {
  const response = await apiClient.get<HadithCollectionByKeyResponse>(
    `/hadith/${key}?page=${page}&limit=10`,
  );

  return response.data;
}
