import useFormatter from '@/hooks/useFormatter';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PageFooter({
  hizbLabel,
  pageNumber,
}: {
  hizbLabel: string;
  pageNumber: number;
}) {
  const { toArabicIndic } = useFormatter();

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{hizbLabel}</Text>
      <View style={styles.pageBadge}>
        <Text style={styles.pageNum}>{toArabicIndic(pageNumber)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  label: {
    fontFamily: 'UthmanicHafs',
    fontSize: 14,
    color: '#EDEDED',
  },
  pageBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C9A24B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNum: {
    color: '#C9A24B',
    fontSize: 12,
  },
});
