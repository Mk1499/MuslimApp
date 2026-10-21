import React, { useEffect, useState } from 'react';
import { I18nManager, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, radius, spacing, elevation } from '@/theme';
import { AppIcon, AppText } from '@/components/ui';
import { RECITER_FOLDER, getReciterDisplayName } from '../../player/ayahAudio';
import { SURAH_NAMES } from '../../player/ayahSequence';

interface Props {
  /** Full "surah:ayah" key of the currently playing ayah, or null. */
  playingAya: string | null;
  /** Whether the audio is currently producing sound. */
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
}

/**
 * Animated bottom player bar. Slides up + fades in the moment playback starts
 * and slides back out when it stops. Shows the reciter and surah name plus
 * play/pause and stop controls.
 *
 * Because the bar covers the bottom of the page, it can also be slid down out
 * of the way with a collapse button; a small floating button then takes its
 * place and slides it back up.
 */
export default function PlayerBar({
  playingAya,
  isPlaying,
  onTogglePlay,
  onStop,
}: Props) {
  const theme = useTheme();

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const progress = useSharedValue(0);
  const fabProgress = useSharedValue(0);

  const visible = !!playingAya;
  const shown = visible && !collapsed;
  const showFab = visible && collapsed;

  // Collapsing only means something while something plays — reset it when
  // playback ends so the next recitation opens with the bar expanded.
  useEffect(() => {
    if (!visible) {
      setCollapsed(false);
    }
  }, [visible]);

  // Slide the bar up (shown) or down (hidden / collapsed by the user).
  useEffect(() => {
    if (shown) {
      setMounted(true);
      progress.value = withTiming(1, { duration: 350 });
    } else {
      progress.value = withTiming(0, { duration: 350 }, finished => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      });
    }
  }, [shown, progress]);

  // Fade + scale the floating "slide up" button in/out.
  useEffect(() => {
    fabProgress.value = withTiming(showFab ? 1 : 0, { duration: 250 });
  }, [showFab, fabProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 140 }],
    opacity: progress.value,
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabProgress.value,
    transform: [{ scale: 0.5 + fabProgress.value * 0.5 }],
  }));

  const surahNumber = playingAya ? Number(playingAya.split(':')[0]) : null;
  const surahName = surahNumber != null ? SURAH_NAMES[surahNumber] : undefined;

  return (
    <>
      {/* Floating button — shown only while the bar is collapsed. */}
      <Animated.View
        pointerEvents={showFab ? 'auto' : 'none'}
        accessibilityElementsHidden={!showFab}
        importantForAccessibility={showFab ? 'auto' : 'no-hide-descendants'}
        style={[
          styles.fab,
          { backgroundColor: theme.button.primaryBg },
          elevation.md,
          fabAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={() => setCollapsed(false)}
          style={styles.fabBtn}
          accessibilityRole="button"
          accessibilityLabel="Show player controls"
        >
          <AppIcon name="chevron-up" size={22} color="text.inverse" />
        </Pressable>
      </Animated.View>

      {mounted && (
        <Animated.View
          style={[
            styles.bar,
            {
              backgroundColor: theme.card.primary,
              borderColor: theme.card.border,
            },
            elevation.md,
            animatedStyle,
          ]}
        >
          <View style={styles.info}>
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {getReciterDisplayName(RECITER_FOLDER)}
            </AppText>
            <AppText variant="subtitle" numberOfLines={1}>
              {surahName ?? ''}
            </AppText>
          </View>

          <View style={styles.controls}>
            <Pressable
              onPress={onTogglePlay}
              style={({ pressed }) => [
                styles.controlBtn,
                { backgroundColor: theme.button.primaryBg },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            >
              <AppIcon
                name={isPlaying ? 'pause' : 'play'}
                size={20}
                color="text.inverse"
              />
            </Pressable>

            <Pressable
              onPress={onStop}
              style={({ pressed }) => [
                styles.controlBtn,
                { backgroundColor: theme.button.secondaryBg },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Stop"
            >
              <AppIcon name="stop" size={18} color="text.secondary" />
            </Pressable>

            {/* Slide the bar down so it stops covering the page. */}
            <Pressable
              onPress={() => setCollapsed(true)}
              style={({ pressed }) => [
                styles.controlBtn,
                { backgroundColor: theme.button.secondaryBg },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Hide player"
            >
              <AppIcon name="chevron-down" size={18} color="text.secondary" />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </>
  );
}

// The floating button sits on the same side as the bar's controls: in RTL the
// controls row is mirrored to the left edge, otherwise to the right.
const fabSide = I18nManager.isRTL
  ? { left: spacing.xl }
  : { right: spacing.xl };

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    ...fabSide,
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginRight: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
