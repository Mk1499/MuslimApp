import { View, FlatList, ImageBackground } from 'react-native';
import React from 'react';
import { spacing, useTheme } from '@/theme';
import makeStyle from './styles';
import { AppIcon, AppText } from '@/components/ui';
import { MosqueImage } from '@/assets/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useDateHook from '@/hooks/useDateHook';
import { usePrayerTimes } from '@/hooks/queries/usePrayerTimes';

export default function DBBannerComponent() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { top } = useSafeAreaInsets();
  const { getCurrentTime } = useDateHook();
  const { data, isLoading } = usePrayerTimes({
    latitude: 24.7136,
    longitude: 46.6753,
    date: '2026-08-26',
  });

  const prayers = Object.entries(data?.data.prayer_times || {}).map(
    ([key, value]) => ({
      name: key,
      time: value,
      icon: key === 'Fajr' ? 'sunrise' : 'sunset',
    }),
  );

  function renderPrayerItem({ item }: { item: (typeof prayers)[0] }) {
    return (
      <View
        style={[
          styles.prayerItem,
          item.name === data?.data.current_status?.current_prayer &&
            styles.prayerItemActive,
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
      tintColor={theme.basic.white}
      imageStyle={styles.bgImg}
    >
      <View style={styles.headerCont}>
        <View style={styles.nextPrayerCont}>
          <AppText style={styles.nextPlayerTime} variant="title">
            {getCurrentTime()}
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
      {isLoading ? (
        <View>
          <AppText>Loading prayer times...</AppText>
        </View>
      ) : (
        <FlatList
          data={prayers}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paryersListCont}
          keyExtractor={item => item.name}
          renderItem={renderPrayerItem}
        />
      )}
    </ImageBackground>
  );
}
