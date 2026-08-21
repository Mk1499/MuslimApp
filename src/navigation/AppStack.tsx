import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BottomTabs } from './BottomTabs';
import { AboutScreen } from '../features/about/AboutScreen';
import { fontFamily, useTheme } from '../theme';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Stack that hosts the bottom tabs plus any full-screen pages. */
export function AppStack(): React.JSX.Element {
  const { t } = useTranslation();
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
      }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: t('about.title') }} />
    </Stack.Navigator>
  );
}
