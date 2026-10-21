import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  ayahPlayerEngine,
  type AyahTarget,
} from '../player/ayahPlayerEngine';
import { AYAH_TO_PAGE } from '../player/ayahSequence';

export type { AyahTarget };

/**
 * Plays an ayah recitation when a word is pressed, then keeps playing the
 * following ayahs one after another — across page and surah boundaries —
 * until the user stops, presses another ayah, or leaves the screen.
 *
 * The currently playing ayah comes from the player engine, so the highlight
 * follows playback automatically. The engine walks the mushaf on its own, so
 * playback never stops at a preloaded limit.
 */
export function useAyahPlayer() {
  const [snapshot, setSnapshot] = useState(() =>
    ayahPlayerEngine.getSnapshot(),
  );

  useEffect(() => ayahPlayerEngine.subscribe(setSnapshot), []);

  // Track ids are "surah:ayah" — expose the playing ayah key directly.
  const playingAya = snapshot.currentAyahKey;
  const isPlaying = snapshot.isPlaying;

  const playAyah = useCallback((target: AyahTarget) => {
    ayahPlayerEngine.play(target);
  }, []);

  const stop = useCallback(() => {
    ayahPlayerEngine.stop();
  }, []);

  const togglePlay = useCallback(() => {
    ayahPlayerEngine.toggle();
  }, []);

  // Keep the "last played ayah" fresh as playback advances, so the home
  // screen's Continue resumes near where the user stopped rather than where
  // they originally tapped. getState() reads the store without subscribing
  // this hook to it, so the pager isn't re-rendered on every ayah change.
  useEffect(() => {
    if (!playingAya) {
      return;
    }
    const page = AYAH_TO_PAGE.get(playingAya);
    if (!page) {
      return;
    }
    const [surah, ayah] = playingAya.split(':').map(Number);
    useAppStore.getState().setLastPlayedAyah({ surah, ayah, page });
  }, [playingAya]);

  // Fully clear playback when the owning screen unmounts (user exits the
  // mushaf), so the NEXT screen never inherits this recitation's ayah.
  useEffect(() => {
    return () => {
      ayahPlayerEngine.stop();
    };
  }, []);

  return { playAyah, stop, togglePlay, playingAya, isPlaying };
}
