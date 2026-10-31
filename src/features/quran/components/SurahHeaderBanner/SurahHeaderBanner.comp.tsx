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
  const surahId = () => {
    if (!surah?.id) {
      return '';
    }
    if (surah?.id > 0 && surah?.id < 10) {
      return `surah00${surah.id}`;
    }
    if (surah?.id >= 10 && surah?.id < 100) {
      return `surah0${surah.id}`;
    }
    if (surah?.id >= 100) {
      return `surah${surah.id}`;
    }
    return '';
  };

  return (
    <View style={[styles.banner, { borderColor: theme.text.primary }]}>
      <AppText style={styles.title}>{surahId()}</AppText>
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
      // padding: 8,
    },
    title: {
      fontSize: 40,
      fontFamily: fontFamily.surahName,
      color: theme.basic.white,
    },
  });
