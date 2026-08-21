import type { NavigatorScreenParams } from '@react-navigation/native';

/** Screens inside the bottom tab bar. */
export type MainTabParamList = {
  Home: undefined;
  Quran: undefined;
  PrayerTimes: undefined;
  Settings: undefined;
};

/** Stack screens rendered above the tabs (push full-screen pages here). */
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  About: undefined;
};

/**
 * Root level of the app.
 * Later this can become a switch between `Auth` and `App` stacks.
 */
export type RootStackParamList = AppStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
