import { View, Text, FlatList } from 'react-native';
import YTPlayer from '@/features/media/components/YTPlayer/YTPlayer.comp';
import React, { useEffect } from 'react';
import { AppText, Screen } from '@/components/ui';
import useMediaData from '@/hooks/queries/useMediaData';
import VideoCard from '../../components/VideoCard/VideoCard.comp';

export default function MediaDashboardScreen() {
  const { useGetLatestVideosQuery } = useMediaData();
  const { data: latestVideos, isLoading, error } = useGetLatestVideosQuery();

  return (
    <Screen padded scroll isLoading={isLoading}>
      <FlatList
        data={latestVideos?.data}
        keyExtractor={video => video._id}
        renderItem={({ item: video }) => <VideoCard video={video} />}
      />
      {error && <AppText>Error loading videos</AppText>}
    </Screen>
  );
}
