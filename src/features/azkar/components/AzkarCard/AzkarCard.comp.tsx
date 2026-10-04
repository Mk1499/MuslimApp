import { View } from 'react-native';
import React from 'react';
import makeStyle from './styles';
import { IProps } from './type';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

export default function AzkarCard({ item }: IProps) {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();

  const { ARABIC_TEXT: arabic, ID, REPEAT } = item ?? {};

  return (
    <AppCard
      style={styles.container}
      key={ID?.toString() ?? Math.random().toString()}
    >
      <AppText style={styles.hadithText}>{arabic}</AppText>
      <View style={styles.headerRow}>
        <AppText style={styles.rawyAuthorText}>{`${t('azkar.repeat')} : ${
          REPEAT ?? 1
        }`}</AppText>
      </View>
    </AppCard>
  );
}
