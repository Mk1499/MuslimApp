import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppIcon, AppText, AppTouchable, Screen } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';
import YTPlayer from '@/features/media/components/YTPlayer/YTPlayer.comp';
import VideoCard from '@/features/media/components/VideoCard/VideoCard.comp';
import useMediaData from '@/hooks/queries/useMediaData';
import useFormatter from '@/hooks/useFormatter';
import { MediaStackParamList } from '@/navigation/stacks/mediaStack';
import ScreenNames from '@/navigation/ScreenNames';
import { spacing, useTheme } from '@/theme';
import { isRTL } from '@/utils/constants';
import makeStyles from './styles';
import { useSharedValue } from 'react-native-reanimated';
import AccordionItem from '@/components/common/AccordionItem/AccordionItem.comp';
import moment from 'moment';

export default function VideoDetails() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { goBack } = useNavigation();
  const { params } =
    useRoute<RouteProp<MediaStackParamList, ScreenNames.VideoDetails>>();
  const { video } = params;
  const { useRelatedVideosQuery } = useMediaData();
  const { data, isLoading, isError } = useRelatedVideosQuery(video._id);
  const { getLocalizedText } = useFormatter();
  const speaker = video.speakers?.[0];
  const publishedDate = video.publishedAt
    ? moment(video.publishedAt).locale('ar-SA').format('Do MMMM YYYY')
    : '';
  const isDescExpanded = useSharedValue(false);
  const { likes, dislikes } = video ?? {};

  return (
    <Screen
      scroll
      withBottomSafeArea={false}
      contentContainerStyle={styles.content}
      stickyHeaderIndices={[0]}
    >
      <View style={styles.playerCont}>
        <View style={styles.topBar}>
          <AppTouchable variant="ghost" onPress={goBack} hitSlop={spacing.md}>
            <AppIcon
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              color={theme.text.primary}
              size={28}
            />
          </AppTouchable>
          <AppText variant="subtitle">{t('media.video')}</AppText>
          <View style={styles.topBarSpacer} />
        </View>
        <YTPlayer videoId={video.youtubeVideoId} id={video._id} />
      </View>

      <View style={styles.videoInfo}>
        <AppText variant="caption" style={styles.videoMeta}>
          {`${video.views.toLocaleString()} ${t('media.views')}${
            publishedDate ? ` · ${publishedDate}` : ''
          }`}
        </AppText>
        <Pressable
          onPress={() => {
            isDescExpanded.value = !isDescExpanded.value;
          }}
        >
          <AppText variant="subtitle" style={styles.title}>
            {video.title}
          </AppText>
        </Pressable>
        {!!video.description && (
          <AccordionItem
            viewKey={'desc' + video?._id}
            isExpanded={isDescExpanded}
          >
            <View style={styles.description}>
              <AppText variant="caption" style={styles.descriptionText}>
                {video.description}
              </AppText>
            </View>
          </AccordionItem>
        )}
        {speaker && (
          <Pressable
            style={styles.channelRow}
            onPress={() =>
              navigation.navigate(ScreenNames.SpeakerProfile, { speaker })
            }
            accessibilityRole="button"
          >
            <AppImage
              source={{ uri: speaker.imageUrl }}
              style={styles.avatar}
            />
            <View style={styles.channelInfo}>
              <AppText style={styles.speakerName} numberOfLines={1}>
                {getLocalizedText(speaker.nameAr, speaker.nameEn) ||
                  speaker.name}
              </AppText>
              <AppText variant="caption" style={styles.channelLabel}>
                {t('media.speaker')}
              </AppText>
            </View>
            <AppText style={styles.visitLabel}>
              {t('media.viewChannel')}
            </AppText>
          </Pressable>
        )}
      </View>

      <View style={styles.relatedSection}>
        <AppText variant="subtitle" style={styles.relatedTitle}>
          {t('media.relatedVideos')}
        </AppText>
        {isLoading && (
          <ActivityIndicator color={theme.text.brand} style={styles.loader} />
        )}
        {isError && (
          <AppText variant="caption" style={styles.emptyText}>
            {t('media.relatedError')}
          </AppText>
        )}
        {!isLoading && !isError && (data?.data ?? []).length === 0 && (
          <AppText variant="caption" style={styles.emptyText}>
            {t('common.noData')}
          </AppText>
        )}
        {(data?.data ?? []).map(relatedVideo => (
          <View key={relatedVideo._id} style={styles.relatedCard}>
            <VideoCard video={relatedVideo} />
          </View>
        ))}
      </View>
    </Screen>
  );
}
