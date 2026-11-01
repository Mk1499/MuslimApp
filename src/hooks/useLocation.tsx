import { getPrayerTimes } from '@/api/prayerTimes';
import { useAppStore } from '@/store/useAppStore';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export default function useLocation() {
  const { setUserLocation, setUserAddress, setPrayerTimes } = useAppStore();

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
        error => reject(error),
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
