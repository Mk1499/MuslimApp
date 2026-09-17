import { View, Image, Pressable } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AzkarImage,
  HadithImage,
  MutashabihatImage,
  Name99Image,
  QiblaImage,
  SalahImage,
  TafseerImage,
  ZakatCalcImage,
} from '@/assets/images';
import { AppCard, AppText } from '@/components/ui';
import makeStyles from './styles';

export default function QuickAccessFeature() {
  const { t } = useTranslation();
  const styles = makeStyles();
  const features = [
    {
      id: 1,
      title: t('home.features.mutashabihat'),
      imgIcon: MutashabihatImage,
      bgColor: '#E0F7FA',
    },
    {
      id: 2,
      title: t('home.features.tafseer'),
      imgIcon: TafseerImage,
      bgColor: '#FFF3E0',
    },
    {
      id: 3,
      title: t('home.features.99Names'),
      imgIcon: Name99Image,
      bgColor: '#E8F5E9',
    },
    {
      id: 4,
      title: t('home.features.azkar'),
      imgIcon: AzkarImage,
      bgColor: '#FFFDE7',
    },
    {
      id: 5,
      title: t('home.features.prayerTimes'),
      imgIcon: SalahImage,
      bgColor: '#EDE7F6',
    },
    {
      id: 6,
      title: t('home.features.qibla'),
      imgIcon: QiblaImage,
      bgColor: '#E1F5FE',
    },
    {
      id: 7,
      title: t('home.features.hadith'),
      imgIcon: HadithImage,
      bgColor: '#FCE4EC',
    },
    {
      id: 8,
      title: t('home.features.zakatCalc'),
      imgIcon: ZakatCalcImage,
      bgColor: '#FFF8E1',
    },
  ];

  function renderFeature({
    id,
    title,
    imgIcon,
    bgColor,
  }: {
    id: number;
    title: string;
    imgIcon: any;
    bgColor: string;
  }) {
    return (
      <Pressable style={styles.featureItem}>
        <Image
          source={imgIcon}
          style={[styles.featureImage, { backgroundColor: bgColor }]}
        />
        <AppText style={[styles.featureTitle]}>{title}</AppText>
      </Pressable>
    );
  }

  return (
    <AppCard style={styles.container}>
      <View style={styles.listRow}>
        {features?.splice(0, 4).map(feature => renderFeature(feature))}
      </View>
      <View style={styles.listRow}>
        {features?.splice(0, 4).map(feature => renderFeature(feature))}
      </View>
    </AppCard>
  );
}
