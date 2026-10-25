import { View, Text } from 'react-native';
import React from 'react';
import { VideoCardProps } from './types';
import { AppCard, AppText } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';
import makeStyles from './styles';
import { useTheme } from '@/theme';

export default function VideoCard({ video }: VideoCardProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { youtubeVideoId, title } = video;
  const coverURL = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

  return (
    <AppCard style={styles.container}>
      <AppImage
        source={{ uri: coverURL }}
        style={{ width: '100%', height: 200 }}
      />
      <AppText style={styles.title}>{title}</AppText>
    </AppCard>
  );
}
