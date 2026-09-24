import React from 'react';
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useQuranPage } from '@/features/quran/hooks/useQuranPage';
import MushafLine from '@/features/quran/components/MushafLine/MushafLine.comp';
import SurahHeaderBanner from '@/features/quran/components/SurahHeaderBanner/SurahHeaderBanner.comp';
import BismillahLine from '@/features/quran/components/BismillahLine/BismillahLine.comp';
import PageFooter from '@/features/quran/components/PageFooter/PageFooter.comp';
import { SCREEN_HEIGHT } from '@/utils/constants';

function MushafPage({ pageNumber }: { pageNumber: number }) {
  const { pageData, lines, loading, error } = useQuranPage(pageNumber);

  if (loading) {
    return <ActivityIndicator style={styles.center} color="#C9A24B" />;
  }
  if (error || !pageData) {
    return <Text style={styles.error}>تعذّر تحميل الصفحة</Text>;
  }

  return (
    <View style={styles.page}>
      {lines.map(line => {
        if (line.words.length === 0) return null;
        const first = line.words[0];
        if (first.ayah_number === 1 && first?.position === 1) {
          return (
            <View>
              <SurahHeaderBanner
                key={line.lineNumber + 'SurahHeaderBanner'}
                surahNumber={+first?.surah_number}
              />
              <BismillahLine
                key={line.lineNumber + '-Basmala'}
                surahNumber={+first?.surah_number}
              />
              <MushafLine
                key={line.lineNumber + '-MushafLine'}
                words={line.words}
                onWordPress={() => {}}
              />
            </View>
          );
        }

        return (
          <MushafLine
            key={line.lineNumber}
            words={line.words}
            onWordPress={() => {}}
          />
        );
      })}

      <PageFooter hizbLabel="نصف الحزب ١٨" pageNumber={pageData.page} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    height: 0.8 * SCREEN_HEIGHT,
  },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 40 },
});

export default React.memo(MushafPage);
