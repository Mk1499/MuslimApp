import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  AppCard,
  AppGradient,
  AppIcon,
  AppText,
  Screen,
} from '@/components/ui';
import type { AppIconName } from '@/components/ui/AppIcon';
import {
  getPrayerOutcomeScore,
  PRAYER_NAMES,
  PrayerOutcome,
  usePrayerTrackerStore,
} from '@/store/usePrayerTrackerStore';
import { useTheme } from '@/theme';
import makeStyles from './styles';

const OUTCOME_EMOJI: Record<PrayerOutcome, string> = {
  congregation: '😊',
  alone: '😐',
  missed: '😞',
};

export default function PrayerTrackerScreen(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const history = usePrayerTrackerStore(state => state.history) ?? {};
  const firstOpenedDate = usePrayerTrackerStore(state => state.firstOpenedDate);
  const normalizedHistory = useMemo(() => {
    const result: typeof history = {};
    Object.entries(history).forEach(([storedDate, day]) => {
      const date = normalizeDateKey(storedDate);
      if (date) {
        result[date] = { ...(result[date] ?? {}), ...day };
      }
    });
    return result;
  }, [history]);

  const parsedFirstOpenedDate = moment(firstOpenedDate, 'YYYY-MM-DD', true);
  const daysSinceFirstOpen = parsedFirstOpenedDate.isValid()
    ? Math.max(
        0,
        moment()
          .startOf('day')
          .diff(parsedFirstOpenedDate.startOf('day'), 'days'),
      )
    : 0;
  const daysTracked = Math.min(daysSinceFirstOpen + 1, 3_650);
  const maxPossibleScore = daysTracked * PRAYER_NAMES.length * 27;
  const { totalScore, recordedPrayers, trackedDays } = useMemo(() => {
    let totalScore = 0;
    let recordedPrayers = 0;
    let trackedDays = 0;

    Object.values(normalizedHistory).forEach(day => {
      let dayHasRecord = false;
      PRAYER_NAMES.forEach(prayer => {
        const outcome = day[prayer];
        if (outcome !== undefined) {
          recordedPrayers += 1;
          dayHasRecord = true;
          totalScore += getPrayerOutcomeScore(outcome);
        }
      });
      if (dayHasRecord) trackedDays += 1;
    });

    return { totalScore, recordedPrayers, trackedDays };
  }, [normalizedHistory]);
  const scoreProgress =
    maxPossibleScore > 0 ? Math.min(totalScore / maxPossibleScore, 1) : 0;
  const dateKeys = useMemo(() => {
    const generatedDates = Array.from({ length: daysTracked }, (_, index) =>
      moment().locale('en').subtract(index, 'days').format('YYYY-MM-DD'),
    );

    // Settings totals every saved record. Include those exact keys here too,
    // even if the device date or first-open date changed since they were
    // recorded; otherwise the history can silently show only empty days.
    return [
      ...new Set([...generatedDates, ...Object.keys(normalizedHistory)]),
    ].sort((left, right) => right.localeCompare(left));
  }, [daysTracked, normalizedHistory]);

  const renderDay = useCallback(
    ({ item: date }: { item: string }) => (
      <PrayerDayRow
        date={date}
        dayHistory={normalizedHistory[date]}
        score={PRAYER_NAMES.reduce(
          (score, prayer) =>
            score + getPrayerOutcomeScore(normalizedHistory[date]?.[prayer]),
          0,
        )}
        isToday={date === moment().format('YYYY-MM-DD')}
        styles={styles}
      />
    ),
    [normalizedHistory, styles],
  );

  return (
    <Screen
      isInnerPage
      screenTitle={t('prayerTracker.historyTitle')}
      scroll={false}
      padded
      withBGPattern={false}
    >
      <FlatList
        data={dateKeys}
        extraData={normalizedHistory}
        initialNumToRender={6}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        removeClippedSubviews
        ListHeaderComponent={
          <AppGradient preset="hero" style={styles.statsCard}>
            <View style={styles.statsHeading}>
              <View style={styles.statsIcon}>
                <AppIcon
                  name="trophy-outline"
                  size={20}
                  color={theme.basic.white}
                />
              </View>
              <View style={styles.statsTitleCopy}>
                <AppText variant="subtitle" style={styles.statsTitle}>
                  {t('prayerTracker.statsTitle')}
                </AppText>
                <AppText variant="caption" style={styles.statsSubtitle}>
                  {t('prayerTracker.statsSubtitle')}
                </AppText>
              </View>
            </View>
            <View style={styles.scoreSummary}>
              <AppText
                variant="title"
                weight="semiBold"
                style={styles.totalScore}
              >
                {totalScore}
              </AppText>
              <AppText variant="body" style={styles.scoreMaximum}>
                / {maxPossibleScore} {t('prayerTracker.pointsLabel')}
              </AppText>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${scoreProgress * 100}%` },
                ]}
              />
            </View>
            <View style={styles.statsMetrics}>
              <StatMetric
                icon="calendar-outline"
                label={t('prayerTracker.trackedDays')}
                value={String(trackedDays)}
                style={styles}
              />
              <View style={styles.metricDivider} />
              <StatMetric
                icon="checkmark-circle-outline"
                label={t('prayerTracker.recordedPrayers')}
                value={`${recordedPrayers}/${
                  daysTracked * PRAYER_NAMES.length
                }`}
                style={styles}
              />
            </View>
          </AppGradient>
        }
        ListHeaderComponentStyle={styles.listHeader}
        keyExtractor={date => date}
        contentContainerStyle={styles.listContent}
        renderItem={renderDay}
      />
    </Screen>
  );
}

const PrayerDayRow = memo(function PrayerDayRow({
  date,
  dayHistory,
  score,
  isToday,
  styles,
}: {
  date: string;
  dayHistory?: Record<string, PrayerOutcome>;
  score: number;
  isToday: boolean;
  styles: ReturnType<typeof makeStyles>;
}): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  return (
    <AppCard style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <View style={styles.dateCopy}>
          <AppText variant="body" weight="semiBold" style={styles.dateTitle}>
            {formatDate(date, i18n.language)}
          </AppText>
          {isToday && (
            <AppText variant="caption" style={styles.todayLabel}>
              {t('prayerTracker.today')}
            </AppText>
          )}
        </View>
        <View style={styles.scoreBadge}>
          <AppIcon name="trophy-outline" size={16} color={theme.text.brand} />
          <AppText variant="caption" weight="semiBold" style={styles.scoreText}>
            {t('prayerTracker.dayScore', { score })}
          </AppText>
        </View>
      </View>
      <View style={styles.prayerList}>
        {PRAYER_NAMES.map(prayer => {
          const outcome = dayHistory?.[prayer];
          const emoji = outcome ? OUTCOME_EMOJI[outcome] : '—';
          return (
            <View key={prayer} style={styles.prayerRow}>
              <AppText variant="caption" style={styles.prayerName}>
                {t(`prayerTimes.${prayer}`)}
              </AppText>
              <View style={styles.prayerResult}>
                <AppText style={styles.resultEmoji}>{emoji}</AppText>
                <AppText variant="caption" style={styles.resultLabel}>
                  {outcome
                    ? t(
                        `prayerTracker.${
                          outcome === 'missed' ? 'notPrayed' : outcome
                        }`,
                      )
                    : t('prayerTracker.notRecorded')}
                </AppText>
                <AppText variant="caption" style={styles.resultScore}>
                  {getPrayerOutcomeScore(outcome)}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </AppCard>
  );
});

function StatMetric({
  icon,
  label,
  value,
  style,
}: {
  icon: AppIconName;
  label: string;
  value: string;
  style: ReturnType<typeof makeStyles>;
}): React.JSX.Element {
  const theme = useTheme();
  return (
    <View style={style.metric}>
      <AppIcon name={icon} size={16} color={theme.basic.white} />
      <View style={style.metricCopy}>
        <AppText variant="caption" style={style.metricLabel}>
          {label}
        </AppText>
        <AppText variant="body" weight="semiBold" style={style.metricValue}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

function formatDate(date: string, locale: string): string {
  return moment(date, 'YYYY-MM-DD').format('dddd, MMM D, YYYY');
}

function normalizeDateKey(date: string): string | null {
  const datePrefix = date.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (datePrefix && moment(datePrefix, 'YYYY-MM-DD', true).isValid()) {
    return datePrefix;
  }

  const parsedDate = moment(date);
  return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null;
}
