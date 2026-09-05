import { apiClient } from './client';
import { HijriDateResponse } from '@/types/hijri';

export async function getTodayHijriDate(): Promise<HijriDateResponse> {
  const response = await apiClient.get<HijriDateResponse>('/today-hijri');

  return response.data;
}
