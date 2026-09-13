import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MutashabihatImage, TafseerImage } from '@/assets/images';
import { AppCard } from '@/components/ui';

export default function QuickAccessFeature() {
  const { t } = useTranslation();
  const features = [
    {
      id: 1,
      title: t('home.features.mutashabihat'),
      imgIcon: MutashabihatImage,
    },
    {
      id: 2,
      title: t('home.features.tafsir'),
      imgIcon: TafseerImage,
    },
  ];
  return (
    <AppCard>
      <Text>QuickAccessFeature</Text>
    </AppCard>
  );
}
