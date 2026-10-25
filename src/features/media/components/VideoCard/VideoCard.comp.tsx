import { View, Text } from 'react-native';
import React from 'react';
import { VideoCardProps } from './types';
import { AppCard, AppIcon, AppText } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';
import makeStyles from './styles';
import { useTheme } from '@/theme';
import useFormatter from '@/hooks/useFormatter';

export default function VideoCard({ video }: VideoCardProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { youtubeVideoId, title, speakers, views, duration } = video;
  const coverURL = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  const { formatDuration } = useFormatter();

  return (
    <AppCard style={styles.container}>
      <View>
        <AppImage source={{ uri: coverURL }} style={styles.cover} />
        <View style={styles.metaCont}>
          <View style={styles.metaItemCont}>
            <AppIcon name="eye" size={20} color={theme.text.muted} />
            <AppText style={styles.metaItemText} variant="caption">
              {views}
            </AppText>
          </View>
          <View style={styles.metaItemCont}>
            <AppText style={styles.metaItemText} variant="subtitle">
              {formatDuration(duration)}
            </AppText>
          </View>
        </View>
      </View>
      <View style={[styles.dataCont]}>
        <AppImage
          source={{ uri: speakers[0]?.imageUrl }}
          style={styles.speakerImg}
        />
        <View style={styles.infoCont}>
          <AppText style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            {title}
          </AppText>
          <AppText style={styles.speakerName} variant="caption">
            {speakers[0]?.name}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}
