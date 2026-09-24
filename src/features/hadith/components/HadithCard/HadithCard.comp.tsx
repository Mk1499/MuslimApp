import { View, Text } from 'react-native';
import React from 'react';
import makeStyle from './styles';
import { IProps } from './type';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import useFormatter from '@/hooks/useFormatter';
import { useTranslation } from 'react-i18next';

export default function HadithCard({ item }: IProps) {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { getLocalizedText } = useFormatter();
  const { t } = useTranslation();

  const { arabic, english, collection, grade } = item ?? {};

  return (
    <AppCard style={styles.container}>
      <View style={styles.headerRow}>
        <AppText style={styles.rawyAuthorText}>{`${t('hadith.rawy')} : ${t(
          `hadith.rawyAuthor.${collection}`,
        )}`}</AppText>
        {grade?.toLocaleLowerCase() === 'sahih' && (
          <View style={styles.patchCont}>
            <AppText style={styles.patchText}>{t('hadith.sahih')}</AppText>
          </View>
        )}
      </View>
      <AppText style={styles.hadithText}>
        {getLocalizedText(arabic ?? '', english ?? '')}
      </AppText>
    </AppCard>
  );
}
