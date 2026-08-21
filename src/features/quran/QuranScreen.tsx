import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { AppIcon, AppText, Screen } from '../../components/ui';
import { spacing } from '../../theme';

export function QuranScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Screen padded style={styles.container}>
      <AppIcon name="book" size={48} color="status.info" />
      <AppText variant="title">{t('quran.title')}</AppText>
      <AppText variant="caption" color="muted">
        {t('common.appName')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
});
