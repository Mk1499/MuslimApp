import { AppText } from '@/components/ui';
import useFormatter from '@/hooks/useFormatter';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PageFooter({ pageNumber }: { pageNumber: number }) {
  const { toArabicIndic } = useFormatter();

  return (
    <View style={styles.row}>
      <View style={styles.pageBadge}>
        <AppText style={styles.pageNum}>{toArabicIndic(pageNumber)}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#EDEDED',
  },
  pageBadge: {
    width: 35,
    height: 35,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C9A24B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNum: {
    fontSize: 12,
    textAlign: 'center',
  },
});
