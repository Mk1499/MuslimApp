import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import moment from 'moment';
// Localised month/weekday names for the Gregorian date. Loaded here rather
// than globally so only this feature pays for it.
import 'moment/locale/ar';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import CountDownTimer from '@/components/common/CountDownTimer/CountDownTimer.comp';
import {
  AppCard,
  AppGradient,
  AppIcon,
  AppText,
  Screen,
  AppTouchable,
} from '../../components/ui';
import { useTheme } from '../../theme';
import makeStyles from './styles';
import { useAppStore } from '@/store/useAppStore';
import { useTodayHijriDate } from '@/hooks/queries/useHejriDate';
import { usePrayerTimes } from '@/hooks/queries/usePrayerTimes';
import useDateHook from '@/hooks/useDateHook';
import useLocation from '@/hooks/useLocation';
import ScreenNames from '@/navigation/ScreenNames';
import type { PrayerTimesResponse } from '@/types/prayer';

type PrayerKey = keyof PrayerTimesResponse['data']['prayer_times'];

/** The five daily prayers plus sunrise, in the order they occur each day. */
const PRAYER_ORDER: PrayerKey[] = [
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

/** One icon per prayer, all from a single set so the list stays consistent. */
const PRAYER_ICONS: Record<PrayerKey, string> = {
  imsak: 'cloudy-sharp',
  fajr: 'partly-sunny',
  sunrise: 'partly-sunny-sharp',
  dhuhr: 'sunny',
  asr: 'sunny-sharp',
  maghrib: 'cloudy-night-sharp',
  isha: 'cloudy-sharp',
};

export function PrayerTimesScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const route = useRoute();
  const { language, userLocation, userAddress } = useAppStore();
  const { getCurrentLocation } = useLocation();
  const { getFormattedTime } = useDateHook();

  const [selectedDate] = useState(new Date());

  // This screen is registered in two places: as the bottom tab "PrayerTimes"
  // and as the pushed HomeStack route ScreenNames.PrayerTimes ("prayerTimes").
  // Only the pushed copy sits on top of another screen, so only it renders a
  // back button — the tab version must not pop back to the splash screen.
  const isPushedScreen = String(route.name) === ScreenNames.PrayerTimes;

  const { data: hijriResponse, isLoading: hijriLoading } = useTodayHijriDate();
  const { data, isLoading, isError, refetch } = usePrayerTimes({
    latitude: userLocation?.latitude ?? 0,
    longitude: userLocation?.longitude ?? 0,
  });

  const { hijri } = hijriResponse?.data ?? {};
  const { prayer_times, current_status } = data?.data ?? {};

  // After Isha there is no "next" prayer left today, so fall back to Isha and
  // count upwards instead (same convention the home banner uses).
  const nextPrayerName: PrayerKey =
    current_status?.next_prayer && current_status.next_prayer !== 'none'
      ? (current_status.next_prayer as PrayerKey)
      : 'isha';

  const today = moment(selectedDate);
  // Weekday/month names come from the active locale while the digits stay
  // Latin, so the whole screen reads consistently (moment's `ar` locale would
  // otherwise swap them for ٠-٩ while the Hijri date keeps 0-9).
  const localeData = moment.localeData(language);
  const gregorianLabel = `${localeData.weekdays(
    today,
  )}, ${today.date()} ${localeData.months(today)} ${today.year()}`;

  const hijriLabel = hijri
    ? `${hijri.day} ${
        language === 'ar' ? hijri.month_name_arabic : hijri.month_name
      } ${hijri.year}`
    : '';

  const addressLabel = String(
    userAddress?.name ?? userAddress?.address?.city ?? '',
  );

  function renderPrayerList() {
    if (isLoading) {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={theme.button.primaryBg} />
        </View>
      );
    }

    if (isError || !prayer_times) {
      return (
        <View style={styles.stateBox}>
          <AppText color="muted" variant="body">
            {t('common.noData')}
          </AppText>
          <AppTouchable
            variant="secondary"
            style={styles.retryBtn}
            onPress={() => refetch()}
          >
            <AppText weight="semiBold">{t('common.retry')}</AppText>
          </AppTouchable>
        </View>
      );
    }

    return (
      <AppCard padded={false} style={styles.listCard}>
        {PRAYER_ORDER.map((name, index) => {
          const isNext = current_status?.next_prayer === name;

          return (
            <View
              key={name}
              style={[
                styles.row,
                index > 0 && styles.rowDivider,
                isNext && styles.rowActive,
              ]}
            >
              <AppIcon
                name={PRAYER_ICONS[name]}
                as="Ionicons"
                size={24}
                color={isNext ? theme.button.primaryBg : theme.text.secondary}
              />
              <AppText
                variant="subtitle"
                weight={isNext ? 'bold' : undefined}
                style={styles.rowName}
              >
                {t(`prayerTimes.${name}`)}
              </AppText>
              <AppText
                variant="subtitle"
                weight={isNext ? 'bold' : undefined}
                color={isNext ? 'primary' : 'secondary'}
                style={styles.rowTime}
              >
                {getFormattedTime(prayer_times[name])}
              </AppText>
            </View>
          );
        })}
      </AppCard>
    );
  }

  return (
    <Screen
      scroll
      padded
      isInnerPage={isPushedScreen}
      screenTitle={t('prayerTimes.title')}
    >
      <AppGradient preset="banner" style={styles.hero}>
        <View style={styles.dateBlock}>
          {(hijriLabel !== '' || hijriLoading) && (
            <AppText variant="subtitle" style={styles.hijriDate}>
              {hijriLabel || '…'}
            </AppText>
          )}
          <AppText variant="body" style={styles.gregorianDate}>
            {gregorianLabel}
          </AppText>

          {addressLabel !== '' && (
            <Pressable onPress={getCurrentLocation} style={styles.locationPill}>
              <AppIcon
                name="map-pin"
                as="Feather"
                size={14}
                color={theme.basic.white}
              />
              <AppText variant="caption" style={styles.locationText}>
                {addressLabel}
              </AppText>
            </Pressable>
          )}
        </View>

        {current_status && prayer_times && (
          <View style={styles.nextBlock}>
            <AppText variant="caption" style={styles.nextLabel}>
              {t('home.nextPrayer')}
            </AppText>
            <View style={styles.nextRow}>
              <AppText variant="title" style={styles.nextName}>
                {t(`prayerTimes.${nextPrayerName}`)}
              </AppText>
              <AppText variant="title" style={styles.nextTime}>
                {getFormattedTime(prayer_times[nextPrayerName])}
              </AppText>
            </View>
            <View style={styles.countdownRow}>
              <AppIcon
                name="clock-time-four-outline"
                as="MaterialCommunityIcons"
                size={16}
                color={theme.basic.white}
              />
              <CountDownTimer
                minutes={current_status.minutes_until_next}
                incMode={current_status.next_prayer === 'none'}
                onFinish={() => refetch()}
              />
            </View>
          </View>
        )}
      </AppGradient>

      {renderPrayerList()}
    </Screen>
  );
}
