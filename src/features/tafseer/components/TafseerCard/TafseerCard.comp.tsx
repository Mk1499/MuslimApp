import { View, Pressable } from 'react-native';
import React, { ReactNode } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TafseerCardProps from './types';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import makeStyles from './styles';
import { useTheme } from '@/theme';
import AccordionItem from '@/components/common/AccordionItem/AccordionItem.comp';

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
