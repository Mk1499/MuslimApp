import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, SectionList, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import useMediaData from '@/hooks/queries/useMediaData';
import { useTheme } from '@/theme';

export default function PopularVideosView({
  speakerId,
  ListHeaderComponent,
  StickyHeaderComponent,
}: {
  speakerId: string;
  ListHeaderComponent: React.ReactElement;
  StickyHeaderComponent: React.ReactElement;
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
  const allVideos = videosData?.pages.flatMap(page => page.data) ?? [];

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
    <View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
      <SectionList
        sections={[{ title: 'videos', data: allVideos }]}
        style={{ flex: 1 }}
        ListHeaderComponent={ListHeaderComponent}
        renderSectionHeader={() => StickyHeaderComponent}
        stickySectionHeadersEnabled
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <VideoCard video={item} />
          </View>
        )}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y > 0) hasScrolled.current = true;
        }}
        scrollEventThrottle={16}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.25}
        ListEmptyComponent={
          isLoading ? <ActivityIndicator color={theme.text.brand} /> : undefined
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size={40} color={theme.text.brand} />
          ) : undefined
        }
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}
