import { I18nManager, StatusBar } from 'react-native';
import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { lightTheme } from './src/theme';
import './src/i18n';

function App(): React.JSX.Element {
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: lightTheme.background,
      card: lightTheme.surface,
      text: lightTheme.text,
      border: lightTheme.border,
      primary: lightTheme.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={navigationTheme}
        direction={I18nManager.isRTL ? 'rtl' : 'ltr'}>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
