import { View, FlatList, Image } from 'react-native';
import type { PrayerType } from '@/types/prayer';
import React, { useEffect, useMemo, useState } from 'react';
import { spacing, useTheme } from '@/theme';
import makeStyle from './styles';
import { AppGradient, AppIcon, AppText } from '@/components/ui';
import { MosqueImage } from '@/assets/images';
import useDateHook from '@/hooks/useDateHook';
import { usePrayerTimes } from '@/hooks/queries/usePrayerTimes';
import { useTranslation } from 'react-i18next';
import CountDownTimer from '@/components/common/CountDownTimer/CountDownTimer.comp';
import { useTodayHijriDate } from '@/hooks/queries/useHejriDate';
import { useAppStore } from '@/store/useAppStore';
import moment from 'moment';

export default function DBBannerComponent() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const { isRTL } = useAppStore();
  const { getFormattedTime } = useDateHook();
  const [nextPrayer, setNextPrayer] = useState<PrayerType>();

  const { data: hijriDateData } = useTodayHijriDate();
  const { data, isLoading } = usePrayerTimes({
    latitude: 24.7136,
    longitude: 46.6753,
  });
  const { prayer_times, current_status, prayer_datetimes } = data?.data ?? {};
  const { hijri } = hijriDateData?.data ?? {};

  const prayers = useMemo(
    () =>
      Object.entries(prayer_times || {}).map(([key, value]) => ({
        name: key,
        time: value,
        icon: key === 'fajr' ? 'sunrise' : 'sunset',
      })),
    [prayer_times],
  );

  useEffect(() => {
    checkCurrentStatus();
  }, [current_status]);

  function checkCurrentStatus() {
    if (current_status) {
      const nextPrayerName =
        current_status.next_prayer !== 'none'
          ? current_status.next_prayer
          : 'imsak';
      setNextPrayer({
        name: nextPrayerName,
        time: prayer_times?.[nextPrayerName] as string,
        icon: nextPrayerName === 'fajr' ? 'sunrise' : 'sunset',
        timeUntilInMinutes:
          current_status.minutes_until_next ??
          moment().diff(moment(prayer_datetimes?.[nextPrayerName]), 'minutes'),
      });
    }
  }

  function renderPrayerItem({ item }: { item: (typeof prayers)[0] }) {
    return (
      <View
        style={[
          styles.prayerItem,
          item.name === current_status?.next_prayer && styles.prayerItemActive,
        ]}
      >
        <AppText style={styles.prayerName}>
          {t(`prayerTimes.${item.name}`) ?? item.name}
        </AppText>
        <AppIcon
          name={item.icon}
          size={spacing.xxl}
          color={theme.basic.white}
          as="Feather"
        />
        <AppText style={styles.prayerTime}>{item.time}</AppText>
      </View>
    );
  }

  function renderHijriDate() {
    if (!hijri) {
      return null;
    }
    if (isRTL) {
      return '' + hijri.day + ' ' + hijri.month_name_arabic;
    } else {
      return '' + hijri.day + ' ' + hijri.month_name;
    }
  }

  return (
    <AppGradient colors={theme.gradient.banner} style={[styles.upperCont]}>
      <Image
        source={MosqueImage}
        style={styles.bgImg}
        tintColor={theme.basic.white}
      />
      <View style={styles.headerCont}>
        <View style={styles.dayDataCont}>
          <AppText style={styles.hDate} variant="subtitle">
            {renderHijriDate()}
          </AppText>
        </View>
      </View>
      <View style={styles.nextPrayerCont}>
        <AppText variant="title" style={styles.nextPrayerLabel}>
          {t(`prayerTimes.${nextPrayer?.name}`) ?? nextPrayer?.name}{' '}
        </AppText>
        <AppText style={styles.nextPlayerTime} variant="title">
          {getFormattedTime(nextPrayer?.time ?? '') ?? ''}
        </AppText>
        <View style={styles.nextPrayerRow}>
          <AppIcon
            name="time-outline"
            size={spacing.xl}
            color={theme.basic.white}
          />
          <AppText style={styles.nextPrayerTimeText}>
            {t(`prayerTimes.${nextPrayer?.name}`) ?? nextPrayer?.name}{' '}
            {t('common.after')}
          </AppText>
          <CountDownTimer
            minutes={nextPrayer?.timeUntilInMinutes ?? 0}
            onFinish={() => {
              checkCurrentStatus();
            }}
          />
        </View>
      </View>
      {isLoading ? (
        <View>
          <AppText>Loading prayer times...</AppText>
        </View>
      ) : (
        <FlatList
          data={prayers.filter(
            item => !['sunrise', 'imsak'].includes(item.name),
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paryersListCont}
          keyExtractor={item => item.name}
          renderItem={renderPrayerItem}
        />
      )}
    </AppGradient>
  );
}
