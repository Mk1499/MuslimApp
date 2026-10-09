import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';

import type { IProps } from './types';
import { AppCard, AppIcon, AppText } from '@/components/ui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AccordionItem from '@/components/common/AccordionItem/AccordionItem.comp';
import { useTheme } from '@/theme';
import makeStyles from './styles';
import useFormatter from '@/hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import { AyaMutashabihat } from '@/types/mutashabihat';

export default function AyahMutCard({ ayah }: IProps) {
  const { t } = useTranslation();
  const { toArabicIndic, getLocalizedText } = useFormatter();
  const { arabic, ayah: ayahNumber, similar_verses } = ayah;
  const isExpanded = useSharedValue(false);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded.value ? '180deg' : '0deg') }],
  }));

  function renderSimilarAyahs() {
    return (
      <View>
        {/* <AppText style={styles.similarAyahsTitle}>
          {t('mutashabihat.similarAyahs')}:
        </AppText> */}
        {similar_verses?.map(
          (
            {
              arabic,
              ayah: similarAyahNumber,
              surah_name_arabic,
              surah_name_english,
            },
            index: number,
          ) => (
            <View style={styles.similarCont} key={index}>
              <AppText style={styles.aya}>
                - {arabic}
                <AppText style={styles.ayaNumber}>
                  {' ' + toArabicIndic(similarAyahNumber)}
                </AppText>
              </AppText>
              <AppText style={styles.similarSurahName}>
                {t('common.surah')}{' '}
                {getLocalizedText(surah_name_arabic, surah_name_english)}
              </AppText>
            </View>
          ),
        )}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        isExpanded.value = !isExpanded.value;
      }}
    >
      <AppCard style={styles.cardCont}>
        <View style={styles.header}>
          <View style={styles.ayaCont}>
            <AppText style={styles.aya}>
              {arabic}
              <AppText style={styles.ayaNumber}>
                {' ' + toArabicIndic(ayahNumber)}
              </AppText>
            </AppText>
          </View>
          <Animated.View style={[chevronStyle, styles.chevronIcon]}>
            <AppIcon
              name="chevron-down"
              size={25}
              color={theme.accent.primary}
            />
          </Animated.View>
        </View>
        <AccordionItem viewKey={'similar' + arabic} isExpanded={isExpanded}>
          {renderSimilarAyahs()}
        </AccordionItem>
      </AppCard>
    </Pressable>
  );
}
