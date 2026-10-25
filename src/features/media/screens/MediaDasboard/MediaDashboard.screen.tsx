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
  const { useMediaDashboardQueries } = useMediaData();

  const { data, isError, isLoading, refetch, isRefetching } =
    useMediaDashboardQueries();
  const { latestVideos, featuredVideos, mostViewedVideos, featuredSpeakers } =
    data ?? {};

  function renderVideosSection(title: string, data: any[]) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            {title}
          </AppText>
          <AppText variant="caption" style={styles.clickableText}>
            {t('common.seeAll')}
          </AppText>
        </View>
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          renderItem={({ item: video }) => (
            <View style={styles.cardCont}>
              <VideoCard video={video} />
            </View>
          )}
          horizontal
          style={styles.listCont}
        />
      </View>
    );
  }

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
            refetch();
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

      {latestVideos &&
        latestVideos?.data?.length > 0 &&
        renderVideosSection(t('media.latestVideos'), latestVideos?.data)}

      {mostViewedVideos &&
        mostViewedVideos?.data?.length > 0 &&
        renderVideosSection(
          t('media.mostViewedVideos'),
          mostViewedVideos?.data,
        )}

      {isError && <AppText>Error loading latest videos</AppText>}

      <View style={styles.noteCont}>
        <AppText style={styles.noteText} numberOfLines={3} adjustsFontSizeToFit>
          {t('media.disclaimer')}
        </AppText>
      </View>
    </Screen>
  );
}
