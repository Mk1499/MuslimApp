import React, { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AccordionItemProps } from './types';
import makeStyles from './styles';
import { useTheme } from '@/theme';

function AccordionItem({
  isExpanded,
  children,
  viewKey,
  duration = 500,
}: AccordionItemProps) {
  const height = useSharedValue(0);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle]}
    >
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}
export default AccordionItem;
