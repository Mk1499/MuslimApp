import React, { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { useAthanSettingsStore } from '@/store/useAthanSettingsStore';
import { rescheduleAthanNotifications } from './athanNotifications';

/** Keeps local prayer alerts in sync on startup, foregrounding and preference changes. */
export function AthanNotificationManager(): null {
  const userLocation = useAppStore(state => state.userLocation);
  const userAddress = useAppStore(state => state.userAddress);
  const language = useAppStore(state => state.language);
  const enabled = useAthanSettingsStore(state => state.enabled);
  const sound = useAthanSettingsStore(state => state.sound);

  const reschedule = useCallback(() => {
    if (!userLocation) return;

    void rescheduleAthanNotifications({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      countryCode: userAddress?.address?.country_code,
      enabled,
      sound,
    }).catch(error => {
      console.warn('Unable to schedule Athan notifications:', error);
    });
  }, [enabled, sound, userAddress, userLocation, language]);

  useEffect(() => {
    reschedule();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') reschedule();
    });
    return () => subscription.remove();
  }, [reschedule]);

  return null;
}
