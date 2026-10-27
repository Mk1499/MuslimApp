import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppCard,
  AppGradient,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '@/components/ui';
import { useTheme } from '@/theme';
import { useAppStore } from '@/store/useAppStore';
import makeStyles from './styles';
import ChoicesSheet from './components/ChoicesSheet/ChoicesSheet.comp';
import { Choice } from './components/ChoicesSheet/types';
import SettingAction from './components/SettingAction/SettingAction.comp';

type Language = 'en' | 'ar';
type ThemePreference = 'system' | 'light' | 'dark';

export function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const language = useAppStore(state => state.language);
  const changeLanguage = useAppStore(state => state.changeLanguage);
  const themePreference = useAppStore(state => state.themePreference);
  const setThemePreference = useAppStore(state => state.setThemePreference);
  const languageSheetRef = useRef<AppBottomSheetRef>(null);
  const themeSheetRef = useRef<AppBottomSheetRef>(null);
  const [pendingLanguage, setPendingLanguage] = useState<Language>(language);
  const [pendingTheme, setPendingTheme] =
    useState<ThemePreference>(themePreference);

  const languageChoices: Choice<Language>[] = [
    {
      value: 'en',
      label: t('settings.english'),
      description: t('settings.englishDescription'),
      icon: 'globe-outline',
    },
    {
      value: 'ar',
      label: t('settings.arabic'),
      description: t('settings.arabicDescription'),
      icon: 'language-outline',
    },
  ];
  const themeChoices: Choice<ThemePreference>[] = [
    {
      value: 'system',
      label: t('settings.system'),
      description: t('settings.systemDescription'),
      icon: 'phone-portrait-outline',
    },
    {
      value: 'light',
      label: t('settings.light'),
      description: t('settings.lightDescription'),
      icon: 'sunny-outline',
    },
    {
      value: 'dark',
      label: t('settings.dark'),
      description: t('settings.darkDescription'),
      icon: 'moon-outline',
    },
  ];

  const openLanguageSheet = () => {
    setPendingLanguage(language);
    languageSheetRef.current?.present();
  };
  const openThemeSheet = () => {
    setPendingTheme(themePreference);
    themeSheetRef.current?.present();
  };

  return (
    <Screen scroll withBGPattern={false} withBottomSafeArea={false}>
      <AppGradient preset="hero" style={styles.hero}>
        <View style={styles.heroIcon}>
          <AppIcon name="options-outline" size={24} color={theme.basic.white} />
        </View>
        <AppText variant="title" style={styles.heroTitle}>
          {t('settings.title')}
        </AppText>
        <AppText variant="body" style={styles.heroSubtitle}>
          {t('settings.subtitle')}
        </AppText>
      </AppGradient>

      <View style={styles.content}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          {t('settings.preferencesSection')}
        </AppText>
        <AppText variant="caption" style={styles.sectionDescription}>
          {t('settings.preferencesDescription')}
        </AppText>

        <AppCard padded={false} style={styles.actionsCard}>
          <SettingAction
            icon="globe-outline"
            title={t('settings.changeLanguage')}
            subtitle={t('settings.currentLanguage', {
              language: t(`settings.${language}`),
            })}
            onPress={openLanguageSheet}
          />
          <View style={styles.divider} />
          <SettingAction
            icon="color-palette-outline"
            title={t('settings.changeAppearance')}
            subtitle={t(`settings.${themePreference}`)}
            onPress={openThemeSheet}
          />
        </AppCard>

        <AppText variant="caption" style={styles.footer}>
          {t('settings.footer')}
        </AppText>
      </View>

      <ChoicesSheet
        ref={languageSheetRef}
        title={t('settings.languageSheetTitle')}
        subtitle={t('settings.languageSheetDescription', {
          language: t(`settings.${pendingLanguage}`),
        })}
        choices={languageChoices}
        selectedValue={pendingLanguage}
        onSelect={value => setPendingLanguage(value as Language)}
        onConfirm={() => {
          if (pendingLanguage !== language) changeLanguage(pendingLanguage);
          languageSheetRef.current?.dismiss();
        }}
        confirmLabel={t('settings.confirmLanguage')}
        cancelLabel={t('common.cancel')}
        onCancel={() => languageSheetRef.current?.dismiss()}
      />
      <ChoicesSheet
        ref={themeSheetRef}
        title={t('settings.appearanceSheetTitle')}
        subtitle={t('settings.appearanceSheetDescription', {
          appearance: t(`settings.${pendingTheme}`),
        })}
        choices={themeChoices}
        selectedValue={pendingTheme}
        onSelect={value => setPendingTheme(value as ThemePreference)}
        onConfirm={() => {
          if (pendingTheme !== themePreference)
            setThemePreference(pendingTheme);
          themeSheetRef.current?.dismiss();
        }}
        confirmLabel={t('settings.confirmAppearance')}
        cancelLabel={t('common.cancel')}
        onCancel={() => themeSheetRef.current?.dismiss()}
      />
    </Screen>
  );
}
