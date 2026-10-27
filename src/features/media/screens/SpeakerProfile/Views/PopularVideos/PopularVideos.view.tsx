import { View, Text, ActivityIndicator } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { useTheme } from '@/theme';
import useMediaData from '@/hooks/queries/useMediaData';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function PopularVideosView({
  speakerId,
  ListHeaderComponent,
}: {
  speakerId: string;
  ListHeaderComponent: React.ReactElement;
}) {
  const theme = useTheme();
  const { useSpeakerTopVideosQuery } = useMediaData();
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSpeakerTopVideosQuery(speakerId);
  const hasScrolled = useRef(false);
  const requestInFlight = useRef(false);

  const { pages } = videosData || {};
  const allVideos = pages?.flatMap(page => page?.data) || [];

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

  return (
    <Animated.FlatList
      entering={FadeIn}
      exiting={FadeOut}
      data={allVideos}
      style={{ flex: 1 }}
      ListHeaderComponent={ListHeaderComponent}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <VideoCard video={item} />}
      onScroll={event => {
        if (event.nativeEvent.contentOffset.y > 0) hasScrolled.current = true;
      }}
      scrollEventThrottle={16}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.25}
      ListEmptyComponent={isLoading ? <ActivityIndicator color={theme.text.brand} /> : undefined}
      ListFooterComponent={
        isFetchingNextPage ? <Text>Loading more...</Text> : <></>
      }
      ItemSeparatorComponent={<View style={{ height: 10 }} />}
    />
  );
}
