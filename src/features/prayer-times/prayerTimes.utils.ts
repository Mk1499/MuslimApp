import moment, { type Moment } from 'moment';

import type { PrayerTimesResponse } from '@/types/prayer';

/** The five daily prayers plus sunrise, in the order they occur each day. */
export const PRAYER_ORDER = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

export type PrayerKey = (typeof PRAYER_ORDER)[number];

/** Sunrise is a time marker, not a prayer, so it is never the "next prayer". */
const NEXT_PRAYER_ORDER = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;

type AdhanPrayerTimes = PrayerTimesResponse['prayerTimes'];

export type NextPrayerInfo = {
  name: PrayerKey;
  time: Date;
  /** Minutes until the prayer, or minutes elapsed after Isha. */
  minutesUntil: number;
  /** True after Isha, when there is no prayer left today. */
  isElapsed: boolean;
};

/**
 * Returns the next prayer for the current day.
 * After Isha the count switches to Isha in "elapsed" mode, which matches the
 * convention used by the rest of the app.
 */
export function getNextPrayer(
  prayerTimes: AdhanPrayerTimes | undefined,
  now: Moment = moment(),
): NextPrayerInfo | undefined {
  if (!prayerTimes) {
    return undefined;
  }

  for (const name of NEXT_PRAYER_ORDER) {
    const time = prayerTimes[name];
    if (moment(time).isAfter(now)) {
      return {
        name,
        time,
        minutesUntil: Math.max(
          Math.ceil(moment(time).diff(now, 'minutes', true)),
          0,
        ),
        isElapsed: false,
      };
    }
  }

  const isha = prayerTimes.isha;
  return {
    name: 'isha',
    time: isha,
    minutesUntil: Math.max(
      Math.floor(now.diff(moment(isha), 'minutes', true)),
      0,
    ),
    isElapsed: true,
  };
}

export function isPrayerUpcoming(
  prayer: PrayerKey,
  prayerTimes: AdhanPrayerTimes | undefined,
  now: Moment,
): boolean {
  const time = prayerTimes?.[prayer];
  return time ? moment(time).isAfter(now) : true;
}
