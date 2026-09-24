import type { NavigatorScreenParams } from '@react-navigation/native';
import StackNames from './StackNames';
import type { HomeStackParamList } from './stacks/homeStack';
import type { QuranStackParamList } from './stacks/quranStack';

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
  [StackNames.Main]: undefined;
  [StackNames.HomeStack]: NavigatorScreenParams<HomeStackParamList>;
  [StackNames.Quran]: NavigatorScreenParams<QuranStackParamList>;
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
