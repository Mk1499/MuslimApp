import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function QuickAccessFeature() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>QuickAccessFeature</Text>
    </View>
  );
}
