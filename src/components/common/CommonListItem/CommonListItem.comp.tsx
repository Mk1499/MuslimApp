import { View, Text, Pressable } from 'react-native';
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
  icon,
}: IProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.dataCont}>
        {icon && <View style={styles.iconCont}>{icon}</View>}
        <View>
          <AppText
            style={styles.title}
            variant="subtitle"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </AppText>
          {subtitle && (
            <AppText
              style={styles.subtitle}
              variant="caption"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
      {withChevron && (
        <AppIcon name={isRTL ? 'chevron-back' : 'chevron-forward'} />
      )}
    </Pressable>
  );
}
