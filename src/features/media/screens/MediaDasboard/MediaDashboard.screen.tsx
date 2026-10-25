import { FlatList, RefreshControl, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/ui';
import useMediaData from '@/hooks/queries/useMediaData';
import VideoCard from '../../components/VideoCard/VideoCard.comp';
import { Carousel } from 'react-native-reanimated-carousel';
import { useTheme } from '@/theme';
import makeStyles from './styles';
import SpeakerCard from '../../components/SpeakerCard/SpeakerCard.comp';

export default function MediaDashboardScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const {
    useGetLatestVideosQuery,
    useGetFeaturedVideosQuery,
    useGetFeaturedSpeakersQuery,
  } = useMediaData();
  const {
    data: latestVideos,
    isLoading: isLatestLoading,
    error,
    refetch: refetchLatestVideos,
    isRefetching: isRefetchingLatestVideos,
  } = useGetLatestVideosQuery();
  const {
    data: featuredVideos,
    isLoading: isFeaturedLoading,
    error: featuredError,
    refetch: refetchFeaturedVideos,
    isRefetching: isRefetchingFeaturedVideos,
  } = useGetFeaturedVideosQuery();

  const {
    data: featuredSpeakers,
    isLoading: isFeaturedSpeakersLoading,
    error: featuredSpeakersError,
    refetch: refetchFeaturedSpeakers,
    isRefetching: isRefetchingFeaturedSpeakers,
  } = useGetFeaturedSpeakersQuery();

  const isLoading =
    isLatestLoading || isFeaturedLoading || isFeaturedSpeakersLoading;
  const isRefetching =
    isRefetchingLatestVideos ||
    isRefetchingFeaturedVideos ||
    isRefetchingFeaturedSpeakers;

  return (
    <Screen
      scroll
      isLoading={isLoading}
      withBottomSafeArea={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          colors={[theme.background.brand]}
          onRefresh={() => {
            refetchLatestVideos();
            refetchFeaturedVideos();
            refetchFeaturedSpeakers();
          }}
        />
      }
    >
      <AppText variant="title" style={styles.screenTitle}>
        {t('media.title')}
      </AppText>
      {featuredVideos && featuredVideos?.data?.length > 0 && (
        <Carousel
          style={styles.featuredContainer}
          data={featuredVideos?.data}
          renderItem={({ item }) => <VideoCard video={item} />}
          autoplay
          loop
          keyExtractor={item => 'featured_video_' + item?._id}
          layout={{
            type: 'parallax',
          }}
        />
      )}

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            {t('media.featuredSpeakers')}
          </AppText>
          <AppText variant="caption" style={styles.clickableText}>
            {t('common.seeAll')}
          </AppText>
        </View>

        <FlatList
          data={featuredSpeakers?.data}
          keyExtractor={speaker => speaker._id}
          renderItem={({ item: speaker }) => (
            <View style={styles.speakerCardCont}>
              <SpeakerCard speaker={speaker} />
            </View>
          )}
          horizontal
          style={styles.listCont}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            {t('media.latestVideos')}
          </AppText>
          <AppText variant="caption" style={styles.clickableText}>
            {t('common.seeAll')}
          </AppText>
        </View>
        <FlatList
          data={latestVideos?.data}
          keyExtractor={video => video._id}
          renderItem={({ item: video }) => (
            <View style={styles.cardCont}>
              <VideoCard video={video} />
            </View>
          )}
          horizontal
          style={styles.listCont}
        />
      </View>
      {error && <AppText>Error loading latest videos</AppText>}
      {featuredError && <AppText>Error loading featured videos</AppText>}

      <View style={styles.noteCont}>
        <AppText style={styles.noteText} numberOfLines={3} adjustsFontSizeToFit>
          {t('media.disclaimer')}
        </AppText>
      </View>
    </Screen>
  );
}
