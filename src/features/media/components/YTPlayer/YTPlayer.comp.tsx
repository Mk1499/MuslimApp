import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { YTPlayerProps } from './types';
import useMediaData from '@/hooks/queries/useMediaData';

const BORDER_WIDTH = 2;
const RADIUS = 14;

export default function YTPlayer({ videoId, id }: YTPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  const { useWatchVideoQuery } = useMediaData();
  const { refetch } = useWatchVideoQuery(id);

  const onStateChange = useCallback((state: string) => {
    console.log({ state });
    if (state === 'ended') {
      setPlaying(false);
    } else if (state === 'unstarted') {
      refetch();
    }
  }, []);

  // The ratio box decides the size; we only read it and hand the same numbers to the player
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize(prev =>
      prev && prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  }, []);

  return (
    // Frame: border + radius only, no height, so it simply wraps the ratio box
    <View style={styles.frame}>
      <View style={styles.ratioBox} onLayout={onLayout}>
        {size && (
          <YoutubePlayer
            width={Math.floor(size.width)}
            height={Math.floor(size.height)}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: 'black',
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  ratioBox: {
    width: '100%',
    aspectRatio: 16 / 9, // YouTube's player frame is always 16:9
    backgroundColor: 'black', // hides any sub-pixel rounding gap
    borderRadius: RADIUS - BORDER_WIDTH, // inner radius, so the corners stay clean on Android
    overflow: 'hidden',
  },
});
