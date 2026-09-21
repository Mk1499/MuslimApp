import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuranWord } from '@/types/quran';
import AyahEndBadge from '@/features/quran/components/AyahEndBadge/AyahEndBadge.comp';
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
      {/* {w.text_uthmani} */}
      {words.map((w, idx) => {
        if (w.char_type_name === 'end') {
          return (
            <Text
              style={{
                fontFamily: fontFamily.uthmani,
                fontSize: 28,
                color: theme.accent.secondary,
                includeFontPadding: false,
              }}
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
});
