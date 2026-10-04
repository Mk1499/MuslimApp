import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  ALIGN_ENTER_DEGREES,
  ALIGN_EXIT_DEGREES,
  ALIGN_VIBRATION_MS,
  ROTATION_DURATION_MS,
} from '../qibla.constants';
import { normalizeAngle } from '../qibla.utils';
import { useCompass } from './useCompass';

/**
 * Turns raw compass headings into the dial rotation and the signed angle the
 * user still has to turn to face the Qibla.
 *
 * @param bearing Qibla bearing from true north, or null while it is unknown.
 * @param enabled Whether the compass should be running.
 */
export function useQiblaGuidance(bearing: number | null, enabled: boolean) {
  const [heading, setHeading] = useState(0);
  const [aligned, setAligned] = useState(false);
  const alignedRef = useRef(false);

  // The dial angle is "unwrapped" so it never spins the long way round when
  // the heading crosses 359° -> 0°.
  const rotation = useSharedValue(0);
  const unwrapped = useRef(0);
  const lastHeading = useRef<number | null>(null);

  const onHeading = useCallback(
    (value: number) => {
      if (lastHeading.current === null) {
        unwrapped.current = -value;
        rotation.value = -value;
      } else {
        unwrapped.current -= normalizeAngle(value - lastHeading.current);
        rotation.value = withTiming(unwrapped.current, {
          duration: ROTATION_DURATION_MS,
          easing: Easing.linear,
        });
      }
      lastHeading.current = value;
      // Rounded so sub-degree jitter doesn't re-render the guidance text.
      setHeading(Math.round(value));
    },
    [rotation],
  );

  const supported = useCompass(onHeading, enabled);

  // Positive => the Qibla is to the right of where the device points.
  const offset = bearing === null ? null : normalizeAngle(bearing - heading);

  useEffect(() => {
    if (offset === null) {
      return;
    }
    const distance = Math.abs(offset);
    const next = alignedRef.current
      ? distance <= ALIGN_EXIT_DEGREES
      : distance <= ALIGN_ENTER_DEGREES;

    if (next === alignedRef.current) {
      return;
    }
    alignedRef.current = next;
    setAligned(next);
    if (next) {
      Vibration.vibrate(ALIGN_VIBRATION_MS);
    }
  }, [offset]);

  useEffect(() => {
    if (enabled) {
      return;
    }
    // Drop stale readings so a paused compass can't keep claiming "aligned".
    lastHeading.current = null;
    alignedRef.current = false;
    setAligned(false);
  }, [enabled]);

  return { rotation, offset, aligned, supported };
}
