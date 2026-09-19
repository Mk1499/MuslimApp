import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNames from './StackNames';
import React from 'react';
import { BottomTabs } from './BottomTabs';
import { fontFamily, useTheme } from '../theme';
import type { AppStackParamList } from './types';
import Stacks from './stacks';

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
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      {Stacks.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={{ headerShown: false, ...options }}
        />
      ))}
    </Stack.Navigator>
  );
}
