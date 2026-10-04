import { azkarClient } from './APIClients';
import type { AzkarCollection } from '@/types/azkar';

export async function getAzkarCollections(): Promise<
  Record<string, AzkarCollection[]>
> {
  const response = await azkarClient.get<Record<string, AzkarCollection[]>>(
    '/husn_ar.json',
  );

  return response.data;
}
