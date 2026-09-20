import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuranWord } from '@/types/quran';
import AyahEndBadge from '@/features/quran/components/AyahEndBadge/AyahEndBadge.comp';

interface Props {
  words: QuranWord[];
  onWordPress?: (word: QuranWord) => void;
}

export default function MushafLine({ words, onWordPress }: Props) {
  return (
    <View style={styles.lineRow}>
      {words.map((w, idx) => {
        if (w.char_type_name === 'end') {
          return (
            <AyahEndBadge
              key={`${w.verse_key}-end`}
              ayahNumber={w.ayah_number}
            />
          );
        }
        return (
          <Text
            key={`${w.verse_key}-${w.position}-${idx}`}
            style={styles.word}
            onPress={onWordPress ? () => onWordPress(w) : undefined}
            suppressHighlighting
          >
            {w.text_uthmani}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  lineRow: {
    flexDirection: 'row-reverse', // Arabic reads right-to-left
    flexWrap: 'nowrap',
    // Approximates mushaf justification by spreading words to fill the width.
    // Real Madani-mushaf apps achieve true kashida justification with a
    // per-page glyph font (QCF) instead of plain Unicode text.
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
    marginVertical: 2,
  },
  word: {
    fontFamily: 'UthmanicHafs', // see README for font setup
    fontSize: 24,
    lineHeight: 46,
    color: '#EDEDED',
    includeFontPadding: false,
  },
});
