import { View, Text, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import useMediaData from '@/api/queries/useMediaData';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui';
import VideoCard from '../../components/VideoCard/VideoCard.comp';
import EmptyList from '@/components/common/EmptyList/EmptyList.comp';
import { EVENTS, useAnalytics } from '@/hooks/useAnalytics';

export default function LatestVideos() {
  const { t } = useTranslation();
  const { useLatestVideosQuery } = useMediaData();
  const { data, isLoading, isError, hasNextPage, fetchNextPage, error } =
    useLatestVideosQuery();

  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (isError) {
      trackEvent(
        EVENTS.Get_LATEST_VIDEOS_ERROR,
        { error: error?.message ?? 'Unknown error' },
        true,
        t('appMessages.error'),
      );
    }
  }, [isError]);

  return (
    <Screen
      isInnerPage
      screenTitle={t('media.latestVideos')}
      isLoading={isLoading}
      padded
    >
      <FlatList
        data={data?.pages.flatMap(page => page.data) ?? []}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <VideoCard video={item} />
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!isLoading ? <EmptyList /> : undefined}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
