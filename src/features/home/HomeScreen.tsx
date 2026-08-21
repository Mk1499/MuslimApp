import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppIcon, AppText, Screen } from '../../components/ui';
import { radius, spacing, useTheme } from '../../theme';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Screen padded>
      <View style={styles.header}>
        <AppText variant="display">{t('home.greeting')}</AppText>
        <AppText variant="body" color="muted">
          {t('home.subtitle')}
        </AppText>
      </View>

      <AppCard style={styles.prayerCard}>
        <View style={styles.cardHeader}>
          <AppIcon name="time" size={22} color="status.success" />
          <AppText variant="subtitle">{t('prayerTimes.title')}</AppText>
        </View>
        <View style={[styles.row, { borderTopColor: theme.divider }]}>
          <AppText color="secondary">{t('tabs.home')}</AppText>
          <AppText weight="semiBold" color="success">
            --
          </AppText>
        </View>
      </AppCard>

      <AppCard variant="secondary" style={styles.quoteCard}>
        <AppIcon name="book" size={22} color="accent.primary" />
        <AppText variant="caption" color="secondary">
          {t('quran.title')}
        </AppText>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
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
});
