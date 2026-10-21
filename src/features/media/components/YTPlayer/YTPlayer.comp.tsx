import React, { useCallback, useState } from 'react';
import { Alert, Button, View } from 'react-native';
import { YTPlayerProps } from './types';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function YTPlayer({ videoId }: YTPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);
  return (
    <View>
      <YoutubePlayer
        height={200}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
      <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
    </View>
  );
}
