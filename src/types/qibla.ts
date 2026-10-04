export interface Coords {
  latitude: number;
  longitude: number;
}

/** Lifecycle of resolving the position the Qibla bearing is calculated from. */
export type QiblaStatus = 'loading' | 'ready' | 'denied' | 'error';
