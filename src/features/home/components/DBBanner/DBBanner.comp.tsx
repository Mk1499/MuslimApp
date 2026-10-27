import { View, FlatList, Image, Pressable } from 'react-native';
import type { PrayerType } from '@/types/prayer';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { spacing, useTheme } from '@/theme';
import makeStyle from './styles';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppCard,
  AppGradient,
  AppIcon,
  AppText,
  AppTouchable,
} from '@/components/ui';
import { MosqueImage } from '@/assets/images';
import useDateHook from '@/hooks/useDateHook';
import { usePrayerTimes } from '@/hooks/queries/usePrayerTimes';
import { useTranslation } from 'react-i18next';
import CountDownTimer from '@/components/common/CountDownTimer/CountDownTimer.comp';
import { useTodayHijriDate } from '@/hooks/queries/useHejriDate';
import { useAppStore } from '@/store/useAppStore';
import useLocation from '@/hooks/useLocation';
import moment, { type Moment } from 'moment';
import {
  getLocalDateKey,
  getPrayerOutcomeScore,
  PrayerOutcome,
  TrackedPrayer,
  usePrayerTrackerStore,
} from '@/store/usePrayerTrackerStore';

const PRAYER_OUTCOMES: {
  value: PrayerOutcome;
  emoji: string;
  translationKey: string;
}[] = [
  { value: 'congregation', emoji: '😊', translationKey: 'congregation' },
  { value: 'alone', emoji: '😐', translationKey: 'alone' },
  { value: 'missed', emoji: '😞', translationKey: 'notPrayed' },
];

