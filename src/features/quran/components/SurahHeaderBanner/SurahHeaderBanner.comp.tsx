import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SurahNameBannerImage } from '@/assets/images';
import { AppText } from '@/components/ui';
import quranSurahs from '@/assets/offline-res/quran-surahs.json';
import { AppTheme, fontFamily, useTheme } from '@/theme';

export default function SurahHeaderBanner({
  surahNumber,
}: {
  surahNumber: number;
}) {
  const surah = quranSurahs.find(s => s.id === surahNumber);
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.banner, { borderColor: theme.text.primary }]}>
      <AppText style={styles.title}>{`سورة ${surah?.name_arabic}`}</AppText>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    banner: {
      marginVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderTopStartRadius: 20,
      borderBottomEndRadius: 20,
      backgroundColor: theme.background.brand,
    },
    title: {
      fontSize: 32,
      fontFamily: fontFamily.hafs,
      color: theme.basic.white,
    },
  });
