import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { QuranWord } from '@/types/quran';
import { fontFamily, useTheme } from '@/theme';

interface Props {
  words: QuranWord[];
  onWordLongPress?: (word: QuranWord) => void;
  /** Full "surah:ayah" key of the pressed word — unique across surahs. */
  selectedKey?: string | null;
  /** Full "surah:ayah" key of the currently playing ayah — unique across surahs. */
  playingKey?: string | null;
}

export default function MushafLine({
  words,
  onWordLongPress,
  selectedKey,
  playingKey,
}: Props) {
  const theme = useTheme();

  return (
    <Text
      style={[styles.word, { color: theme.text.primary }]}
      adjustsFontSizeToFit
      numberOfLines={1}
    >
      {words.map((w, idx) => {
        // Key on the full surah:ayah pair so ayahs that share an ayah number
        // across different surahs never highlight each other.
        const wordKey = `${w.surah_number}:${w.ayah_number}`;
        const ayahHighlight = [
          ...(playingKey === wordKey ? [{ color: theme.text.highlight }] : []),
          ...(selectedKey === wordKey ? [{ color: theme.text.brand }] : []),
        ];
        if (w.char_type_name === 'end') {
          return (
            <Text
              key={`${wordKey}-${idx}`}
              style={[
                styles.ayahEnd,
                { color: theme.accent.secondary },
                ...ayahHighlight,
              ]}
              onLongPress={() => onWordLongPress?.(w)}
            >
              {w.text_uthmani + ' '}
            </Text>
          );
        }
        return (
          <Text
            key={`${wordKey}-${idx}`}
            style={[styles.word, ...ayahHighlight]}
            onLongPress={() => onWordLongPress?.(w)}
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
    fontSize: 30,
    textAlign: 'center', // Arabic reads right-to-left
  },
  ayahEnd: {
    fontFamily: fontFamily.uthmani,
    fontSize: 38,
    includeFontPadding: false,
  },
});
