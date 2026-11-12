import { Screen } from '@/components/ui';
import useLocation from '@/hooks/useLocation';
import { useAppStore } from '@/store/useAppStore';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { SplashAnimation } from '@/assets/animations';
import moment from 'moment';
import 'moment/locale/ar';
import { isRTL } from '@/utils/constants';
import { getPrayerTimes } from '@/api/prayerTimes';

export default function SplashScreen() {
  const { getCurrentLocation } = useLocation();
  const { userLocation, userAddress, setPrayerTimes } = useAppStore();
  const { reset } = useNavigation();

  async function initApp() {
    moment.locale(isRTL ? 'ar' : 'en');

    if (!userLocation) {
      getCurrentLocation()
        .catch(error => {
          console.error('Error getting current location:', error);
        })
        .finally(() => {
          reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        });
    } else {
      const prayerTimesData = await getPrayerTimes(
        {
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
        },
        userAddress as string,
      );
      setPrayerTimes(prayerTimesData?.prayerTimes);
      reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={SplashAnimation}
        autoPlay
        style={styles.animation}
        loop={false}
        onAnimationFinish={() => {
          initApp();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});
