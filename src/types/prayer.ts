import type { PrayerTimes } from 'adhan';

/**
 * Times calculated locally with the `adhan` package.
 * Dates are real `Date` instances so they can be compared and formatted.
 */
export type PrayerTimesResponse = {
  prayerTimes: PrayerTimes;
};

export type PrayerType = {
  name: string;
  time?: string;
  icon?: 'sunrise' | 'sunset';
  timeUntilInMinutes?: number;
};
