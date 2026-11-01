import { View, FlatList, Image, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import moment from 'moment';
import {
  getLocalDateKey,
  getPrayerOutcomeScore,
  PrayerOutcome,
  TrackedPrayer,
  usePrayerTrackerStore,
} from '@/store/usePrayerTrackerStore';
import {
  getNextPrayer,
  isPrayerUpcoming,
  PRAYER_ORDER,
} from '@/features/prayer-times/prayerTimes.utils';

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
  const { prayerTimes } = data ?? {};
  const { hijri } = hijriDateData?.data ?? {};
  const nextPrayer = getNextPrayer(prayerTimes, now);
  const prayers = PRAYER_ORDER.map(name => ({
    name,
    time: prayerTimes ? getFormattedTime(prayerTimes[name]) : '',
    icon: name === 'fajr' ? 'sunrise' : 'sunset',
  }));

  useEffect(() => {
    const interval = setInterval(() => setNow(moment()), 60_000);
    return () => clearInterval(interval);
  }, []);

  function renderPrayerItem({ item }: { item: (typeof prayers)[0] }) {
    const prayerName = item.name as TrackedPrayer;
    const outcome = recordedPrayers[prayerName];
    const isUpcoming = isPrayerUpcoming(prayerName, prayerTimes, now);

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
          if (isUpcoming) {
            return;
          }
          setSelectedPrayer(prayerName);
          prayerSheetRef.current?.present();
        }}
        style={[
          styles.prayerItem,
          nextPrayer?.name === item.name &&
            nextPrayer.isElapsed === false &&
            styles.prayerItemActive,
          !isUpcoming ? styles.prayerItemUpcoming : undefined,
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
    ? isPrayerUpcoming(selectedPrayer, prayerTimes, now)
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
          <AppText style={styles.address} numberOfLines={1}>
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
          {nextPrayer ? getFormattedTime(nextPrayer.time) : ''}
        </AppText>
        <View style={styles.nextPrayerRow}>
          <AppIcon
            name="time-outline"
            size={spacing.xl}
            color={theme.basic.white}
          />
          <AppText style={styles.nextPrayerTimeText}>
            {t(`prayerTimes.${nextPrayer?.name}`) ?? nextPrayer?.name}{' '}
            {nextPrayer?.isElapsed ? t('common.from') : t('common.after')}
          </AppText>
          <CountDownTimer
            minutes={nextPrayer?.minutesUntil ?? 0}
            onFinish={() => setNow(moment())}
            incMode={nextPrayer?.isElapsed ?? false}
          />
        </View>
      </View>
      {isLoading ? (
        <View>
          <AppText>Loading prayer times...</AppText>
        </View>
      ) : (
        <FlatList
          data={prayers.filter(item => item.name !== 'sunrise')}
          // Prayer outcomes live outside `data`; pass them explicitly so the
          // memoized list always refreshes its visible rows after a store write.
          extraData={recordedPrayers}
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
