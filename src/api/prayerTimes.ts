import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';

import type { PrayerTimesResponse } from '@/types/prayer';

export type GetPrayerTimesParams = {
  latitude: number;
  longitude: number;
  date?: string;
};

export async function getPrayerTimes(
  params: GetPrayerTimesParams,
): Promise<PrayerTimesResponse> {
  const coordinates = new Coordinates(params.latitude, params.longitude);
  const adhanParams = CalculationMethod.MoonsightingCommittee();
  const prayerTimes = new PrayerTimes(
    coordinates,
    params.date ? new Date(params.date) : new Date(),
    adhanParams,
  );

  return { prayerTimes };
}
