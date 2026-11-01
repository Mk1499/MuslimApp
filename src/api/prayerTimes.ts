import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';

import type { PrayerTimesResponse } from '@/types/prayer';

export type GetPrayerTimesParams = {
  latitude: number;
  longitude: number;
  date?: string;
};

export async function getPrayerTimes(
  params: GetPrayerTimesParams,
  address?: any,
): Promise<PrayerTimesResponse> {
  const coordinates = new Coordinates(params.latitude, params.longitude);
  const adhanParams =
    address?.address?.country_code === 'eg'
      ? CalculationMethod.Egyptian()
      : CalculationMethod.UmmAlQura();

  console.log({ adhanParams });
  const prayerTimes = new PrayerTimes(
    coordinates,
    params.date ? new Date(params.date) : new Date(),
    adhanParams,
  );

  console.log({ prayerTimes });

  return { prayerTimes };
}
