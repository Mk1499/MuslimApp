import { apiClient } from '@/api/APIClients';
import { PrayerTimesResponse } from '@/types/prayer';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export type GetPrayerTimesParams = {
  latitude: number;
  longitude: number;
  date?: string;
};

export async function getPrayerTimes(
  params: GetPrayerTimesParams,
): Promise<PrayerTimesResponse> {
  const coordinates = new Coordinates(35.789751, -78.691249);
  const adhanParams = CalculationMethod.MoonsightingCommittee();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), adhanParams);

  console.log({ prayerTimes });

  const response = await apiClient.get<PrayerTimesResponse>('/prayer-times', {
    params,
  });

  return response.data;
}
