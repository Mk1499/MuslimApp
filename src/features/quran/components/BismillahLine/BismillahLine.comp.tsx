import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function BismillahLine() {
  return (
    <Text style={styles.text}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'UthmanicHafs',
    fontSize: 26,
    textAlign: 'center',
    color: '#EDEDED',
    marginVertical: 10,
  },
});
