import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { QuranScreen } from '@/features/quran/screens/QuranDB/QuranDB.screen';
import { PrayerTimesScreen } from '../features/prayer-times/PrayerTimesScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { AppIcon, type AppIconName } from '../components/ui';
import { fontFamily, fontSize, useTheme } from '../theme';
import type { MainTabParamList } from './types';
import { DashboardScreen } from '@/features/home/screens/Dashboard/Dashboard.screen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, AppIconName> = {
  Home: 'home',
  Quran: 'book',
  PrayerTimes: 'time',
  Settings: 'settings-outline',
};

interface TabBarIconProps {
  focused: boolean;
  size: number;
  name: AppIconName;
}

function TabBarIcon({
  focused,
  size,
  name,
}: TabBarIconProps): React.JSX.Element {
  return (
    <AppIcon
      name={name}
      size={size}
      color={focused ? 'tabBar.active' : 'tabBar.inactive'}
    />
  );
}

export function BottomTabs(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: theme.button.primaryBg,
        headerTitleStyle: {
          fontFamily: fontFamily.semiBold,
          fontSize: fontSize.lg,
          color: theme.text.primary,
        },
        headerStyle: { backgroundColor: theme.background.primary },
        tabBarActiveTintColor: theme.tabBar.active,
        tabBarInactiveTintColor: theme.tabBar.inactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: {
          backgroundColor: theme.tabBar.background,
          borderTopColor: theme.tabBar.border,
        },
        sceneStyle: { backgroundColor: theme.background.primary },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, size }) => (
          <TabBarIcon
            focused={focused}
            size={size}
            name={tabIcons[route.name as keyof MainTabParamList]}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ title: t('tabs.home') }}
      />
      <Tab.Screen
        name="Quran"
        component={QuranScreen}
        options={{ title: t('tabs.quran') }}
      />
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
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
  },
});
