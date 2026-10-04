import React, { useMemo } from 'react';
import { Image, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { AppIcon, AppText } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyles from './styles';
import { MekkahImage } from '@/assets/images';

const rotate = (degrees: number): ViewStyle => ({
  transform: [{ rotate: `${degrees}deg` }],
});

/** Minor ticks every 5°; the cardinal positions carry a label instead. */
const TICKS = Array.from({ length: 72 }, (_, index) => index * 5)
  .filter(degrees => degrees % 90 !== 0)
  .map(degrees => ({
    degrees,
    major: degrees % 30 === 0,
    layer: rotate(degrees),
  }));

const CARDINALS = (['north', 'east', 'south', 'west'] as const).map(
  (key, index) => ({
    key,
    layer: rotate(index * 90),
    // Counter-rotated so the label stays upright on the spinning dial.
    label: rotate(-index * 90),
  }),
);

interface CompassDialProps {
  size: number;
  /** Dial rotation in degrees; the inverse of the device heading. */
  rotation: SharedValue<number>;
  /** Qibla bearing from true north, or null while it is unknown. */
  bearing: number | null;
  aligned: boolean;
}

export default function CompassDial({
  size,
  rotation,
  bearing,
  aligned,
}: CompassDialProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);

  // Colour alone must not signal alignment, so the fill changes with it.
  const accent = aligned ? theme.status.success : theme.accent.primary;
  const fill = aligned ? theme.status.successSoft : theme.card.primary;

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const sizeStyle = useMemo(
    () => ({ width: size, height: size, borderRadius: size / 2 }),
    [size],
  );

  return (
    <View
      style={sizeStyle}
      accessible
      accessibilityRole="image"
      accessibilityLabel={t('qibla.dialLabel')}
    >
      {/* Fixed marker showing where the top of the device points. */}
      <View style={styles.pointer} pointerEvents="none">
        <AppIcon name="caret-down" size={32} color={accent} />
      </View>

      <Animated.View
        style={[
          styles.dial,
          sizeStyle,
          { borderColor: accent, backgroundColor: fill },
          rotationStyle,
        ]}
      >
        {TICKS.map(tick => (
          <View key={tick.degrees} style={[styles.layer, tick.layer]}>
            <View style={[styles.tick, tick.major && styles.tickMajor]} />
          </View>
        ))}

        {CARDINALS.map(cardinal => (
          <View key={cardinal.key} style={[styles.layer, cardinal.layer]}>
            <AppText
              color={cardinal.key === 'north' ? 'brand' : 'primary'}
              style={[styles.cardinal, cardinal.label]}
            >
              {t(`qibla.${cardinal.key}`)}
            </AppText>
          </View>
        ))}

        {bearing !== null && (
          <View style={[styles.layer, rotate(bearing)]}>
            <View style={styles.kaabaMarker}>
              {/* <AppIcon
                name="mosque"
                as="MaterialCommunityIcons"
                size={size * 0.13}
                color={accent}
              /> */}
              <Image
                source={MekkahImage}
                style={{ width: size * 0.13, height: size * 0.13 }}
              />
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
