import { useCallback, useEffect, useMemo, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useAppStore } from '@/store/useAppStore';
import type { Coords, QiblaStatus } from '@/types/qibla';
import { isAndroid } from '@/utils/constants';
import { POSITION_OPTIONS } from '../qibla.constants';
import { getDistanceToKaaba, getQiblaBearing } from '../qibla.utils';

async function requestLocationPermission(): Promise<boolean> {
  if (isAndroid) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return new Promise(resolve =>
    Geolocation.requestAuthorization(
      () => resolve(true),
      () => resolve(false),
    ),
  );
}

function getCurrentCoords(): Promise<Coords> {
  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      reject,
      POSITION_OPTIONS,
    ),
  );
}

/**
 * Resolves the Qibla bearing and the distance to the Kaaba for the user's
 * position. The last known position is persisted in the app store, so the dial
 * is usable immediately while a fresh fix is acquired.
 */
export function useQiblaBearing() {
  const coords = useAppStore(state => state.userLocation);
  const setUserLocation = useAppStore(state => state.setUserLocation);

  const [status, setStatus] = useState<QiblaStatus>(
    coords ? 'ready' : 'loading',
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const granted = await requestLocationPermission();
        if (cancelled) {
          return;
        }
        if (!granted) {
          setStatus('denied');
          return;
        }

        const fresh = await getCurrentCoords();
        if (cancelled) {
          return;
        }
        setUserLocation(fresh);
        setStatus('ready');
      } catch {
        // Keep guiding with the last known position when there is one.
        if (!cancelled) {
          setStatus(useAppStore.getState().userLocation ? 'ready' : 'error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt, setUserLocation]);

  const bearing = useMemo(
    () => (coords ? getQiblaBearing(coords) : null),
    [coords],
  );
  const distanceKm = useMemo(
    () => (coords ? getDistanceToKaaba(coords) : null),
    [coords],
  );

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt(value => value + 1);
  }, []);

  return { bearing, distanceKm, status, retry };
}
