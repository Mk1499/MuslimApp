import { create } from 'zustand';
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

function readPersistedState(): Pick<
  PrayerTrackerState,
  'firstOpenedDate' | 'history'
> {
  try {
    const raw = storage.getString(STORE_KEY);
    if (!raw) {
      return { firstOpenedDate: getLocalDateKey(), history: {} };
    }

    const parsed = JSON.parse(raw) as {
      state?: Partial<PrayerTrackerState>;
    } & Partial<PrayerTrackerState>;
    // Support both the old Zustand persist envelope and the direct JSON format
    // used from now on, preserving existing installations during the switch.
    const saved = parsed.state ?? parsed;
    return {
      firstOpenedDate:
        typeof saved.firstOpenedDate === 'string'
          ? saved.firstOpenedDate
          : getLocalDateKey(),
      history:
        saved.history &&
        typeof saved.history === 'object' &&
        !Array.isArray(saved.history)
          ? saved.history
          : {},
    };
  } catch {
    return { firstOpenedDate: getLocalDateKey(), history: {} };
  }
}

function writePersistedState(
  state: Pick<PrayerTrackerState, 'firstOpenedDate' | 'history'>,
): void {
  // MMKV writes synchronously, so a completed selection is on disk before the
  // dashboard closes its sheet or navigation can leave the app.
  storage.set(STORE_KEY, JSON.stringify(state));
}

const initialState = readPersistedState();

export const usePrayerTrackerStore = create<PrayerTrackerState>()(
  (set, get) => ({
    ...initialState,
    recordPrayer: (date, prayer, outcome) => {
      const state = get();
      const history = {
        ...state.history,
        [date]: { ...(state.history[date] ?? {}), [prayer]: outcome },
      };
      writePersistedState({ firstOpenedDate: state.firstOpenedDate, history });
      set({ history });
    },
  }),
);

export const MAX_POINTS_PER_DAY = PRAYER_NAMES.length * MAX_POINTS_PER_PRAYER;
