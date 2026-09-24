import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import useStyles from './styles';

export default function LoaderOverlay() {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
