import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from '@/theme';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import AppImage from '@/components/ui/AppImage';
import { NoInternetImage } from '@/assets/images';
import useStyles from './styles';

export default function NetworkFail({ message }: { message?: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppImage
        source={NoInternetImage}
        style={styles.image}
        tintColor={theme.text.highlight}
      />
      <AppText style={styles.text}>
        {message ?? t('common.networkRequired')}
      </AppText>
    </View>
  );
}
