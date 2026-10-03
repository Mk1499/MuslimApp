import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { QuranWord } from '@/types/quran';
import { fontFamily, useTheme } from '@/theme';

interface Props {
  words: QuranWord[];
  onWordPress?: (word: QuranWord) => void;
}

export default function MushafLine({ words, onWordPress }: Props) {
  const theme = useTheme();

  return (
    <Text
      style={[styles.word, { color: theme.text.primary }]}
      adjustsFontSizeToFit
      numberOfLines={1}
    >
      {words.map((w, idx) => {
        if (w.char_type_name === 'end') {
          return (
            <Text
              key={`${w.surah_number}-${w.ayah_number}-${idx}`}
              style={[styles.ayahEnd, { color: theme.accent.secondary }]}
            >
              {w.text_uthmani + ' '}
            </Text>
          );
        }
        return w.text_uthmani + ' ';
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  lineRow: {
    flexDirection: 'row', // Arabic reads right-to-left
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
  },
  word: {
    fontFamily: fontFamily.hafs, // see README for font setup
    fontSize: 28,
    textAlign: 'center', // Arabic reads right-to-left
  },
  ayahEnd: {
    fontFamily: fontFamily.uthmani,
    fontSize: 28,
    includeFontPadding: false,
  },
});
