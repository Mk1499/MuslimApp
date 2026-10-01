import { tafseerClient } from './clients/tafsirClient';
import { Tafseer } from '@/types/tafseer.types';

export async function getTafseerCollections(): Promise<Tafseer[]> {
  const response = await tafseerClient.get<Tafseer[]>('/tafseer/');

  return response.data;
}
