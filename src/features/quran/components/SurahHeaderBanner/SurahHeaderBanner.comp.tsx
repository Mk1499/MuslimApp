import React from 'react';
import { ImageBackground, Text, StyleSheet } from 'react-native';
import { SurahNameBannerImage } from '@/assets/images';
import { AppText } from '@/components/ui';
import quranSurahs from '@/assets/offline-res/quran-surahs.json';

export default function SurahHeaderBanner({
  surahNumber,
}: {
  surahNumber: number;
}) {
  return (
    <ImageBackground
      source={SurahNameBannerImage} // ornament asset, bundle your own
      style={styles.banner}
      resizeMode="stretch"
    >
      <AppText style={styles.title}>
        {quranSurahs[surahNumber - 1].name_arabic}
      </AppText>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 56,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
