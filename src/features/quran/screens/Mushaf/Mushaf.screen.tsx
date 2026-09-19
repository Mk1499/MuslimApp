import { View, Text } from 'react-native';
import React from 'react';
import { AppText, Screen } from '@/components/ui';

export default function Mushaf() {
  return (
    <Screen isInnerPage screenTitle="Mushaf">
      <View>
        <AppText>Mushaf</AppText>
      </View>
    </Screen>
  );
}
