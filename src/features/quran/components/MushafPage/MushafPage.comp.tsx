import React from 'react';
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useQuranPage } from '@/features/quran/hooks/useQuranPage';
import MushafLine from '@/features/quran/components/MushafLine/MushafLine.comp';
import SurahHeaderBanner from '@/features/quran/components/SurahHeaderBanner/SurahHeaderBanner.comp';
import BismillahLine from '@/features/quran/components/BismillahLine/BismillahLine.comp';
import PageHeader from '@/features/quran/components/PageHeader/PageHeader.comp';
import PageFooter from '@/features/quran/components/PageFooter/PageFooter.comp';

export default function MushafPage({ pageNumber }: { pageNumber: number }) {
  const { pageData, lines, loading, error } = useQuranPage(pageNumber);

  if (loading) {
    return <ActivityIndicator style={styles.center} color="#C9A24B" />;
  }
  if (error || !pageData) {
    return <Text style={styles.error}>تعذّر تحميل الصفحة</Text>;
  }

  return (
    <View style={styles.page}>
      {/* <PageHeader juzNumber={9} surahName={pageData.surah.name_arabic} /> */}

      {lines.map(line => {
        if (line.words.length === 0) return null;
        const first = line.words[0];
        console.log({ first, line });

        if (first.char_type_name === 'surah_name') {
          return (
            <SurahHeaderBanner
              key={line.lineNumber}
              surahName={first.text_uthmani}
            />
          );
        }
        if (first.char_type_name === 'basmallah') {
          return <BismillahLine key={line.lineNumber} />;
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
    flex: 1,
    paddingHorizontal: 16,
  },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 40 },
});
