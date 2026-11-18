import { useCallback } from 'react';
import {
  getAnalytics,
  logEvent,
  logScreenView,
} from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message';

export type AnalyticsParams = Record<string, string | number | boolean | null>;

export const EVENTS = {
  General_API_ERROR: 'general_api_error',
  Get_HADITH_COLLECTIONS_ERROR: 'get_hadith_collections_error',
  Get_SURAH_MUTASHABIHAT_ERROR: 'get_surah_mutashabihat_error',
};

/** Shared Firebase Analytics helpers for recording meaningful app behavior. */
export function useAnalytics() {
  const trackEvent = useCallback(
    (
      eventName: string,
      params?: AnalyticsParams,
      withToast?: boolean,
      toastMessage?: string,
    ) => {
      try {
        const result = logEvent(
          getAnalytics(),
          eventName,
          params,
        ) as unknown as Promise<void> | undefined;
        void result?.catch(error => {
          console.warn(`Unable to log analytics event "${eventName}":`, error);
        });
        if (withToast) {
          // Show a toast message here if needed
          Toast.show({
            type: 'tomatoToast',
            text1: toastMessage ?? `Event: ${eventName}`,
            visibilityTime: 1000,
            topOffset: 70,
          });
        }
      } catch (error) {
        console.warn(`Unable to log analytics event "${eventName}":`, error);
      }
    },
    [],
  );

  return { trackEvent };
}

/** Log navigation screens with Firebase's recommended screen_view event. */
export function trackScreenView(screenName: string): void {
  try {
    void logScreenView(getAnalytics(), {
      screen_name: screenName,
      screen_class: screenName,
    }).catch(error => {
      console.warn(`Unable to log screen view "${screenName}":`, error);
    });
  } catch (error) {
    console.warn(`Unable to log screen view "${screenName}":`, error);
  }
}
