import { useCallback, useEffect, useRef } from 'react';
import TrackPlayer, {
  Event,
  useActiveTrack,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { QuranWord } from '@/types/quran';
import { buildAyahTrack } from '../player/ayahAudio';
import { AYAH_INDEX, AYAH_LIST } from '../player/ayahSequence';

/**
 * How many ayahs are enqueued up-front, and how many more are appended each
 * time the active track gets close to the end of the queue. Keeping these
 * small lets playback run indefinitely without loading the whole mushaf into
 * the native queue at once.
 */
const INITIAL_WINDOW = 50;
const REFILL_THRESHOLD = 10;
const REFILL_BATCH = 50;

/**
 * Plays an ayah recitation when a word is pressed, then keeps playing the
 * following ayahs one after another — across page and surah boundaries —
 * until the user stops, presses another ayah, or leaves the screen.
 *
 * The currently playing ayah is derived from the active track, so the
 * highlight follows playback automatically. The queue refills itself as it
 * is consumed, so playback never stops at a preloaded limit.
 */
export function useAyahPlayer() {
  const activeTrack = useActiveTrack();
  // Track ids are "surah:ayah" — expose the playing ayah key directly.
  const playingAya = activeTrack?.id ?? null;

  const startRef = useRef(0);
  const queueEndRef = useRef(0); // absolute index into AYAH_LIST

  const playAyah = useCallback(async (word: QuranWord) => {
    const key = `${word.surah_number}:${word.ayah_number}`;
    const startIndex = AYAH_INDEX.get(key);
    if (startIndex === undefined) {
      return;
    }

    startRef.current = startIndex;
    const end = Math.min(startIndex + INITIAL_WINDOW, AYAH_LIST.length);
    queueEndRef.current = end;

    const tracks = [];
    for (let i = startIndex; i < end; i++) {
      const a = AYAH_LIST[i];
      tracks.push(buildAyahTrack(a.surah, a.ayah));
    }

    try {
      await TrackPlayer.setQueue(tracks);
      await TrackPlayer.play();
    } catch {
      // Swallow — a failed load shouldn't crash the reading experience.
    }
  }, []);

  // Top the queue up as it is consumed so playback can continue forever.
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async () => {
    try {
      const activeIndex = await TrackPlayer.getActiveTrackIndex();
      if (activeIndex === undefined) {
        return;
      }
      const queueLength = queueEndRef.current - startRef.current;
      if (activeIndex >= queueLength - REFILL_THRESHOLD) {
        const nextEnd = Math.min(
          queueEndRef.current + REFILL_BATCH,
          AYAH_LIST.length,
        );
        if (nextEnd > queueEndRef.current) {
          const tracks = [];
          for (let i = queueEndRef.current; i < nextEnd; i++) {
            const a = AYAH_LIST[i];
            tracks.push(buildAyahTrack(a.surah, a.ayah));
          }
          await TrackPlayer.add(tracks);
          queueEndRef.current = nextEnd;
        }
      }
    } catch {
      // ignore
    }
  });

  const stop = useCallback(async () => {
    try {
      // reset() — not stop(). stop() only halts playback and leaves the queue
      // and active track loaded, so useActiveTrack() would keep reporting the
      // last ayah (leaving the player bar + highlight stuck). reset() clears
      // the queue so the active track becomes undefined.
      await TrackPlayer.reset();
    } catch {
      // ignore
    }
  }, []);

  // Fully clear playback when the owning screen unmounts (user exits the
  // mushaf). reset() so the NEXT screen never inherits this recitation's
  // active track — otherwise it would report a stale playing ayah and the
  // auto-swipe would jump to the old page.
  useEffect(() => {
    return () => {
      TrackPlayer.reset().catch(() => {});
    };
  }, []);

  return { playAyah, stop, playingAya };
}
