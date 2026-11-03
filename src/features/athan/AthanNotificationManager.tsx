import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import notifee, {
  AndroidNotificationSetting,
  AuthorizationStatus,
} from 'react-native-notify-kit';
import i18next from '@/i18n';
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
  const permissionCheckedRef = useRef(false);

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

  // Ask for notification access at app launch so the default enabled Athans
  // can be scheduled without requiring a visit to the settings screen.
  useEffect(() => {
    if (permissionCheckedRef.current) return;
    permissionCheckedRef.current = true;

    void (async () => {
      try {
        let settings = await notifee.getNotificationSettings();
        if (
          settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
          settings.authorizationStatus !== AuthorizationStatus.PROVISIONAL
        ) {
          settings = await notifee.requestPermission();
        }

        const authorized =
          settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
          settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
        if (authorized) {
          reschedule();
          if (
            Platform.OS === 'android' &&
            settings.android.alarm === AndroidNotificationSetting.DISABLED
          ) {
            Alert.alert(
              i18next.t('athan.exactAlarmTitle'),
              i18next.t('athan.exactAlarmMessage'),
              [
                { text: i18next.t('common.cancel'), style: 'cancel' },
                {
                  text: i18next.t('athan.openSettings'),
                  onPress: () => void notifee.openAlarmPermissionSettings(),
                },
              ],
            );
          }
        } else {
          Alert.alert(
            i18next.t('athan.permissionTitle'),
            i18next.t('athan.permissionMessage'),
            [
              { text: i18next.t('common.cancel'), style: 'cancel' },
              {
                text: i18next.t('athan.openSettings'),
                onPress: () => void notifee.openNotificationSettings(),
              },
            ],
          );
        }
      } catch (error) {
        console.warn('Unable to request Athan notification permission:', error);
      }
    })();
  }, [reschedule]);

  return null;
}
