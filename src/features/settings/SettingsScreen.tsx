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

export function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const language = useAppStore(state => state.language);
  const changeLanguage = useAppStore(state => state.changeLanguage);
  const themePreference = useAppStore(state => state.themePreference);
  const setThemePreference = useAppStore(state => state.setThemePreference);

  return (
    <Screen padded scroll>
      <AppText variant="subtitle" color="muted" style={styles.sectionTitle}>
        {t('settings.languageSection')}
      </AppText>

      <AppCard padded={false} style={styles.sectionCard}>
        <OptionRow
          label={t('settings.english')}
          isActive={language === 'en'}
          onPress={() => changeLanguage('en')}
        />
        <OptionRow
          label={t('settings.arabic')}
          isActive={language === 'ar'}
          onPress={() => changeLanguage('ar')}
        />
      </AppCard>

      <AppText variant="subtitle" color="muted" style={styles.sectionTitle}>
        {t('settings.appearanceSection')}
      </AppText>

      <AppCard padded={false} style={styles.sectionCard}>
        <OptionRow
          label={t('settings.system')}
          isActive={themePreference === 'system'}
          onPress={() => setThemePreference('system')}
        />
        <OptionRow
          label={t('settings.light')}
          isActive={themePreference === 'light'}
          onPress={() => setThemePreference('light')}
        />
        <OptionRow
          label={t('settings.dark')}
          isActive={themePreference === 'dark'}
          onPress={() => setThemePreference('dark')}
        />
      </AppCard>
    </Screen>
  );
}

interface OptionRowProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function OptionRow({ label, isActive, onPress }: OptionRowProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <AppTouchable variant="ghost" onPress={onPress} style={styles.option}>
      <View
        style={[
          styles.optionInner,
          { borderColor: isActive ? theme.button.primaryBg : theme.card.border },
        ]}>
        <AppText weight={isActive ? 'bold' : 'medium'} color={isActive ? 'primaryBg' : 'secondary'}>
          {label}
        </AppText>
        {isActive && <AppIcon name="checkmark-circle" size={20} color="status.success" />}
      </View>
    </AppTouchable>
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
    borderWidth: StyleSheet.hairlineWidth,
  },
});
