import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { storage } from '@/utils/storage';
import { PRAYER_NAMES, type TrackedPrayer } from './usePrayerTrackerStore';

export const ATHAN_SOUNDS = [
  { id: 'default_azan', translationKey: 'defaultAthan' },
  { id: 'banna_azan', translationKey: 'bannaAthan' },
  { id: 'haram_azan', translationKey: 'haramAthan' },
  { id: 'qatamy_azan', translationKey: 'qatamyAthan' },
  { id: 'abdelbaset_azan', translationKey: 'abdelbasetAthan' },
  { id: 'refaat_azan', translationKey: 'refaatAthan' },
] as const;

export type AthanSoundId = (typeof ATHAN_SOUNDS)[number]['id'];
export type AthanEnabledPrayers = Record<TrackedPrayer, boolean>;

type AthanSettingsState = {
  enabled: AthanEnabledPrayers;
  sound: AthanSoundId;
  setPrayerEnabled: (prayer: TrackedPrayer, enabled: boolean) => void;
  setSound: (sound: AthanSoundId) => void;
};

const storageAdapter: StateStorage = {
  getItem: key => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.remove(key),
};

const initialEnabled = Object.fromEntries(
  PRAYER_NAMES.map(prayer => [prayer, true]),
) as AthanEnabledPrayers;

export const useAthanSettingsStore = create<AthanSettingsState>()(
  persist(
    set => ({
      enabled: initialEnabled,
      sound: 'default_azan',
      setPrayerEnabled: (prayer, enabled) =>
        set(state => ({ enabled: { ...state.enabled, [prayer]: enabled } })),
      setSound: sound => set({ sound }),
    }),
    {
      name: 'athan-settings.store',
      storage: createJSONStorage(() => storageAdapter),
      version: 2,
      migrate: persisted => {
        const saved = (persisted ?? {}) as Partial<AthanSettingsState>;
        return {
          // Version 1 shipped with every prayer disabled by default. Apply the
          // new all-enabled default for existing installs while keeping their
          // selected sound.
          enabled: initialEnabled,
          sound: ATHAN_SOUNDS.some(item => item.id === saved.sound)
            ? saved.sound
            : 'default_azan',
        } as Partial<AthanSettingsState>;
      },
      partialize: state => ({ enabled: state.enabled, sound: state.sound }),
    },
  ),
);
