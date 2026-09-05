import { apiClient } from './client';
import { PrayerTimesResponse } from '@/types/prayer';

export type GetPrayerTimesParams = {
  latitude: number;
  longitude: number;
  date?: string;
};

export async function getPrayerTimes(
  params: GetPrayerTimesParams,
): Promise<PrayerTimesResponse> {
  const response = await apiClient.get<PrayerTimesResponse>('/prayer-times', {
    params,
  });

  return response.data;
}
