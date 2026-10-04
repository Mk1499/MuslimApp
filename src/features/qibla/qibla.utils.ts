import type { Coords } from '@/types/qibla';
import { EARTH_RADIUS_KM, KAABA } from './qibla.constants';

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/** Shortest signed difference between two angles, in [-180, 180]. */
export const normalizeAngle = (degrees: number) =>
  ((((degrees + 180) % 360) + 360) % 360) - 180;

/** Initial great-circle bearing (0-360°, clockwise from true north) to the Kaaba. */
export function getQiblaBearing({ latitude, longitude }: Coords): number {
  const fromLat = toRadians(latitude);
  const kaabaLat = toRadians(KAABA.latitude);
  const deltaLon = toRadians(KAABA.longitude - longitude);

  const y = Math.sin(deltaLon) * Math.cos(kaabaLat);
  const x =
    Math.cos(fromLat) * Math.sin(kaabaLat) -
    Math.sin(fromLat) * Math.cos(kaabaLat) * Math.cos(deltaLon);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

/** Great-circle (haversine) distance to the Kaaba, in kilometres. */
export function getDistanceToKaaba({ latitude, longitude }: Coords): number {
  const deltaLat = toRadians(KAABA.latitude - latitude);
  const deltaLon = toRadians(KAABA.longitude - longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(latitude)) *
      Math.cos(toRadians(KAABA.latitude)) *
      Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}
