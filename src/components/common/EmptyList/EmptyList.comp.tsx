import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme';
import makeStyles from './styles';

import EmptyListProps from './types';
import { AppText } from '@/components/ui/AppText';

export default function EmptyList({ message }: EmptyListProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{message ?? t('common.noData')}</AppText>
    </View>
  );
}
