import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { storage } from '@/utils/storage';

export const PRAYER_NAMES = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
] as const;
export type TrackedPrayer = (typeof PRAYER_NAMES)[number];
export type PrayerOutcome = 'congregation' | 'alone' | 'missed';
export type DailyPrayerHistory = Partial<Record<TrackedPrayer, PrayerOutcome>>;

const STORE_KEY = 'prayer-tracker.store';
const MAX_POINTS_PER_PRAYER = 27;

const mmkvStorage: StateStorage = {
  getItem: key => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.remove(key),
};

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPrayerOutcomeScore(outcome?: PrayerOutcome): number {
  if (outcome === 'congregation') return 27;
  if (outcome === 'alone') return 1;
  return 0;
}

type PrayerTrackerState = {
  firstOpenedDate: string;
  history: Record<string, DailyPrayerHistory>;
  recordPrayer: (
    date: string,
    prayer: TrackedPrayer,
    outcome: PrayerOutcome,
  ) => void;
};

export const usePrayerTrackerStore = create<PrayerTrackerState>()(
  persist(
    set => ({
      firstOpenedDate: getLocalDateKey(),
      history: {},
      recordPrayer: (date, prayer, outcome) => {
        set(state => {
          const day = state.history[date] ?? {};
          return {
            history: {
              ...state.history,
              [date]: { ...day, [prayer]: outcome },
            },
          };
        });
      },
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: state => ({
        firstOpenedDate: state.firstOpenedDate,
        history: state.history,
      }),
    },
  ),
);

export const MAX_POINTS_PER_DAY = PRAYER_NAMES.length * MAX_POINTS_PER_PRAYER;
