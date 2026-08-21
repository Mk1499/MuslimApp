import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { AppIcon, AppText, Screen } from '../../components/ui';
import { spacing } from '../../theme';

export function AboutScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Screen padded style={styles.container}>
      <AppIcon name="information-circle" size={48} color="accent.primary" />
      <AppText variant="title">{t('about.title')}</AppText>
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
