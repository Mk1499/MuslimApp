import { View } from 'react-native';
import React from 'react';

import makeStyle from './styles';
import { AppGradient, AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export default function LastReadSurahComp() {
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <AppGradient
      colors={[theme.basic.white, theme.gradient.hero[0]]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
    >
      <View style={styles.dataCont}>
        <AppText variant="subtitle" style={styles.title}>
          Last Read
        </AppText>
        <AppText variant="title" style={styles.surahName}>
          Al Fatiha
        </AppText>
        <AppText style={styles.ayah}>Ayah : 1</AppText>
      </View>
    </AppGradient>
  );
}
