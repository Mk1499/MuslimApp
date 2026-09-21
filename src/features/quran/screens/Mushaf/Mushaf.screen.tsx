import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen } from '@/components/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { QuranStackParamList } from '@/navigation/stacks/quranStack';
import MushafPage from '../../components/MushafPage/MushafPage.comp';

export default function MushafScreen() {
  const { params } =
    useRoute<RouteProp<QuranStackParamList, ScreenNames.Mushaf>>();
  const { surah } = params;
  const { pages } = surah ?? {};
  const pageNumber = pages?.[0] ?? 1;

  // Derive current surah name/juz from the first "word"-type entry on the page.

  return (
    <Screen style={styles.page} isInnerPage>
      <MushafPage pageNumber={pageNumber} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
