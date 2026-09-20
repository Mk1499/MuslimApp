import React from 'react';
import { Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuranPage } from '@/features/quran/hooks/useQuranPage';
import { QuranWord } from '@/types/quran';
import MushafLine from '@/features/quran/components/MushafLine/MushafLine.comp';
import SurahHeaderBanner from '@/features/quran/components/SurahHeaderBanner/SurahHeaderBanner.comp';
import BismillahLine from '@/features/quran/components/BismillahLine/BismillahLine.comp';
import PageHeader from '@/features/quran/components/PageHeader/PageHeader.comp';
import PageFooter from '@/features/quran/components/PageFooter/PageFooter.comp';
import { Screen } from '@/components/ui';

interface Props {
  pageNumber: number;
  onWordPress?: (word: QuranWord) => void;
}

export default function MushafPage({ pageNumber, onWordPress }: Props) {
  const { pageData, lines, loading, error } = useQuranPage(pageNumber);

  if (loading) {
    return <ActivityIndicator style={styles.center} color="#C9A24B" />;
  }
  if (error || !pageData) {
    return <Text style={styles.error}>تعذّر تحميل الصفحة</Text>;
  }

  // Derive current surah name/juz from the first "word"-type entry on the page.
  const firstWord = pageData.words.find(w => w.char_type_name === 'word');
  const surahName = firstWord ? `سورة ${firstWord.surah_number}` : '';

  return (
    <Screen style={styles.page}>
      <PageHeader juzNumber={9} surahName={surahName} />

      {lines.map(line => {
        if (line.words.length === 0) return null;
        const first = line.words[0];

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
            onWordPress={onWordPress}
          />
        );
      })}

      <PageFooter hizbLabel="نصف الحزب ١٨" pageNumber={pageData.page} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 40 },
});
