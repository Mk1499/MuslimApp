import { azkarClient } from './APIClients';
import type { AzkarCollection, AzkarItem } from '@/types/azkar';

export async function getAzkarCollections(): Promise<
  Record<string, AzkarCollection[]>
> {
  const response = await azkarClient.get<Record<string, AzkarCollection[]>>(
    '/husn_ar.json',
  );

  return response.data;
}

export async function getAzkarDetailsByID(
  id: string,
): Promise<Record<string, AzkarItem[]>> {
  const response = await azkarClient.get<Record<string, AzkarItem[]>>(
    `/${id}.json`,
  );

  return response.data;
}
