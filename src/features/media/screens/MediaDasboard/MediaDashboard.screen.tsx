import { FlatList, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/ui';
import useMediaData from '@/hooks/queries/useMediaData';
import VideoCard from '../../components/VideoCard/VideoCard.comp';
import { Carousel } from 'react-native-reanimated-carousel';
import { useTheme } from '@/theme';
import makeStyles from './styles';

export default function MediaDashboardScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const { useGetLatestVideosQuery, useGetFeaturedVideosQuery } = useMediaData();
  const {
    data: latestVideos,
    isLoading: isLatestLoading,
    error,
  } = useGetLatestVideosQuery();
  const {
    data: featuredVideos,
    isLoading: isFeaturedLoading,
    error: featuredError,
  } = useGetFeaturedVideosQuery();

  const isLoading = isLatestLoading || isFeaturedLoading;

  return (
    <Screen scroll isLoading={isLoading}>
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
        <AppText variant="title" style={styles.sectionTitle}>
          {t('media.latestVideos')}
        </AppText>
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
    </Screen>
  );
}
