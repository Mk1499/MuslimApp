import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/ui';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppCard,
  AppIcon,
  AppText,
  AppTouchable,
} from '@/components/ui';
import PlayerBar from '../../components/PlayerBar/PlayerBar.comp';
import { RouteProp, useRoute } from '@react-navigation/native';
import { QuranStackParamList } from '@/navigation/stacks/quranStack';
import ScreenNames from '@/navigation/ScreenNames';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import MushafPage from '../../components/MushafPage/MushafPage.comp';
import { useAyahPlayer } from '../../hooks/useAyahPlayer';
import { AYAH_TO_PAGE, getAyahText } from '../../player/ayahSequence';
import { QuranWord } from '@/types/quran';
import { useAppStore } from '@/store/useAppStore';
import { getAyahTafseer, getTafseerCollections } from '@/api/tafseer';
import { getAyahMutashbihat } from '@/api/mutashabihat';
import { useSavedAyahsStore, SavedAyah } from '@/store/useSavedAyahsStore';
import { getSurahByNumber } from '../../player/ayahSequence';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import makeStyles from './styles';

const TOTAL_MUSHAF_PAGES = 604;
const RENDER_WINDOW = 1; // pages on each side of the current page to keep mounted

type SelectedAyah = {
  word: QuranWord;
  page: number;
  text: string;
};
type SheetView = 'actions' | 'tafseer' | 'similar';

/** Clamp a 1-based mushaf page number into the valid [1, TOTAL_MUSHAF_PAGES] range. */
function clampPageNumber(page: number): number {
  return Math.min(Math.max(page, 1), TOTAL_MUSHAF_PAGES);
}

