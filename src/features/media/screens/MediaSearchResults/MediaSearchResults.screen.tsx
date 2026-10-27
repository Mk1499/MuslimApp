import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/ui';
import SpeakerCard from '@/features/media/components/SpeakerCard/SpeakerCard.comp';
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
  const query = params.query.trim();
  const { useMediaSearchQuery } = useMediaData();
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMediaSearchQuery(query);
  const hasScrolled = useRef(false);
  const requestInFlight = useRef(false);
  const pages = data?.pages ?? [];
  const speakers = pages.flatMap(page => page.data.speakers ?? []);
  const videos = pages.flatMap(page => page.data.videos ?? []);

  const loadNextPage = useCallback(() => {
    if (
      !hasScrolled.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      requestInFlight.current
    ) {
      return;
    }

    requestInFlight.current = true;
    fetchNextPage().finally(() => {
      requestInFlight.current = false;
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const resultsHeader = (
    <View style={styles.resultsHeader}>
      <AppText variant="caption" style={styles.queryLabel}>
        {t('media.searchResultsFor', { query })}
      </AppText>
      {speakers.length > 0 && (
        <View style={styles.speakersSection}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            {t('media.speakers')}
          </AppText>
          <FlatList
            horizontal
            data={speakers}
            keyExtractor={speaker => speaker._id}
            renderItem={({ item }) => (
              <View style={styles.speakerCard}>
                <SpeakerCard speaker={item} />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
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
      <FlatList
        data={videos}
        style={styles.videoList}
        keyExtractor={video => video._id}
        renderItem={({ item }) => (
          <View style={styles.videoCard}>
            <VideoCard video={item} />
          </View>
        )}
        ListHeaderComponent={resultsHeader}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y > 0) hasScrolled.current = true;
        }}
        scrollEventThrottle={16}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            colors={[theme.background.brand]}
            onRefresh={() => {
              hasScrolled.current = false;
              refetch();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator color={theme.text.brand} />
            ) : (
              <AppText style={styles.emptyText}>
                {isError
                  ? t('media.searchError')
                  : speakers.length > 0
                  ? t('media.noVideosFound')
                  : t('media.noSearchResults')}
              </AppText>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
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
