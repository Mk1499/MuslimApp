import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNames from './StackNames';
import React from 'react';
import { BottomTabs } from './BottomTabs';
import { fontFamily, useTheme } from '../theme';
import type { AppStackParamList } from './types';
import Stacks from './stacks';
import SplashScreen from '@/features/splash/screens/SplashScreen/Splash.screen';
import PrayerTrackerScreen from '@/features/prayer-tracker/PrayerTracker.screen';
import ScreenNames from './ScreenNames';
import SavedAyahsScreen from '@/features/quran/screens/SavedAyahs/SavedAyahs.screen';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Stack that hosts the bottom tabs plus any full-screen pages. */
export function AppStack(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: theme.button.primaryBg,
        headerTitleStyle: {
          fontFamily: fontFamily.semiBold,
          color: theme.text.primary,
        },
        headerStyle: { backgroundColor: theme.background.primary },
        contentStyle: { backgroundColor: theme.background.primary },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenNames.PrayerTracker}
        component={PrayerTrackerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenNames.SavedAyahs}
        component={SavedAyahsScreen}
        options={{ headerShown: false }}
      />
      {Stacks.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof AppStackParamList}
          component={component}
          options={{ headerShown: false, ...options }}
        />
      ))}
    </Stack.Navigator>
  );
}
