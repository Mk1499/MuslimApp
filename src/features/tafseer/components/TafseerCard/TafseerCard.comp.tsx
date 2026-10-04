import { View, Pressable } from 'react-native';
import React, { ReactNode } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TafseerCardProps from './types';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import makeStyles from './styles';
import { useTheme } from '@/theme';

export default function TafseerCard({ text, tafsir }: TafseerCardProps) {
  const isExpanded = useSharedValue(false);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded.value ? '180deg' : '0deg') }],
  }));

  return (
    <Pressable
      onPress={() => {
        isExpanded.value = !isExpanded.value;
      }}
    >
      <AppCard style={styles.cardCont}>
        <View style={styles.header}>
          <View style={styles.ayaCont}>
            <AppText style={styles.aya}>{text}</AppText>
          </View>
          <Animated.View style={[chevronStyle, styles.chevronIcon]}>
            <AppIcon name="chevron-down" size={25} />
          </Animated.View>
        </View>
        <AccordionItem viewKey={'tafseer' + text} isExpanded={isExpanded}>
          <AppText style={styles.tafseer}>{tafsir}</AppText>
        </AccordionItem>
      </AppCard>
    </Pressable>
  );
}

interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  viewKey: string;
  duration?: number;
}

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
