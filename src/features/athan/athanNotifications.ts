import {
  AndroidImportance,
  TriggerType,
  AuthorizationStatus,
  type Notification,
} from 'react-native-notify-kit';
import notifee from 'react-native-notify-kit';
import {
  CalculationMethod,
  Coordinates,
  PrayerTimes as AdhanPrayerTimes,
} from 'adhan';
import i18next from '@/i18n';
import {
  PRAYER_NAMES,
  type TrackedPrayer,
} from '@/store/usePrayerTrackerStore';
import {
  useAthanSettingsStore,
  type AthanEnabledPrayers,
  type AthanSoundId,
} from '@/store/useAthanSettingsStore';
import { useAppStore } from '@/store/useAppStore';

const ATHAN_NOTIFICATION_PREFIX = 'athan-';
const SCHEDULE_DAYS = 7;
const CHANNEL_PREFIX = 'athan-sound-';
const prayerLabels: Record<TrackedPrayer, { en: string; ar: string }> = {
  fajr: { en: 'Fajr', ar: 'الفجر' },
  dhuhr: { en: 'Dhuhr', ar: 'الظهر' },
  asr: { en: 'Asr', ar: 'العصر' },
  maghrib: { en: 'Maghrib', ar: 'المغرب' },
  isha: { en: 'Isha', ar: 'العشاء' },
};

export type AthanScheduleOptions = {
  latitude: number;
  longitude: number;
  countryCode?: string;
  enabled: AthanEnabledPrayers;
  sound: AthanSoundId;
};

let scheduling = Promise.resolve();

/** Rebuild the next seven days of local Athan alerts using the latest location. */
export function rescheduleAthanNotifications(
  options: AthanScheduleOptions,
): Promise<void> {
  scheduling = scheduling
    .catch(() => undefined)
    .then(() => scheduleAthanNotifications(options));
  return scheduling;
}

/** Rebuild using the currently persisted location and Athan preferences. */
export function rescheduleAthanNotificationsForCurrentSettings(): Promise<void> {
  const { userLocation, userAddress } = useAppStore.getState();
  if (!userLocation) return Promise.resolve();

  const { enabled, sound } = useAthanSettingsStore.getState();
  return rescheduleAthanNotifications({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    countryCode: userAddress?.address?.country_code,
    enabled,
    sound,
  });
}

async function scheduleAthanNotifications({
  latitude,
  longitude,
  countryCode,
  enabled,
  sound,
}: AthanScheduleOptions): Promise<void> {
  const currentTriggers = await notifee.getTriggerNotifications();
  const oldAthanIds = currentTriggers
    .map(trigger => trigger.notification.id)
    .filter(
      (id): id is string =>
        typeof id === 'string' && id.startsWith(ATHAN_NOTIFICATION_PREFIX),
    );
  if (oldAthanIds.length > 0) {
    await notifee.cancelTriggerNotifications(oldAthanIds);
  }

  if (!PRAYER_NAMES.some(prayer => enabled[prayer])) {
    return;
  }

  const permission = await notifee.getNotificationSettings();
  if (
    permission.authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
    permission.authorizationStatus !== AuthorizationStatus.PROVISIONAL
  ) {
    return;
  }

  const channelId = `${CHANNEL_PREFIX}${sound}`;
  await notifee.createChannel({
    id: channelId,
    name: 'Athan reminders',
    description: 'Scheduled reminders at enabled prayer times.',
    importance: AndroidImportance.HIGH,
    sound,
  });

  const coordinates = new Coordinates(latitude, longitude);
  const calculationParameters =
    countryCode?.toLowerCase() === 'eg'
      ? CalculationMethod.Egyptian()
      : CalculationMethod.UmmAlQura();
  const now = new Date();
  const language = i18next.language.startsWith('ar') ? 'ar' : 'en';

  for (let dayOffset = 0; dayOffset < SCHEDULE_DAYS; dayOffset += 1) {
    const day = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + dayOffset,
    );
    const prayerTimes = new AdhanPrayerTimes(
      coordinates,
      day,
      calculationParameters,
    );

    for (const prayer of PRAYER_NAMES) {
      if (!enabled[prayer]) continue;
      const timestamp = prayerTimes[prayer].getTime();
      if (timestamp <= now.getTime() + 5_000) continue;

      const dateKey = `${day.getFullYear()}${String(
        day.getMonth() + 1,
      ).padStart(2, '0')}${String(day.getDate()).padStart(2, '0')}`;
      const label = prayerLabels[prayer][language];
      const notification: Notification = {
        id: `${ATHAN_NOTIFICATION_PREFIX}${prayer}-${dateKey}`,
        title:
          language === 'ar'
            ? `حان الآن وقت صلاة ${label}`
            : `${label} prayer time`,
        body: language === 'ar' ? 'حي على الصلاة' : 'It is time to pray.',
        android: {
          channelId,
          pressAction: { id: 'default' },
        },
        // The bundled iOS sound files are included in the app target. iOS
        // notification sounds are limited by the operating system to 30 sec.
        ios: { sound: `${sound}.caf` },
      };

      await notifee.createTriggerNotification(notification, {
        type: TriggerType.TIMESTAMP,
        timestamp,
      });
    }
  }
}
