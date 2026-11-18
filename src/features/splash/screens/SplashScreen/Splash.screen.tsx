import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppText,
  AppTouchable,
} from '@/components/ui';
import useLocation from '@/hooks/useLocation';
import { useAppStore } from '@/store/useAppStore';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import { SplashAnimation } from '@/assets/animations';
import moment from 'moment';
import 'moment/locale/ar';
import { isRTL } from '@/utils/constants';
import { getPrayerTimes } from '@/api/prayerTimes';
import AppImage from '@/components/ui/AppImage';
import { LocationImage } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { fontFamily } from '@/theme';

export default function SplashScreen() {
  const { getCurrentLocation } = useLocation();
  const { userLocation, userAddress, setPrayerTimes } = useAppStore();
  const { reset } = useNavigation();
  const locationSheetRef = useRef<AppBottomSheetRef>(null);
  const { t } = useTranslation();

  function navToHome() {
    reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  }

  async function initApp() {
    moment.locale(isRTL ? 'ar' : 'en');
    locationSheetRef.current?.present();

    if (!userLocation) {
      getCurrentLocation()
        .then(() => {
          navToHome();
        })
        .catch(error => {
          locationSheetRef.current?.present();
          console.error('Error getting current location:', error);
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
      navToHome();
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

      <AppBottomSheet
        ref={locationSheetRef}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
      >
        <View style={styles.bottomSheetContent}>
          <AppImage source={LocationImage} style={styles.bottomSheetImage} />
          <AppText style={styles.sheetTitle}>
            {t('common.locationPermission')}
          </AppText>
          <AppText style={styles.sheetDescription}>
            {t('common.locationPermissionDescription')}
          </AppText>
        </View>
        <View style={styles.buttonsCont}>
          <AppTouchable
            onPress={() => {
              locationSheetRef.current?.dismiss();
              Linking.openSettings();
            }}
          >
            <AppText style={styles.btnText}>
              {t('common.allowLocation')}
            </AppText>
          </AppTouchable>

          <AppTouchable
            onPress={() => {
              locationSheetRef.current?.dismiss();
            }}
            variant="secondary"
          >
            <AppText style={styles.btnText}>
              {t('common.allowLocationLater')}
            </AppText>
          </AppTouchable>
        </View>
      </AppBottomSheet>
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
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sheetDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsCont: {
    gap: 20,
    padding: 20,
    paddingBottom: 40,
  },
  btnText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
});
