import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/ui';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import useMediaData from '@/api/queries/useMediaData';
import { MediaStackParamList } from '@/navigation/stacks/mediaStack';
import ScreenNames from '@/navigation/ScreenNames';
import { useTheme } from '@/theme';

export default function PlaylistDetails() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<MediaStackParamList, ScreenNames.PlaylistDetails>>();
  const { usePlaylistQuery } = useMediaData();
  const { data, isLoading, isError } = usePlaylistQuery(params.playlistId);
  const playlist = data?.data;
  const { videos, description, title, speakers } = playlist ?? {};

  return (
    <Screen
      isInnerPage
      scroll
      withBottomSafeArea={false}
      padded
      isLoading={isLoading}
    >
      <AppText variant="title">{title}</AppText>
      {!!description && (
        <AppText
          variant="caption"
          style={{ color: theme.text.muted, marginTop: 8, marginBottom: 20 }}
          numberOfLines={3}
        >
          {description}
        </AppText>
      )}
      <AppText
        variant="subtitle"
        style={{ marginVertical: 12, color: theme.text.brand }}
      >
        {t('media.playlistVideos')}
      </AppText>
      {(videos ?? []).map(video => (
        <View key={video._id} style={{ marginBottom: 16 }}>
          <VideoCard video={video} speakers={speakers} />
        </View>
      ))}
    </Screen>
  );
}
