/** Geographic position of the Kaaba in Makkah - the target of every bearing. */
export const KAABA = { latitude: 21.422487, longitude: 39.826206 };

/** Hysteresis: enter "aligned" at ±3°, leave it at ±6° so it doesn't flicker. */
export const ALIGN_ENTER_DEGREES = 3;
export const ALIGN_EXIT_DEGREES = 6;

/** Smallest heading change (degrees) that triggers a compass update. */
export const COMPASS_UPDATE_DEGREES = 1;

export const ALIGN_VIBRATION_MS = 60;
export const ROTATION_DURATION_MS = 120;

export const DIAL_WIDTH_RATIO = 0.86;
export const DIAL_MAX_SIZE = 360;

export const EARTH_RADIUS_KM = 6371;

export const POSITION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 5 * 60 * 1000,
};
