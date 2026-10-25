import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme';
import React from 'react';
import useMediaData from '@/hooks/queries/useMediaData';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function LatestVideosView({ speakerId }: { speakerId: string }) {
  const theme = useTheme();
  const { useSpeakerLatestVideosQuery } = useMediaData();
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSpeakerLatestVideosQuery(speakerId);

  const { pages } = videosData || {};
  const allVideos = pages?.flatMap(page => page?.data) || [];

  return (
    <Animated.FlatList
      entering={FadeIn}
      exiting={FadeOut}
      data={allVideos}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <VideoCard video={item} />}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size={40} color={theme.text.brand} />
        ) : (
          <></>
        )
      }
      ItemSeparatorComponent={<View style={{ height: 10 }} />}
    />
  );
}
