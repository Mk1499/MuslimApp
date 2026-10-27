import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { AppCard, AppIcon, AppText, Screen } from '@/components/ui';
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
  const styles = makeStyles(theme);
  const history = usePrayerTrackerStore(state => state.history) ?? {};
  const firstOpenedDate = usePrayerTrackerStore(state => state.firstOpenedDate);
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
  const dateKeys = useMemo(
    () =>
      Array.from({ length: daysTracked }, (_, index) =>
        moment().subtract(index, 'days').format('YYYY-MM-DD'),
      ),
    [daysTracked],
  );

  function dayScore(date: string): number {
    return PRAYER_NAMES.reduce(
      (score, prayer) => score + getPrayerOutcomeScore(history[date]?.[prayer]),
      0,
    );
  }

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
        keyExtractor={date => date}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: date }) => {
          const dayHistory = history[date] ?? {};
          const formattedDate = formatDate(date, i18n.language);

          return (
            <AppCard style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dateCopy}>
                  <AppText
                    variant="body"
                    weight="semiBold"
                    style={styles.dateTitle}
                  >
                    {formattedDate}
                  </AppText>
                  {date === moment().format('YYYY-MM-DD') && (
                    <AppText variant="caption" style={styles.todayLabel}>
                      {t('prayerTracker.today')}
                    </AppText>
                  )}
                </View>
                <View style={styles.scoreBadge}>
                  <AppIcon
                    name="trophy-outline"
                    size={16}
                    color={theme.text.brand}
                  />
                  <AppText
                    variant="caption"
                    weight="semiBold"
                    style={styles.scoreText}
                  >
                    {t('prayerTracker.dayScore', { score: dayScore(date) })}
                  </AppText>
                </View>
              </View>
              <View style={styles.prayerList}>
                {PRAYER_NAMES.map(prayer => {
                  const outcome = dayHistory[prayer];
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
        }}
      />
    </Screen>
  );
}

function formatDate(date: string, locale: string): string {
  const value = new Date(`${date}T12:00:00`);
  try {
    if (
      typeof Intl !== 'undefined' &&
      typeof Intl.DateTimeFormat === 'function'
    ) {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(value);
    }
  } catch {
    // Fall back for runtimes without the requested locale data.
  }
  return moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
}
