import { Screen } from '@/components/ui';
import useLocation from '@/hooks/useLocation';
import { useAppStore } from '@/store/useAppStore';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function SplashScreen() {
  const { getCurrentLocation } = useLocation();
  const { userAddress, userLocation } = useAppStore();
  const { reset } = useNavigation();

  useEffect(() => {
    initApp();
  }, []);

  function initApp() {
    if (!userLocation) {
      alert('Getting current location...');

      getCurrentLocation()
        .catch(error => {
          console.log('Error getting current location:', error);
        })
        .finally(() => {
          reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        });
    } else {
      reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }

  return (
    <Screen>
      <View>
        <Text>Splash Screen</Text>
      </View>
    </Screen>
  );
}
