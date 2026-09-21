import { AppText } from '@/components/ui/AppText';
import { fontFamily } from '@/theme';
import React from 'react';
import { StyleSheet } from 'react-native';
import quranSurahs from '@/assets/offline-res/quran-surahs.json';

export default function BismillahLine({
  surahNumber,
}: {
  surahNumber: number;
}) {
  if (quranSurahs[surahNumber - 1].bismillah_pre)
    return (
      <AppText style={styles.text}>
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </AppText>
    );

  return null;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.hafs,
    fontSize: 26,
    textAlign: 'center',
    // marginVertical: 10,
  },
});
