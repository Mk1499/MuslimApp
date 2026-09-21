import { AppIcon, AppText } from '@/components/ui';
import useFormatter from '@/hooks/useFormatter';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function PageHeader({
  juzNumber,
  surahName,
}: {
  juzNumber: number;
  surahName: string;
}) {
  const { toArabicIndic } = useFormatter();
  const { goBack } = useNavigation();

  return (
    <View style={styles.row}>
      <AppText style={styles.label}>{`الجزء ${toArabicIndic(
        juzNumber,
      )}`}</AppText>
      <View style={[styles.row, { gap: 10 }]}>
        <AppText style={styles.label}>{surahName}</AppText>
        <Pressable onPress={goBack}>
          <AppIcon name="chevron-back" size={24} color="#EDEDED" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#EDEDED',
  },
});
