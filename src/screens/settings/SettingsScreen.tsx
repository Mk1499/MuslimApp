import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { fontFamily, fontSize, fontWeight, lightTheme, radius, spacing } from '../../theme';

export function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const language = useAppStore(state => state.language);
  const changeLanguage = useAppStore(state => state.changeLanguage);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('settings.languageSection')}</Text>

      <Pressable
        style={[styles.option, language === 'en' && styles.optionActive]}
        onPress={() => changeLanguage('en')}>
        <Text style={[styles.optionText, language === 'en' && styles.optionTextActive]}>
          {t('settings.english')}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.option, language === 'ar' && styles.optionActive]}
        onPress={() => changeLanguage('ar')}>
        <Text style={[styles.optionText, language === 'ar' && styles.optionTextActive]}>
          {t('settings.arabic')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    padding: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    color: lightTheme.textMuted,
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold as never,
  },
  option: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: lightTheme.border,
    backgroundColor: lightTheme.surface,
  },
  optionActive: {
    borderColor: lightTheme.primary,
    backgroundColor: lightTheme.primarySoft,
  },
  optionText: {
    color: lightTheme.text,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    textAlign: 'left',
  },
  optionTextActive: {
    color: lightTheme.primary,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold as never,
  },
});
