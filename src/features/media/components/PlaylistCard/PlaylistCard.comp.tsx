import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppCard, AppIcon, AppText } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';
import ScreenNames from '@/navigation/ScreenNames';
import StackNames from '@/navigation/StackNames';
import { VideoPlaylist } from '@/types/media.types';
import useFormatter from '@/hooks/useFormatter';
import { useTheme } from '@/theme';
import { isRTL } from '@/utils/constants';

export default function PlaylistCard({
  playlist,
}: {
  playlist: VideoPlaylist;
}) {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { getLocalizedText } = useFormatter();
  const title =
    getLocalizedText(playlist.titleAr, playlist.titleEn) || playlist.title;
  const firstVideo = playlist.videos?.[0];
  const cover =
    playlist.cover ||
    (firstVideo?.youtubeVideoId
      ? `https://img.youtube.com/vi/${firstVideo.youtubeVideoId}/hqdefault.jpg`
      : undefined);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        navigation.navigate(StackNames.MediaStack, {
          screen: ScreenNames.PlaylistDetails,
          params: { playlistId: playlist._id, playlist },
        })
      }
    >
      <AppCard style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppImage
          source={{ uri: cover }}
          style={{ width: 92, height: 72, borderRadius: 8 }}
        />
        <View style={{ flex: 1, gap: 6 }}>
          <AppText variant="subtitle" numberOfLines={2}>
            {title}
          </AppText>
          <AppText variant="caption" style={{ color: theme.text.muted }}>
            {`${playlist.videos?.length ?? 0} ${
              playlist.videos?.length === 1 ? 'video' : 'videos'
            }`}
          </AppText>
        </View>
        <AppIcon
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={theme.text.muted}
        />
      </AppCard>
    </Pressable>
  );
}
