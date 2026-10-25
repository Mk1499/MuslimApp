import { View, Text } from 'react-native';
import React from 'react';
import makeStyles from './styles';
import { useTheme } from '@/theme';

import { SpeakerCardProps } from './types';
import useFormatter from '@/hooks/useFormatter';
import { AppText } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { getLocalizedText } = useFormatter();

  const { name, imageUrl, nameAr, nameEn } = speaker;

  return (
    <View style={styles.container}>
      <AppImage source={{ uri: imageUrl }} style={styles.image} />
      <AppText style={styles.name}>
        {getLocalizedText(nameAr, nameEn) ?? name}
      </AppText>
    </View>
  );
}
