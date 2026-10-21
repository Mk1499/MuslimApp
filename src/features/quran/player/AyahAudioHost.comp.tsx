import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Audio, type AudioSource, type AudioTagHandle } from 'react-native-audio-api';
import { ayahPlayerEngine } from './ayahPlayerEngine';

/**
 * Headless host for the ayah player.
 *
 * It renders the `<Audio>` element that `react-native-audio-api` uses to
 * stream a recitation, and wires its events to the engine. The element is
 * keyed by the engine's `sourceId`, so every ayah gets a fresh source and the
 * previous one is torn down automatically.
 *
 * The element is invisible — it only exists to make sound. Render it once,
 * next to whatever UI reacts to playback.
 */
export default function AyahAudioHost() {
  const [snapshot, setSnapshot] = useState(() =>
    ayahPlayerEngine.getSnapshot(),
  );
  const handleRef = useRef<AudioTagHandle | null>(null);

  useEffect(() => ayahPlayerEngine.subscribe(setSnapshot), []);

  useEffect(
    () =>
      ayahPlayerEngine.attachHost({
        play: () => handleRef.current?.play(),
        pause: () => handleRef.current?.pause(),
      }),
    [],
  );

  const { sourceUrl, sourceId } = snapshot;

  /**
   * The `source` object must keep the same identity for as long as the URL is
   * unchanged. `react-native-audio-api` memoizes its loader on the source
   * *object*, so a fresh literal on every render would tear the current source
   * down and download the file again — restarting the ayah in a loop.
   */
  const source = useMemo<AudioSource>(
    () => ({ uri: sourceUrl ?? '' }),
    [sourceUrl],
  );

  if (!sourceUrl) {
    return null;
  }

  return (
    <View style={styles.hidden} pointerEvents="none">
      <Audio
        key={sourceId}
        ref={handleRef}
        source={source}
        context={ayahPlayerEngine.getAudioContext() ?? undefined}
        autoPlay={false}
        onLoad={() => ayahPlayerEngine.handleLoaded(sourceId)}
        onEnded={() => ayahPlayerEngine.handleEnded(sourceId)}
        onError={() => ayahPlayerEngine.handleError(sourceId)}
        onPlay={() => ayahPlayerEngine.handlePlaying(true)}
        onPause={() => ayahPlayerEngine.handlePlaying(false)}
      />
    </View>
  );
}

// Kept out of the layout flow entirely — the host must not affect the layout
// of the screen that renders it.
const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});
