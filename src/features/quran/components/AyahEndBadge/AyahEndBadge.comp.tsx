import { fontFamily } from '@/theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function toArabicIndic(num: number): string {
  return String(num)
    .split('')
    .map(d => ARABIC_INDIC_DIGITS[parseInt(d, 10)])
    .join('');
}

export default function AyahEndBadge({ ayahNumber }: { ayahNumber: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{`${toArabicIndic(ayahNumber)}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  badgeText: {
    fontSize: 34,
    color: '#C9A24B',
    fontFamily: fontFamily.uthmani, // see README for font setup
  },
});