export default function DBBannerComponent() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const { isRTL } = useAppStore();
  const { getFormattedTime } = useDateHook();
  const [nextPrayer, setNextPrayer] = useState<PrayerType>();
  const [selectedPrayer, setSelectedPrayer] = useState<TrackedPrayer | null>(
    null,
  );
  const [now, setNow] = useState(() => moment());
  const prayerSheetRef = useRef<AppBottomSheetRef>(null);
  const today = getLocalDateKey(now.toDate());
  const todayHistory = usePrayerTrackerStore(state => state.history[today]);
  const recordPrayer = usePrayerTrackerStore(state => state.recordPrayer);
  const recordedPrayers = todayHistory ?? {};
  const { getCurrentLocation } = useLocation();
  const { userLocation, userAddress } = useAppStore();

  const { data: hijriDateData } = useTodayHijriDate();
  const { data, isLoading } = usePrayerTimes({
    latitude: userLocation?.latitude ?? 0,
    longitude: userLocation?.longitude ?? 0,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current_status]);

  useEffect(() => {
    const interval = setInterval(() => setNow(moment()), 60_000);
    return () => clearInterval(interval);
  }, []);

  function checkCurrentStatus() {
    if (current_status) {
      const nextPrayerName =
        current_status.next_prayer !== 'none'
          ? current_status.next_prayer
          : 'isha';
      const prayerTimesByName = prayer_times as
        | Record<string, string>
        | undefined;
      const prayerDateTimesByName = prayer_datetimes as
        | Record<string, Date | string>
        | undefined;

      setNextPrayer({
        name: nextPrayerName,
        time: prayerTimesByName?.[nextPrayerName],
        icon: nextPrayerName === 'fajr' ? 'sunrise' : 'sunset',
        timeUntilInMinutes:
          current_status?.minutes_until_next ??
          moment().diff(
            moment(prayerDateTimesByName?.[nextPrayerName]),
            'minutes',
          ),
      });
    }
  }

  function renderPrayerItem({ item }: { item: (typeof prayers)[0] }) {
    const prayerName = item.name as TrackedPrayer;
    const outcome = recordedPrayers[prayerName];
    const isUpcoming = isPrayerUpcoming(
      prayerName,
      prayer_datetimes,
      prayer_times,
      now,
    );

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(`prayerTimes.${item.name}`)}
        accessibilityHint={t(
          outcome
            ? 'prayerTracker.recordedHint'
            : isUpcoming
            ? 'prayerTracker.upcomingHint'
            : 'prayerTracker.tapToRecordHint',
        )}
        onPress={() => {
          setSelectedPrayer(prayerName);
          prayerSheetRef.current?.present();
        }}
        style={[
          styles.prayerItem,
          item.name === current_status?.next_prayer && styles.prayerItemActive,
          isUpcoming ? styles.prayerItemUpcoming : undefined,
        ]}
      >
        <View style={styles.prayerNameRow}>
          <AppText style={styles.prayerName}>
            {t(`prayerTimes.${item.name}`) ?? item.name}
          </AppText>
          {outcome ? (
            <AppText style={styles.prayerOutcomeEmoji}>
              {PRAYER_OUTCOMES.find(option => option.value === outcome)?.emoji}
            </AppText>
          ) : null}
        </View>
        <AppIcon
          name={item.icon}
          size={spacing.xxl}
          color={theme.basic.white}
          as="Feather"
        />
        <AppText style={styles.prayerTime}>{item.time}</AppText>
      </Pressable>
    );
  }

  const selectedOutcome = selectedPrayer
    ? recordedPrayers[selectedPrayer]
    : undefined;
  const selectedIsUpcoming = selectedPrayer
    ? isPrayerUpcoming(selectedPrayer, prayer_datetimes, prayer_times, now)
    : false;

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
        <Pressable onPress={getCurrentLocation} style={styles.addressCont}>
          <AppText style={styles.address}>
            {(userAddress && userAddress?.name) ??
              userAddress?.address?.city ??
              ''}
          </AppText>
          <AppIcon
            name="map-pin"
            size={spacing.xl}
            color={theme.basic.white}
            as="Feather"
          />
        </Pressable>
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
            {current_status?.next_prayer !== 'none'
              ? t('common.after')
              : t('common.from')}
          </AppText>
          <CountDownTimer
            minutes={nextPrayer?.timeUntilInMinutes ?? 0}
            onFinish={() => {
              checkCurrentStatus();
            }}
            incMode={current_status?.next_prayer === 'none'}
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
      <AppBottomSheet
        ref={prayerSheetRef}
        snapPoints={['55%']}
        contentContainerStyle={styles.prayerSheetContent}
      >
        {selectedPrayer ? (
          <>
            <AppText
              variant="subtitle"
              weight="semiBold"
              style={styles.prayerSheetTitle}
            >
              {t(`prayerTimes.${selectedPrayer}`)}
            </AppText>
            <AppText variant="caption" style={styles.prayerSheetSubtitle}>
              {selectedIsUpcoming
                ? t('prayerTracker.upcomingMessage')
                : selectedOutcome
                ? t('prayerTracker.editRecorded')
                : t('prayerTracker.chooseOutcome')}
            </AppText>
            <View style={styles.outcomeOptions}>
              {PRAYER_OUTCOMES.map(option => {
                const isSelected = selectedOutcome === option.value;
                const isDisabled = selectedIsUpcoming;
                return (
                  <AppTouchable
                    key={option.value}
                    variant="ghost"
                    disabled={isDisabled}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                      disabled: isDisabled,
                    }}
                    onPress={() => {
                      if (!selectedIsUpcoming && selectedPrayer) {
                        recordPrayer(today, selectedPrayer, option.value);
                        prayerSheetRef.current?.dismiss();
                      }
                    }}
                    style={[
                      styles.outcomeTouchable,
                      isDisabled ? styles.outcomeDisabled : undefined,
                    ]}
                  >
                    <AppCard
                      padded={false}
                      style={[
                        styles.outcomeCard,
                        isSelected ? styles.outcomeSelected : undefined,
                      ]}
                    >
                      <AppText style={styles.outcomeEmoji}>
                        {option.emoji}
                      </AppText>
                      <View style={styles.outcomeCopy}>
                        <AppText
                          variant="body"
                          weight="semiBold"
                          style={styles.outcomeTitle}
                        >
                          {t(`prayerTracker.${option.translationKey}`)}
                        </AppText>
                        <AppText variant="caption" style={styles.outcomeScore}>
                          {t('prayerTracker.points', {
                            count: getPrayerOutcomeScore(option.value),
                          })}
                        </AppText>
                      </View>
                      {isSelected && (
                        <AppIcon
                          name="checkmark-circle"
                          size={21}
                          color={theme.text.brand}
                        />
                      )}
                    </AppCard>
                  </AppTouchable>
                );
              })}
            </View>
          </>
        ) : null}
      </AppBottomSheet>
    </AppGradient>
  );
}

function isPrayerUpcoming(
  prayer: TrackedPrayer,
  prayerDateTimes: Record<string, Date | string> | undefined,
  prayerTimes: Record<string, string> | undefined,
  now: Moment,
): boolean {
  const scheduledDateTime = prayerDateTimes?.[prayer];
  let scheduled = scheduledDateTime
    ? moment(scheduledDateTime)
    : moment.invalid();

  if (!scheduled.isValid()) {
    const time = prayerTimes?.[prayer];
    if (!time) return true;
    scheduled = moment(
      time,
      ['h:mm A', 'hh:mm A', 'h:mm:ss A', 'HH:mm', 'H:mm', 'HH:mm:ss'],
      true,
    ).set({
      year: now.year(),
      month: now.month(),
      date: now.date(),
    });
  }

  if (!scheduled.isValid()) return true;
  return scheduled.isAfter(now);
}
