import { I18nManager, StatusBar } from 'react-native';
import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import './src/i18n';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ThemedApp />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function ThemedApp(): React.JSX.Element {
  const theme = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background.primary,
      card: theme.card.primary,
      text: theme.text.primary,
      border: theme.divider,
      primary: theme.button.primaryBg,
    },
  };

  return (
    <NavigationContainer
      theme={navigationTheme}
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;