// Isolated + memoized so only the pages whose props actually change re-render.
const PagerItem = React.memo(function PagerItem({
  pageNumber,
  playingAya,
  onWordLongPress,
  isReady,
}: {
  pageNumber: number;
  playingAya: string | null;
  onWordLongPress: (word: QuranWord, page: number, ayahText: string) => void;
  isReady: boolean;
}) {
  if (!isReady) {
    return (
      <View style={pagerStyles.placeholder}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <MushafPage
      pageNumber={pageNumber}
      playingAya={playingAya}
      onWordLongPress={onWordLongPress}
    />
  );
});

export default function MushafScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
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
  const [selectedAyah, setSelectedAyah] = useState<SelectedAyah | null>(null);
  const [sheetView, setSheetView] = useState<SheetView>('actions');
  const ayahActionsSheetRef = useRef<AppBottomSheetRef>(null);
  const bookmarks = useSavedAyahsStore(state => state.bookmarks);
  const favorites = useSavedAyahsStore(state => state.favorites);
  const toggleBookmark = useSavedAyahsStore(state => state.toggleBookmark);
  const toggleFavorite = useSavedAyahsStore(state => state.toggleFavorite);

  const tafseerCollectionsQuery = useQuery({
    queryKey: ['tafseer-collections'],
    queryFn: getTafseerCollections,
    enabled: !!selectedAyah,
  });
  const preferredTafseer =
    tafseerCollectionsQuery.data?.find(
      collection =>
        collection.language === (i18n.language.startsWith('ar') ? 'ar' : 'en'),
    ) ?? tafseerCollectionsQuery.data?.[0];
  const ayahTafseerQuery = useQuery({
    queryKey: [
      'ayah-tafseer',
      selectedAyah?.word.surah_number,
      selectedAyah?.word.ayah_number,
      preferredTafseer?.id,
    ],
    queryFn: () =>
      getAyahTafseer(
        selectedAyah!.word.surah_number,
        selectedAyah!.word.ayah_number,
        preferredTafseer!.id,
      ),
    enabled: sheetView === 'tafseer' && !!selectedAyah && !!preferredTafseer,
  });
  const similarAyahsQuery = useQuery({
    queryKey: [
      'ayah-mutashabihat',
      selectedAyah?.word.surah_number,
      selectedAyah?.word.ayah_number,
    ],
    queryFn: () =>
      getAyahMutashbihat(
        selectedAyah!.word.surah_number,
        selectedAyah!.word.ayah_number,
      ),
    enabled: sheetView === 'similar' && !!selectedAyah,
  });
  const similarVerses =
    similarAyahsQuery.data?.data.verses.flatMap(
      verse => verse.similar_verses,
    ) ?? [];
  const selectedSurah = selectedAyah
    ? getSurahByNumber(selectedAyah.word.surah_number)
    : undefined;

  const handleAyahLongPress = useCallback(
    (word: QuranWord, page: number, text: string) => {
      setSelectedAyah({
        word,
        page,
        text: getAyahText(word.surah_number, word.ayah_number) ?? text,
      });
      setSheetView('actions');
      ayahActionsSheetRef.current?.present();
    },
    [],
  );

  const savedAyahRecord = (selection: SelectedAyah): SavedAyah | null => {
    const surah = getSurahByNumber(selection.word.surah_number);
    if (!surah) return null;
    return {
      key: `${selection.word.surah_number}:${selection.word.ayah_number}`,
      surahNumber: selection.word.surah_number,
      ayahNumber: selection.word.ayah_number,
      page: selection.page,
      arabic: selection.text,
      surahNameArabic: surah.name_arabic ?? '',
      surahNameEnglish: surah.name_english ?? '',
    };
  };

  const playSelectedAyah = () => {
    if (!selectedAyah) return;
    sessionActiveRef.current = true;
    const target = selectedAyah.word;
    ayahActionsSheetRef.current?.dismiss();
    playAyah({
      surah_number: target.surah_number,
      ayah_number: target.ayah_number,
    });
  };

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
        style={pagerStyles.page}
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
                  onWordLongPress={handleAyahLongPress}
                  isReady={isContentReady}
                />
              ) : (
                // برّه النافذة: view فاضي بس، عشان نحافظ على ثبات الـ indices
                <View style={pagerStyles.placeholder} />
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
      <AppBottomSheet
        ref={ayahActionsSheetRef}
        snapPoints={['72%']}
        scrollable
        onDismiss={() => {
          setSelectedAyah(null);
          setSheetView('actions');
        }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <View style={styles.sheetHeading}>
            {sheetView !== 'actions' && (
              <AppTouchable
                variant="ghost"
                onPress={() => setSheetView('actions')}
                accessibilityRole="button"
                accessibilityLabel={t('common.back')}
                style={styles.sheetBackButton}
              >
                <AppIcon
                  name="chevron-back"
                  size={21}
                  color={theme.text.secondary}
                />
              </AppTouchable>
            )}
            <View style={styles.sheetHeadingCopy}>
              <AppText
                variant="subtitle"
                weight="semiBold"
                style={styles.sheetTitle}
              >
                {t(
                  sheetView === 'tafseer'
                    ? 'quran.ayahTafseer'
                    : sheetView === 'similar'
                    ? 'quran.similarAyahs'
                    : 'quran.ayahActions',
                )}
              </AppText>
              {selectedAyah && (
                <AppText variant="caption" style={styles.sheetSubtitle}>
                  {i18n.language.startsWith('ar')
                    ? selectedSurah?.name_arabic
                    : selectedSurah?.name_english}
                  {' · '}
                  {selectedAyah.word.ayah_number}
                </AppText>
              )}
            </View>
          </View>

          {selectedAyah && (
            <AppCard style={styles.selectedAyahCard}>
              <AppText style={styles.selectedAyahText}>
                {selectedAyah.text}
              </AppText>
            </AppCard>
          )}

          {sheetView === 'actions' && selectedAyah ? (
            <View style={styles.actionList}>
              <AyahAction
                icon="play-circle-outline"
                title={t('quran.listenAyah')}
                onPress={playSelectedAyah}
              />
              <AyahAction
                icon="book-outline"
                title={t('quran.ayahTafseer')}
                onPress={() => setSheetView('tafseer')}
              />
              <AyahAction
                icon="git-compare-outline"
                title={t('quran.similarAyahs')}
                onPress={() => setSheetView('similar')}
              />
              {(() => {
                const record = savedAyahRecord(selectedAyah);
                if (!record) return null;
                const isSaved = !!bookmarks[record.key];
                return (
                  <AyahAction
                    icon={isSaved ? 'bookmark' : 'bookmark-outline'}
                    title={t(
                      isSaved ? 'quran.removeBookmark' : 'quran.addBookmark',
                    )}
                    onPress={() => toggleBookmark(record)}
                  />
                );
              })()}
              {(() => {
                const record = savedAyahRecord(selectedAyah);
                if (!record) return null;
                const isSaved = !!favorites[record.key];
                return (
                  <AyahAction
                    icon={isSaved ? 'heart' : 'heart-outline'}
                    title={t(
                      isSaved ? 'quran.removeFavorite' : 'quran.addFavorite',
                    )}
                    onPress={() => toggleFavorite(record)}
                  />
                );
              })()}
            </View>
          ) : null}

          {sheetView === 'tafseer' && (
            <View style={styles.detailContent}>
              {tafseerCollectionsQuery.isLoading ||
              ayahTafseerQuery.isLoading ? (
                <ActivityIndicator color={theme.text.brand} />
              ) : tafseerCollectionsQuery.isError ||
                ayahTafseerQuery.isError ? (
                <AppText style={styles.detailMessage}>
                  {t('quran.ayahDetailError')}
                </AppText>
              ) : ayahTafseerQuery.data?.text ? (
                <AppText style={styles.detailText}>
                  {ayahTafseerQuery.data.text}
                </AppText>
              ) : (
                <AppText style={styles.detailMessage}>
                  {t('quran.noTafseerFound')}
                </AppText>
              )}
            </View>
          )}

          {sheetView === 'similar' && (
            <View style={styles.detailContent}>
              {similarAyahsQuery.isLoading ? (
                <ActivityIndicator color={theme.text.brand} />
              ) : similarAyahsQuery.isError ? (
                <AppText style={styles.detailMessage}>
                  {t('quran.ayahDetailError')}
                </AppText>
              ) : similarVerses.length ? (
                similarVerses.map(verse => (
                  <AppCard
                    key={verse.verse_key}
                    style={styles.similarVerseCard}
                  >
                    <AppText style={styles.detailText}>{verse.arabic}</AppText>
                    <AppText variant="caption" style={styles.similarVerseLabel}>
                      {verse.surah_name_arabic} · {verse.surah_name_english} ·{' '}
                      {verse.ayah}
                    </AppText>
                  </AppCard>
                ))
              ) : (
                <AppText style={styles.detailMessage}>
                  {t('quran.noSimilarAyahs')}
                </AppText>
              )}
            </View>
          )}
        </BottomSheetScrollView>
      </AppBottomSheet>
    </Screen>
  );
}

function AyahAction({
  icon,
  title,
  onPress,
}: {
  icon: React.ComponentProps<typeof AppIcon>['name'];
  title: string;
  onPress: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <AppTouchable
      variant="ghost"
      onPress={onPress}
      style={styles.actionTouchable}
    >
      <AppCard padded={false} style={styles.actionCard}>
        <View style={styles.actionIcon}>
          <AppIcon name={icon} size={21} color={theme.text.brand} />
        </View>
        <AppText variant="body" weight="medium" style={styles.actionText}>
          {title}
        </AppText>
        <AppIcon name="chevron-forward" size={18} color={theme.text.muted} />
      </AppCard>
    </AppTouchable>
  );
}

const pagerStyles = StyleSheet.create({
  page: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
