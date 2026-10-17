import React, { useState, useCallback } from 'react';
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { QuranWord } from '@/types/quran';
import { useQuranPage } from '@/features/quran/hooks/useQuranPage';
import MushafLine from '@/features/quran/components/MushafLine/MushafLine.comp';
import SurahHeaderBanner from '@/features/quran/components/SurahHeaderBanner/SurahHeaderBanner.comp';
import BismillahLine from '@/features/quran/components/BismillahLine/BismillahLine.comp';
import PageFooter from '@/features/quran/components/PageFooter/PageFooter.comp';
import { SCREEN_HEIGHT } from '@/utils/constants';

function MushafPage({
  pageNumber,
  playingAya,
  onWordPress,
}: {
  pageNumber: number;
  playingAya: string | null;
  onWordPress: (word: QuranWord) => void;
}) {
  const { pageData, lines, loading, error } = useQuranPage(pageNumber);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleWordPress = useCallback(
    (word: QuranWord) => {
      // Key on the full surah:ayah pair so selection is unique even when a
      // page holds multiple surahs with overlapping ayah numbers.
      setSelectedKey(`${word.surah_number}:${word.ayah_number}`);
      onWordPress(word);
    },
    [onWordPress],
  );

  if (loading) {
    return <ActivityIndicator style={styles.center} color="#C9A24B" />;
  }
  if (error || !pageData) {
    return <Text style={styles.error}>تعذّر تحميل الصفحة</Text>;
  }

  return (
    <View style={styles.page}>
      {/* حاوية للمحتوى عشان تاخد المساحة المتاحة وتتضغط جواها */}
      <View style={styles.contentContainer}>
        {lines.map(line => {
          if (line.words.length === 0) return null;
          const first = line.words[0];
          if (first.ayah_number === 1 && first?.position === 1) {
            return (
              <View
                key={line.lineNumber + '-SurahStart'}
                style={styles.shrinkableItem}
              >
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
                  onWordPress={handleWordPress}
                  selectedKey={selectedKey}
                  playingKey={playingAya}
                />
              </View>
            );
          }

          return (
            <View key={line.lineNumber} style={styles.shrinkableItem}>
              <MushafLine
                words={line.words}
                onWordPress={handleWordPress}
                selectedKey={selectedKey}
                playingKey={playingAya}
              />
            </View>
          );
        })}
      </View>

      <PageFooter pageNumber={pageData.page} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    height: 0.84 * SCREEN_HEIGHT, // أو 100% لو الـ parent بتاعه واخد ارتفاع الشاشة مظبوط
    justifyContent: 'space-between',
    overflow: 'hidden', // عشان نمنع أي حاجة تطلع بره الحدود
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // لو عايز توزع السطور جوه المساحة المتاحة
    flexShrink: 1,
  },
  shrinkableItem: {
    flexShrink: 1, // دي بتخلي العنصر يقبل الكشان لو المساحة ضاقت
  },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 40 },
});

export default React.memo(MushafPage);
