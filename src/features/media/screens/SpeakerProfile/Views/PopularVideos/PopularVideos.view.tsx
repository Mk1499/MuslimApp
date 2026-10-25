import { View, Text, FlatList } from 'react-native';
import React from 'react';
import useMediaData from '@/hooks/queries/useMediaData';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function PopularVideosView({
  speakerId,
}: {
  speakerId: string;
}) {
  const { useSpeakerTopVideosQuery } = useMediaData();
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSpeakerTopVideosQuery(speakerId);

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
        isFetchingNextPage ? <Text>Loading more...</Text> : <></>
      }
      ItemSeparatorComponent={<View style={{ height: 10 }} />}
    />
  );
}
