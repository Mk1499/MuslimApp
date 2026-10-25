import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MediaStackParamList } from '@/navigation/stacks/mediaStack';
import makeStyles from './styles';
import { useTheme } from '@/theme';

import { SpeakerCardProps } from './types';
import useFormatter from '@/hooks/useFormatter';
import { AppText } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';
import ScreenNames from '@/navigation/ScreenNames';
import StackNames from '@/navigation/StackNames';

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { getLocalizedText } = useFormatter();
  const { navigate } = useNavigation<any>();

  const { name, imageUrl, nameAr, nameEn } = speaker;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate(StackNames.MediaStack, {
          screen: ScreenNames.SpeakerProfile,
          params: { speaker },
        })
      }
    >
      <AppImage source={{ uri: imageUrl }} style={styles.image} />
      <AppText style={styles.name}>
        {getLocalizedText(nameAr, nameEn) ?? name}
      </AppText>
    </Pressable>
  );
}
