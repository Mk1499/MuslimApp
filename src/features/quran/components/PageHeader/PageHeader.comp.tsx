import useFormatter from '@/hooks/useFormatter';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PageHeader({
  juzNumber,
  surahName,
}: {
  juzNumber: number;
  surahName: string;
}) {
  const { toArabicIndic } = useFormatter();

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{`الجزء ${toArabicIndic(juzNumber)}`}</Text>
      <Text style={styles.label}>{surahName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  label: {
    fontFamily: 'UthmanicHafs',
    fontSize: 16,
    color: '#EDEDED',
  },
});
