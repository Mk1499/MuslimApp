import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Keyboard,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LoaderOverlay from '@/components/common/LoaderOverlay/LoaderOverlay.comp';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing } from '../../theme';
import { Header } from './Header';

type Edge = 'top' | 'right' | 'bottom' | 'left';

interface ScreenProps {
  children: React.ReactNode;
  padded?: boolean;
  scroll?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  topSafeAreaStyle?: StyleProp<ViewStyle>;
  bottomSafeAreaStyle?: StyleProp<ViewStyle>;
  isInnerPage?: boolean;
  screenTitle?: string;
  isLoading?: boolean;
  withBottomSafeArea?: boolean;
}

export function Screen({
  children,
  padded = false,
  scroll = false,
  style,
  contentContainerStyle,
  topSafeAreaStyle,
  isInnerPage = false,
  screenTitle,
  isLoading = false,
  withBottomSafeArea = true,
}: ScreenProps): React.JSX.Element {
  const theme = useTheme();

  const paddings = padded ? styles.padded : null;
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.safe, { backgroundColor: theme.background.primary }]}>
      <View
        style={[
          { height: top, backgroundColor: theme.background.primary },
          topSafeAreaStyle,
        ]}
      />
      {(isInnerPage || screenTitle) && (
        <Header showBackButton={isInnerPage} title={screenTitle} />
      )}
      {scroll ? (
        <ScrollView
          style={[styles.flex, style]}
          contentContainerStyle={[
            paddings,
            styles.scrollContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <Pressable
          onPress={Keyboard.dismiss}
          style={[styles.flex, paddings, style]}
        >
          <View style={[styles.flex, paddings, style]}>{children}</View>
        </Pressable>
      )}
      {withBottomSafeArea && <View style={{ height: bottom }} />}
      {isLoading && <LoaderOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
