import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/ui';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';
import SpeakerCardLarge from '@/features/media/components/SpeakerCardLarge/SpeakerCardLarge.comp';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import useMediaData from '@/hooks/queries/useMediaData';
import ScreenNames from '@/navigation/ScreenNames';
import { MediaStackParamList } from '@/navigation/stacks/mediaStack';
import { useTheme } from '@/theme';
import makeStyles from './styles';

export default function MediaSearchResults() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { params } =
    useRoute<RouteProp<MediaStackParamList, ScreenNames.MediaSearchResults>>();
  const navigation =
    useNavigation<
      NavigationProp<MediaStackParamList, ScreenNames.MediaSearchResults>
    >();
  const initialQuery = params.query.trim();
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const { useSearchSpeakers, useSearchVideos } = useMediaData();

  const {
    data: speakersData,
    isLoading: isSpeakersLoading,
    isError: isSpeakersError,
    refetch: refetchSpeakers,
    fetchNextPage: fetchNextSpeakerPage,
    hasNextPage: hasNextSpeakerPage,
    isFetchingNextPage: isFetchingNextSpeakerPage,
  } = useSearchSpeakers(activeQuery);
  const {
    data: videosData,
    isLoading: isVideosLoading,
    isError: isVideosError,
    refetch: refetchVideos,
    fetchNextPage: fetchNextVideoPage,
    hasNextPage: hasNextVideoPage,
    isFetchingNextPage: isFetchingNextVideoPage,
    isRefetching: isVideosRefetching,
  } = useSearchVideos(activeQuery);

  const speakerHasScrolled = useRef(false);
  const speakerRequestInFlight = useRef(false);
  const videoHasScrolled = useRef(false);
  const videoRequestInFlight = useRef(false);

  const speakers = speakersData?.pages.flatMap(page => page.data ?? []) ?? [];
  const videos = videosData?.pages.flatMap(page => page.data ?? []) ?? [];

  useEffect(() => {
    if (!activeQuery) return;
    videoHasScrolled.current = false;
    speakerHasScrolled.current = false;
    void refetchSpeakers();
    void refetchVideos();
  }, [activeQuery, refetchSpeakers, refetchVideos]);

  useEffect(() => {
    const query = params.query.trim();
    setSearchInput(query);
    setActiveQuery(query);
  }, [params.query]);

  const submitSearch = useCallback(() => {
    const query = searchInput.trim();
    if (!query) return;
    if (query === activeQuery) {
      videoHasScrolled.current = false;
      speakerHasScrolled.current = false;
      void refetchSpeakers();
      void refetchVideos();
      return;
    }
    navigation.setParams({ query });
    setActiveQuery(query);
  }, [activeQuery, navigation, refetchSpeakers, refetchVideos, searchInput]);

  const loadNextSpeakers = useCallback(() => {
    if (
      !speakerHasScrolled.current ||
      !hasNextSpeakerPage ||
      isFetchingNextSpeakerPage ||
      speakerRequestInFlight.current
    ) {
      return;
    }
    speakerRequestInFlight.current = true;
    fetchNextSpeakerPage().finally(() => {
      speakerRequestInFlight.current = false;
    });
  }, [fetchNextSpeakerPage, hasNextSpeakerPage, isFetchingNextSpeakerPage]);

  const loadNextVideos = useCallback(() => {
    if (
      !videoHasScrolled.current ||
      !hasNextVideoPage ||
      isFetchingNextVideoPage ||
      videoRequestInFlight.current
    ) {
      return;
    }
    videoRequestInFlight.current = true;
    fetchNextVideoPage().finally(() => {
      videoRequestInFlight.current = false;
    });
  }, [fetchNextVideoPage, hasNextVideoPage, isFetchingNextVideoPage]);

  const resultHeader = (
    <View style={styles.resultsHeader}>
      <AppText variant="caption" style={styles.queryLabel}>
        {t('media.searchResultsFor', { query: activeQuery })}
      </AppText>
      <View style={styles.speakersSection}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          {t('media.speakers')}
        </AppText>
        {speakers.length > 0 ? (
          <FlatList
            horizontal
            data={speakers}
            keyExtractor={speaker => speaker._id}
            renderItem={({ item }) => (
              <View style={styles.speakerCard}>
                <SpeakerCardLarge speaker={item} />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            onScroll={event => {
              if (event.nativeEvent.contentOffset.x > 0) {
                speakerHasScrolled.current = true;
              }
            }}
            scrollEventThrottle={16}
            onEndReached={loadNextSpeakers}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetchingNextSpeakerPage ? (
                <ActivityIndicator color={theme.text.brand} />
              ) : undefined
            }
          />
        ) : (
          <View style={styles.speakerEmptyState}>
            {isSpeakersLoading ? (
              <ActivityIndicator color={theme.text.brand} />
            ) : (
              <AppText style={styles.emptyText}>
                {isSpeakersError
                  ? t('media.searchError')
                  : t('media.noSpeakersFound')}
              </AppText>
            )}
          </View>
        )}
      </View>
      <AppText variant="subtitle" style={styles.sectionTitle}>
        {t('media.videos')}
      </AppText>
    </View>
  );

  return (
    <Screen
      isInnerPage
      screenTitle={t('media.searchResults')}
      scroll={false}
      withBottomSafeArea={false}
    >
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder={t('media.searchPlaceholder')}
          onClear={() => setSearchInput('')}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
        />
      </View>
      <FlatList
        data={videos}
        style={styles.videoList}
        keyExtractor={video => video._id}
        renderItem={({ item }) => (
          <View style={styles.videoCard}>
            <VideoCard video={item} />
          </View>
        )}
        ListHeaderComponent={resultHeader}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y > 0) {
            videoHasScrolled.current = true;
          }
        }}
        scrollEventThrottle={16}
        onEndReached={loadNextVideos}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={isVideosRefetching}
            colors={[theme.background.brand]}
            onRefresh={() => {
              videoHasScrolled.current = false;
              speakerHasScrolled.current = false;
              void refetchSpeakers();
              void refetchVideos();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isVideosLoading ? (
              <ActivityIndicator color={theme.text.brand} />
            ) : (
              <AppText style={styles.emptyText}>
                {isVideosError
                  ? t('media.searchError')
                  : speakers.length > 0
                  ? t('media.noVideosFound')
                  : t('media.noSearchResults')}
              </AppText>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextVideoPage ? (
            <ActivityIndicator
              size={36}
              color={theme.text.brand}
              style={styles.footerLoader}
            />
          ) : undefined
        }
      />
    </Screen>
  );
}
