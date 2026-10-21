import React, { useCallback, useState } from 'react';
import { Alert, Button, View } from 'react-native';
import { YTPlayerProps } from './types';
import YoutubePlayer from 'react-native-youtube-iframe';
import { SCREEN_HEIGHT } from '@/utils/constants';

export default function YTPlayer({ videoId }: YTPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  return (
    <View
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'black',
        height: 0.35 * SCREEN_HEIGHT,
      }}
    >
      <YoutubePlayer
        height={'100%'}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
    </View>
  );
}
