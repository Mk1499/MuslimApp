import { View, Text, FlatList, ImageBackground } from 'react-native';
import React from 'react';
import { spacing, useTheme } from '@/theme';
import makeStyle from './styles';
import { AppIcon, AppText } from '@/components/ui';
import { MosqueImage } from '@/assets/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const prayers = [
  {
    name: 'Fajr',
    time: '05:30',
    icon: 'sunrise',
  },
  {
    name: 'Dhuhr',
    time: '12:15',
    icon: 'sun',
  },
  {
    name: 'Asr',
    time: '15:45',
    icon: 'sun',
  },
  {
    name: 'Maghrib',
    time: '18:30',
    icon: 'sunset',
  },
  {
    name: 'Isha',
    time: '20:00',
    icon: 'moon',
  },
];

export default function DBBannerComponent() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { top } = useSafeAreaInsets();

  function renderPrayerItem({ item }: { item: (typeof prayers)[0] }) {
    return (
      <View
        style={[
          styles.prayerItem,
          item.name === 'Fajr' && styles.prayerItemActive,
        ]}
      >
        <AppText style={styles.prayerName}>{item.name}</AppText>
        <AppIcon
          name={item.icon}
          size={spacing.xxl}
          color={theme.basic.white}
          as="Feather"
        />
        <AppText style={styles.prayerTime}>{item.time}</AppText>
      </View>
    );
  }

  return (
    <ImageBackground
      source={MosqueImage}
      style={[styles.upperCont, { paddingTop: top + spacing.lg }]}
      tintColor={'#fff'}
      imageStyle={{ opacity: 0.1, resizeMode: 'cover' }}
    >
      <View style={styles.headerCont}>
        <View style={styles.nextPrayerCont}>
          <AppText style={styles.nextPlayerTime} variant="title">
            05:30
          </AppText>
          <View style={styles.nextPrayerRow}>
            <AppIcon
              name="time-outline"
              size={spacing.xl}
              color={theme.basic.white}
            />
            <AppText style={styles.nextPrayerTimeText}>Fajr in</AppText>
            <AppText style={styles.nextPrayerTimeText}>05:30:00</AppText>
          </View>
        </View>
        <View style={styles.dayDataCont}>
          <AppText style={styles.hDate} variant="subtitle">
            12 Ramadan 1445
          </AppText>
        </View>
      </View>
      <FlatList
        data={prayers}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.paryersListCont}
        keyExtractor={item => item.name}
        renderItem={renderPrayerItem}
      />
    </ImageBackground>
  );
}
