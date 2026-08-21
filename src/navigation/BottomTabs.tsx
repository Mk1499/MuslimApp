import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { HomeScreen } from '../screens/home/HomeScreen';
import { QuranScreen } from '../screens/quran/QuranScreen';
import { PrayerTimesScreen } from '../screens/prayerTimes/PrayerTimesScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { fontFamily, fontSize, fontWeight, lightTheme } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabs(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: lightTheme.primary,
        tabBarActiveTintColor: lightTheme.tabBarActive,
        tabBarInactiveTintColor: lightTheme.tabBarInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: {
          backgroundColor: lightTheme.tabBarBackground,
          borderTopColor: lightTheme.border,
        },
        sceneStyle: { backgroundColor: lightTheme.background },
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Quran" component={QuranScreen} options={{ title: t('tabs.quran') }} />
      <Tab.Screen
        name="PrayerTimes"
        component={PrayerTimesScreen}
        options={{ title: t('tabs.prayerTimes') }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('tabs.settings') }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: lightTheme.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold as never,
    fontFamily: fontFamily.semiBold,
  },
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as never,
  },
});
