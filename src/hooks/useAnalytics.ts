import { useCallback } from 'react';
import {
  getAnalytics,
  logEvent,
  logScreenView,
} from '@react-native-firebase/analytics';

export type AnalyticsParams = Record<string, string | number | boolean | null>;

/** Shared Firebase Analytics helpers for recording meaningful app behavior. */
export function useAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, params?: AnalyticsParams) => {
      try {
        const result = logEvent(
          getAnalytics(),
          eventName,
          params,
        ) as unknown as Promise<void> | undefined;
        void result?.catch(error => {
          console.warn(`Unable to log analytics event "${eventName}":`, error);
        });
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
