import { View, Text } from 'react-native';
import { EmptyListImage } from '@/assets/images';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import makeStyles from './styles';

import EmptyListProps from './types';
import { AppText } from '@/components/ui/AppText';
import AppImage from '@/components/ui/AppImage';

export default function EmptyList({ message }: EmptyListProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <AppImage
        source={EmptyListImage}
        style={styles.image}
        tintColor={theme.text.brand}
      />
      <AppText style={styles.text}>{message ?? t('common.noData')}</AppText>
    </View>
  );
}
