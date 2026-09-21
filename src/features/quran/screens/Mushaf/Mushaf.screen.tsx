import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { QuranStackParamList } from '@/navigation/stacks/quranStack';
import ScreenNames from '@/navigation/screenNames'; // adjust to your actual path
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import MushafPage from '../../components/MushafPage/MushafPage.comp';

const TOTAL_MUSHAF_PAGES = 604;
const RENDER_WINDOW = 1; // pages on each side of the current page to keep mounted

/** Clamp a 1-based mushaf page number into the valid [1, TOTAL_MUSHAF_PAGES] range. */
function clampPageNumber(page: number): number {
  return Math.min(Math.max(page, 1), TOTAL_MUSHAF_PAGES);
}

export default function MushafScreen() {
  const { params } =
    useRoute<RouteProp<QuranStackParamList, ScreenNames.Mushaf>>();
  const { surah } = params;
  const { pages } = surah ?? {};

  // Mushaf pages are 1-based; PagerView positions are 0-based.
  const initialPageNumber = clampPageNumber(pages?.[0] ?? 1);
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);

  const allPageNumbers = useMemo(
    () => Array.from({ length: TOTAL_MUSHAF_PAGES }, (_, i) => i + 1),
    [],
  );

  const handlePageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      // event.nativeEvent.position is 0-based -> convert back to 1-based page number
      setCurrentPageNumber(event.nativeEvent.position + 1);
    },
    [],
  );

  return (
    <Screen isInnerPage>
      <PagerView
        style={styles.page}
        pageMargin={16}
        initialPage={initialPageNumber - 1}
        onPageSelected={handlePageSelected}
        testID="mushaf-pager"
      >
        {allPageNumbers.map(pageNumber => {
          const isNearCurrentPage =
            Math.abs(pageNumber - currentPageNumber) <= RENDER_WINDOW;

          return (
            <View key={pageNumber} collapsable={false}>
              {isNearCurrentPage ? (
                <MushafPage pageNumber={pageNumber} />
              ) : (
                // Cheap placeholder keeps PagerView's child indices stable
                // without paying to mount every real page up front.
                <View style={styles.placeholder} />
              )}
            </View>
          );
        })}
      </PagerView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
});
