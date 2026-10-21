import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Audio, type AudioTagHandle } from 'react-native-audio-api';
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

  if (!sourceUrl) {
    return null;
  }

  return (
    <View style={styles.hidden} pointerEvents="none">
      <Audio
        key={sourceId}
        ref={handleRef}
        source={{ uri: sourceUrl }}
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
