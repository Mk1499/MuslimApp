import React from 'react';
import { ImageBackground, Text, StyleSheet } from 'react-native';
import { SurahNameBannerImage } from '@/assets/images';

export default function SurahHeaderBanner({
  surahName,
}: {
  surahName: string;
}) {
  return (
    <ImageBackground
      source={SurahNameBannerImage} // ornament asset, bundle your own
      style={styles.banner}
      resizeMode="stretch"
    >
      <Text style={styles.title}>{surahName}</Text>
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
    fontFamily: 'UthmanicHafs',
    fontSize: 22,
    color: '#EDEDED',
  },
});
