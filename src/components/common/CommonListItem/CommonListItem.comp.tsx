import { View, Text } from 'react-native';
import React from 'react';

import { IProps } from './type';
import useStyles from './styles';
import { useTheme } from '@/theme';
import { AppIcon, AppText } from '@/components/ui';
import { isRTL } from '@/utils/constants';

export default function CommonListItem({
  title,
  subtitle,
  onPress,
  withChevron,
}: IProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <View>
        <AppText style={styles.title} variant="subtitle">
          {title}
        </AppText>
        {subtitle && <AppText style={styles.subtitle}>{subtitle}</AppText>}
      </View>
      {withChevron && (
        <AppIcon name={isRTL ? 'chevron-back' : 'chevron-forward'} />
      )}
    </View>
  );
}
