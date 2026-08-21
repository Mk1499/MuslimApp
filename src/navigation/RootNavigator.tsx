import React from 'react';
import { AppStack } from './AppStack';

/**
 * Root of the navigation tree.
 * When auth is added, switch between Auth and App stacks here
 * based on the auth state from the store.
 */
export function RootNavigator(): React.JSX.Element {
  return <AppStack />;
}
