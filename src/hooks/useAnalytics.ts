import { useCallback } from 'react';
import {
  getAnalytics,
  logEvent,
  logScreenView,
} from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message';
import i18next from 'i18next';

export type AnalyticsParams = Record<string, string | number | boolean | null>;

export const EVENTS = {
  General_API_ERROR: 'general_api_error',
  Get_HADITH_COLLECTIONS_ERROR: 'get_hadith_collections_error',
  Get_SURAH_MUTASHABIHAT_ERROR: 'get_surah_mutashabihat_error',
  Get_TAFSEER_COLLECTIONS_ERROR: 'get_tafseer_collections_error',
  Get_TAFSEER_PAGES_ERROR: 'get_tafseer_pages_error',
  Get_AZKAR_COLLECTIONS_ERROR: 'get_azkar_collections_error',
  Get_HADITH_COLLECTION_ERROR: 'get_hadith_collection_error',
  Get_LATEST_VIDEOS_ERROR: 'get_latest_videos_error',
  Get_MOST_VIEWED_VIDEOS_ERROR: 'get_most_viewed_videos_error',
};

/** Shared Firebase Analytics helpers for recording meaningful app behavior. */
export function useAnalytics() {
  const trackEvent = useCallback(
    (
      eventName: string,
      params?: AnalyticsParams,
      withToast?: boolean,
      toastMessage = i18next.t('appMessages.error'),
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
