import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui';
import PlayerBar from '../../components/PlayerBar/PlayerBar.comp';
import { RouteProp, useRoute } from '@react-navigation/native';
import { QuranStackParamList } from '@/navigation/stacks/quranStack';
import ScreenNames from '@/navigation/ScreenNames';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import MushafPage from '../../components/MushafPage/MushafPage.comp';
import { useAyahPlayer } from '../../hooks/useAyahPlayer';
import { AYAH_TO_PAGE } from '../../player/ayahSequence';
import { QuranWord } from '@/types/quran';
import { useAppStore } from '@/store/useAppStore';

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
  const { surah, resumeAyah, initialPage } = params;
  const { pages } = surah ?? {};

  // "Continue" from the home screen's last-read card points at a specific
  // ayah — open on the page that ayah lives on instead of the surah's first
  // page, so the user lands right where they left off.
  const resumePage =
    resumeAyah != null && surah?.number != null
      ? AYAH_TO_PAGE.get(`${surah.number}:${resumeAyah}`)
      : undefined;

  const initialPageNumber = clampPageNumber(
    initialPage ?? resumePage ?? pages?.[0] ?? 1,
  );
  // Unique identity for the surah — two surahs can share a start page (short
  // surahs near the end), so the surah number is the reliable key.
  const surahId = surah?.number ?? initialPageNumber;
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);
  const setLastReadPage = useAppStore(state => state.setLastReadPage);
  const pagerRef = useRef<PagerView>(null);

  // The most recent page (manual or programmatic) — the auto-swipe only moves
  // forward past this.
  const lastAutoPageRef = useRef(initialPageNumber);

  // Only playback started on THIS screen's session may drive the pager. A
  // stale active track inherited from a previous screen/surah must never
  // auto-swipe the newly opened mushaf to the old playing ayah's page.
  const sessionActiveRef = useRef(false);

  // React Navigation keeps this screen mounted and only swaps `params` (same
  // route key), so `useState(initialPageNumber)` would keep the previous
  // surah's page and PagerView would ignore the new `initialPage`. Reset the
  // pager state before committing whenever the surah changes.
  const [prevSurahId, setPrevSurahId] = useState(surahId);
  if (prevSurahId !== surahId) {
    setPrevSurahId(surahId);
    setCurrentPageNumber(initialPageNumber);
    lastAutoPageRef.current = initialPageNumber;
    sessionActiveRef.current = false; // a new surah starts a fresh session
  }

  // The player lives here (not inside a page) so it survives page swipes and
  // can drive the auto-swipe below.
  const { playAyah, stop, togglePlay, playingAya, isPlaying } = useAyahPlayer();

  // Mark the session as owned by this screen when the user starts playback.
  const handleWordPress = useCallback(
    (word: QuranWord) => {
      sessionActiveRef.current = true;
      playAyah(word);
    },
    [playAyah],
  );

  // Opening a different surah leaves the old recitation behind — stop it.
  const stopOnSurahChangeRef = useRef(surahId);
  useEffect(() => {
    if (stopOnSurahChangeRef.current !== surahId) {
      stopOnSurahChangeRef.current = surahId;
      stop();
    }
  }, [surahId, stop]);

  useEffect(() => {
    setLastReadPage(initialPageNumber);
  }, [initialPageNumber, setLastReadPage, surahId]);

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

  // Start playback of the ayah we were asked to open on (Continue from the
  // home screen). Keyed on the target so a params update pointing at a
  // different ayah replays, while the same target only ever plays once.
  const resumePlayedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isContentReady || surah?.number == null || resumeAyah == null) {
      return;
    }
    const key = `${surah.number}:${resumeAyah}`;
    if (resumePlayedKeyRef.current === key) {
      return;
    }
    resumePlayedKeyRef.current = key;
    // Own the pager session so the auto-swipe follows this resumption.
    sessionActiveRef.current = true;
    playAyah({ surah_number: surah.number, ayah_number: resumeAyah });
  }, [isContentReady, surah?.number, resumeAyah, playAyah]);

  const allPageNumbers = useMemo(
    () => Array.from({ length: TOTAL_MUSHAF_PAGES }, (_, i) => i + 1),
    [],
  );

  const handlePageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const page = event.nativeEvent.position + 1;
      setCurrentPageNumber(page);
      setLastReadPage(page);
      // Treat any page change (manual or programmatic) as the baseline so the
      // auto-swipe only ever moves forward past the latest page.
      lastAutoPageRef.current = page;
    },
    [setLastReadPage],
  );

  // Auto-swipe forward whenever playback moves onto a new page.
  const playingPage = playingAya ? AYAH_TO_PAGE.get(playingAya) : undefined;

  useEffect(() => {
    if (!sessionActiveRef.current) {
      return;
    }
    if (!playingPage || playingPage <= lastAutoPageRef.current) {
      return;
    }
    lastAutoPageRef.current = playingPage;
    pagerRef.current?.setPage(playingPage - 1);
    setCurrentPageNumber(playingPage);
    setLastReadPage(playingPage);
  }, [playingPage, setLastReadPage]);

  return (
    <Screen isInnerPage>
      <PagerView
        key={surahId}
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
                  onWordPress={handleWordPress}
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

      <PlayerBar
        playingAya={playingAya}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onStop={stop}
      />
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
});
