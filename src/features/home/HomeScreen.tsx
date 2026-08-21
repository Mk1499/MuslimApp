import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppCard,
  AppGradient,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '../../components/ui';
import { radius, spacing, useTheme } from '../../theme';

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const sheetRef = useRef<AppBottomSheetRef>(null);
  return (
    <Screen padded>
      <AppGradient preset="hero" style={styles.hero}>
        <View style={styles.heroHeader}>
          <View style={styles.heroTexts}>
            <AppText variant="display" color="inverse">
              {t('home.greeting')}
            </AppText>
            <AppText variant="body" color="inverse">
              {t('home.subtitle')}
            </AppText>
          </View>
          <AppIcon name="moon" size={28} color="text.inverse" />
        </View>
      </AppGradient>

      <AppCard style={styles.prayerCard}>
        <View style={styles.cardHeader}>
          <AppIcon name="time" size={22} color="status.success" />
          <AppText variant="subtitle">{t('home.nextPrayer')}</AppText>
        </View>
        <AppTouchable
          variant="ghost"
          style={[styles.row, { borderTopColor: theme.divider }]}
          onPress={() => sheetRef.current?.present()}>
          <AppText color="secondary">{t('prayerTimes.title')}</AppText>
          <AppText weight="semiBold" color="success">
            {t('home.viewAllPrayers')}
          </AppText>
        </AppTouchable>
      </AppCard>

      <AppCard variant="secondary" style={styles.quoteCard}>
        <AppIcon name="book" size={22} color="accent.primary" />
        <AppText variant="caption" color="secondary">
          {t('quran.title')}
        </AppText>
      </AppCard>

      <AppBottomSheet ref={sheetRef} snapPoints={['55%']}>
        <View style={styles.sheetContent}>
          <AppText variant="title">{t('prayerTimes.title')}</AppText>
          <View style={styles.sheetList}>
            {PRAYER_KEYS.map(key => (
              <View
                key={key}
                style={[styles.sheetRow, { borderBottomColor: theme.divider }]}>
                <AppText>{t(`prayerTimes.${key}`)}</AppText>
                <AppText weight="semiBold" color="muted">
                  --
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </AppBottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  prayerCard: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  quoteCard: {
    borderRadius: radius.lg,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  sheetContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  sheetList: {
    gap: spacing.sm,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
