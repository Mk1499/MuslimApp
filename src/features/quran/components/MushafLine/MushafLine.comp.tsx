import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { QuranWord } from '@/types/quran';
import { fontFamily, useTheme } from '@/theme';

interface Props {
  words: QuranWord[];
  onWordPress?: (word: QuranWord) => void;
  selectedWordAya?: number | null;
}

export default function MushafLine({
  words,
  onWordPress,
  selectedWordAya,
}: Props) {
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
              style={[
                styles.ayahEnd,
                { color: theme.accent.secondary },
                selectedWordAya === w.ayah_number && styles.selectedWordAya,
              ]}
              onLongPress={() => onWordPress?.(w)}
            >
              {w.text_uthmani + ' '}
            </Text>
          );
        }
        return (
          <Text
            key={`${w.surah_number}-${w.ayah_number}-${idx}`}
            style={[
              styles.word,
              selectedWordAya === w.ayah_number && styles.selectedWordAya,
            ]}
            onLongPress={() => onWordPress?.(w)}
          >
            {w.text_uthmani + ' '}
          </Text>
        );
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
    fontSize: 38,
    textAlign: 'center', // Arabic reads right-to-left
  },
  ayahEnd: {
    fontFamily: fontFamily.uthmani,
    fontSize: 38,
    includeFontPadding: false,
  },
  selectedWordAya: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
