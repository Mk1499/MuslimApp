import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, SectionList, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import PlaylistCard from '@/features/media/components/PlaylistCard/PlaylistCard.comp';
import useMediaData from '@/api/queries/useMediaData';
import { useTheme } from '@/theme';
import { AppText } from '@/components/ui';
import { useTranslation } from 'react-i18next';

export default function PlaylistsView({ speakerId, ListHeaderComponent, StickyHeaderComponent }: {
  speakerId: string;
  ListHeaderComponent: React.ReactElement;
  StickyHeaderComponent: React.ReactElement;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { useSpeakerPlaylistsQuery } = useMediaData();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useSpeakerPlaylistsQuery(speakerId);
  const hasScrolled = useRef(false);
  const requestInFlight = useRef(false);
  const playlists = data?.pages.flatMap(page => page.data) ?? [];
  const loadNextPage = useCallback(() => {
    if (!hasScrolled.current || !hasNextPage || isFetchingNextPage || requestInFlight.current) return;
    requestInFlight.current = true;
    fetchNextPage().finally(() => { requestInFlight.current = false; });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
      <SectionList
        sections={[{ title: 'playlists', data: playlists }]}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={ListHeaderComponent}
        renderSectionHeader={() => StickyHeaderComponent}
        stickySectionHeadersEnabled
        keyExtractor={item => item._id}
        renderItem={({ item }) => <View style={{ paddingHorizontal: 16 }}><PlaylistCard playlist={item} /></View>}
        onScroll={event => { if (event.nativeEvent.contentOffset.y > 0) hasScrolled.current = true; }}
        scrollEventThrottle={16}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.25}
        ListEmptyComponent={isLoading ? <ActivityIndicator color={theme.text.brand} /> : <AppText style={{ textAlign: 'center', padding: 24, color: theme.text.muted }}>{t('media.noPlaylists')}</AppText>}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size={40} color={theme.text.brand} /> : undefined}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </Animated.View>
  );
}
