import { useEffect, useRef, useState } from 'react';
import CompassHeading from 'react-native-compass-heading';
import { COMPASS_UPDATE_DEGREES } from '../qibla.constants';

type CompassModule = {
  start: (
    rate: number,
    callback: (data: { heading: number }) => void,
  ) => Promise<void>;
  stop: () => Promise<void>;
  hasCompass?: () => Promise<boolean>;
};

const compass = CompassHeading as CompassModule;

/**
 * Subscribes to the device compass while `enabled`, so the magnetometer is
 * released as soon as the screen is no longer visible.
 *
 * @returns `false` when the device has no compass.
 */
export function useCompass(
  onHeading: (heading: number) => void,
  enabled: boolean,
): boolean {
  const [supported, setSupported] = useState(true);
  const handler = useRef(onHeading);
  handler.current = onHeading;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;

    (async () => {
      // hasCompass() isn't exposed by every version of the native module.
      if (typeof compass.hasCompass === 'function') {
        const available = await compass.hasCompass();
        if (!available) {
          if (!cancelled) {
            setSupported(false);
          }
          return;
        }
      }
      if (!cancelled) {
        compass.start(COMPASS_UPDATE_DEGREES, ({ heading }) =>
          handler.current(heading),
        );
      }
    })();

    return () => {
      cancelled = true;
      compass.stop();
    };
  }, [enabled]);

  return supported;
}
