import { View, Text } from 'react-native';
import YTPlayer from '@/features/media/components/YTPlayer/YTPlayer.comp';
import React, { useEffect } from 'react';
import { AppText, Screen } from '@/components/ui';
import useMediaData from '@/hooks/queries/useMediaData';

export default function MediaDashboardScreen() {
  const { useGetLatestVideosQuery } = useMediaData();
  const { data: latestVideos, isLoading, error } = useGetLatestVideosQuery();

  console.log({ latestVideos });

  return (
    <Screen padded scroll isLoading={isLoading}>
      {latestVideos?.data?.map(video => (
        <View key={video._id}>
          <YTPlayer videoId={video.youtubeVideoId} />
        </View>
      ))}
      {error && <AppText>Error loading videos</AppText>}
    </Screen>
  );
}
