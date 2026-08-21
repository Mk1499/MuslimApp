import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BottomTabs } from './BottomTabs';
import { AboutScreen } from '../screens/about/AboutScreen';
import { lightTheme } from '../theme';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Stack that hosts the bottom tabs plus any full-screen pages. */
export function AppStack(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: lightTheme.primary,
        headerTitleStyle: styles.headerTitle,
        contentStyle: { backgroundColor: lightTheme.background },
      }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: t('about.title') }} />
    </Stack.Navigator>
  );
}

const styles = {
  headerTitle: {
    color: lightTheme.text,
    fontWeight: '600' as const,
  },
};
