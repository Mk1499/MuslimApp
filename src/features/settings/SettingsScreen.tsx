import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  AppCard,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '../../components/ui';
import { spacing, useTheme } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import type { Language } from '../../i18n';

export function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useAppStore(state => state.language);
  const changeLanguage = useAppStore(state => state.changeLanguage);

  const renderLanguageOption = (code: Language, label: string) => {
    const isActive = language === code;

    return (
      <AppTouchable
        variant="ghost"
        onPress={() => changeLanguage(code)}
        style={styles.option}>
        <View
          style={[
            styles.optionInner,
            { borderColor: isActive ? theme.button.primaryBg : theme.card.border },
          ]}>
          <AppText
            weight={isActive ? 'bold' : 'medium'}
            color={isActive ? 'primaryBg' : 'secondary'}>
            {label}
          </AppText>
          {isActive && <AppIcon name="checkmark-circle" size={20} color="status.success" />}
        </View>
      </AppTouchable>
    );
  };

  return (
    <Screen padded scroll>
      <AppText variant="subtitle" color="muted" style={styles.sectionTitle}>
        {t('settings.languageSection')}
      </AppText>

      <AppCard padded={false} style={styles.sectionCard}>
        {renderLanguageOption('en', t('settings.english'))}
        {renderLanguageOption('ar', t('settings.arabic'))}
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  option: {
    alignSelf: 'stretch',
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
