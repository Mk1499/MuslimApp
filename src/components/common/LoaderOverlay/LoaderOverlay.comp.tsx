import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import useStyles from './styles';
import LottieView from 'lottie-react-native';
import { LoaderAnimation } from '@/assets/animations';

export default function LoaderOverlay() {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <LottieView
        source={LoaderAnimation}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}
