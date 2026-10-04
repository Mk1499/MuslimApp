import { AppText, Screen } from '@/components/ui';
import React from 'react';
import { QiblaCompass } from '@/assets/images';
import { View, Image } from 'react-native';
import useStyles from './styles';

export default function QiblaScreen() {
  const styles = useStyles();
  return (
    <Screen isInnerPage withBGPattern>
      <View>
        <Image style={styles.compassImage} source={QiblaCompass} />
      </View>
    </Screen>
  );
}
