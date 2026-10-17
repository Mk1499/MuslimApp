import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen, AppTouchable, AppIcon } from '@/components/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { QuranStackParamList } from '@/navigation/stacks/quranStack';
import ScreenNames from '@/navigation/screenNames'; // adjust to your actual path
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import MushafPage from '../../components/MushafPage/MushafPage.comp';
import { useAyahPlayer } from '../../hooks/useAyahPlayer';
import { AYAH_TO_PAGE } from '../../player/ayahSequence';
import { QuranWord } from '@/types/quran';

const TOTAL_MUSHAF_PAGES = 604;
const RENDER_WINDOW = 1; // pages on each side of the current page to keep mounted

/** Clamp a 1-based mushaf page number into the valid [1, TOTAL_MUSHAF_PAGES] range. */
function clampPageNumber(page: number): number {
  return Math.min(Math.max(page, 1), TOTAL_MUSHAF_PAGES);
}

// Isolated + memoized so only the pages whose props actually change re-render.
const PagerItem = React.memo(function PagerItem({
  pageNumber,
  playingAya,
  onWordPress,
  isReady,
}: {
  pageNumber: number;
  playingAya: string | null;
  onWordPress: (word: QuranWord) => void;
  isReady: boolean;
}) {
  if (!isReady) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <MushafPage
      pageNumber={pageNumber}
      playingAya={playingAya}
      onWordPress={onWordPress}
    />
  );
});

export default function MushafScreen() {
  const { params } =
    useRoute<RouteProp<QuranStackParamList, typeof ScreenNames.Mushaf>>();
  const { surah } = params;
  const { pages } = surah ?? {};

  const initialPageNumber = clampPageNumber(pages?.[0] ?? 1);
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);
  const pagerRef = useRef<PagerView>(null);

  // The most recent page (manual or programmatic) — the auto-swipe only moves
  // forward past this.
  const lastAutoPageRef = useRef(initialPageNumber);

  // The player lives here (not inside a page) so it survives page swipes and
  // can drive the auto-swipe below.
  const { playAyah, stop, playingAya } = useAyahPlayer();

  // false لحد ما الـ screen transition/animations تخلص خالص
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsContentReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) {
        cancelAnimationFrame(raf2);
      }
    };
  }, []);

  const allPageNumbers = useMemo(
    () => Array.from({ length: TOTAL_MUSHAF_PAGES }, (_, i) => i + 1),
    [],
  );

  const handlePageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const page = event.nativeEvent.position + 1;
      setCurrentPageNumber(page);
      // Treat any page change (manual or programmatic) as the baseline so the
      // auto-swipe only ever moves forward past the latest page.
      lastAutoPageRef.current = page;
    },
    [],
  );

  // Auto-swipe forward whenever playback moves onto a new page.
  const playingPage = playingAya ? AYAH_TO_PAGE.get(playingAya) : undefined;

  useEffect(() => {
    if (!playingPage || playingPage <= lastAutoPageRef.current) {
      return;
    }
    lastAutoPageRef.current = playingPage;
    pagerRef.current?.setPage(playingPage - 1);
    setCurrentPageNumber(playingPage);
  }, [playingPage]);

  return (
    <Screen isInnerPage>
      <PagerView
        ref={pagerRef}
        style={styles.page}
        pageMargin={16}
        initialPage={initialPageNumber - 1}
        onPageSelected={handlePageSelected}
        testID="mushaf-pager"
        layoutDirection={'rtl'}
      >
        {allPageNumbers.map(pageNumber => {
          const isNearCurrentPage =
            Math.abs(pageNumber - currentPageNumber) <= RENDER_WINDOW;

          return (
            <View key={pageNumber} collapsable={false}>
              {isNearCurrentPage ? (
                <PagerItem
                  pageNumber={pageNumber}
                  playingAya={playingAya}
                  onWordPress={playAyah}
                  isReady={isContentReady}
                />
              ) : (
                // برّه النافذة: view فاضي بس، عشان نحافظ على ثبات الـ indices
                <View style={styles.placeholder} />
              )}
            </View>
          );
        })}
      </PagerView>

      {playingAya && (
        <AppTouchable
          variant="primary"
          onPress={() => stop().catch(() => {})}
          style={styles.stopButton}
          accessibilityLabel="Stop recitation"
        >
          <AppIcon name="stop" size={22} color="text.inverse" />
        </AppTouchable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
