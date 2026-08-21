import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { fontFamily, fontSize, fontWeight, lightTheme, radius, spacing } from '../../theme';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.greeting')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{t('tabs.prayerTimes')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: lightTheme.background,
    padding: spacing.lg,
  },
  title: {
    marginTop: spacing.xl,
    color: lightTheme.text,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: lightTheme.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
  },
  card: {
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: lightTheme.primarySoft,
  },
  cardText: {
    color: lightTheme.primary,
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold as never,
  },
});
