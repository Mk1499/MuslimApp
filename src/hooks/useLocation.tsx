import { getPrayerTimes } from '@/api/prayerTimes';
import { useAppStore } from '@/store/useAppStore';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';
import { openSettings } from 'react-native-permissions';

export default function useLocation() {
  const { setUserLocation, setUserAddress, setPrayerTimes } = useAppStore();
  const { t } = useTranslation();

  function promptOpenSettings() {
    Alert.alert(
      t('common.locationPermission'),
      t('common.locationPermissionDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.openSettings'),
          // The user taps the button first: never jump to Settings without telling them why
          onPress: () => {
            openSettings().catch(() => Linking.openSettings());
          },
        },
      ],
    );
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async position => {
          setUserLocation({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          });
          getAddress({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          }).then(async address => {
            setUserAddress(address);
            const prayerTimesData = await getPrayerTimes(
              {
                latitude: position?.coords?.latitude,
                longitude: position?.coords?.longitude,
              },
              address as string,
            );
            setPrayerTimes(prayerTimesData?.prayerTimes);
          });
          resolve(position);
        },
        error => {
          console.log('location err', { error });
          if (error.code === 1) {
            promptOpenSettings();
          }
          return reject(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    });
  };

  const getAddress = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error));
    });
  };

  return { getCurrentLocation, getAddress };
}
