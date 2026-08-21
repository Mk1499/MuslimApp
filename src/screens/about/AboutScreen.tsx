import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { fontFamily, fontSize, lightTheme } from '../../theme';

/** Example of a screen pushed on top of the bottom tabs via the stack. */
export function AboutScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('about.title')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.background,
  },
  title: {
    color: lightTheme.text,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
  },
});
