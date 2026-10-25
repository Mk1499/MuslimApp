import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import MediaDashboard from '@/features/media/screens/MediaDasboard/MediaDashboard.screen';
import { Surah } from '@/types/surah';
import SpeakerProfile from '@/features/media/screens/SpeakerProfile/SpeakerProfile.screen';
import { VideoSpeaker } from '@/types/media.types';

const Stack = createNativeStackNavigator<MediaStackParamList>();

export default function MediaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.MediaDashboard}
        component={MediaDashboard}
      />

      <Stack.Screen
        name={ScreenNames.SpeakerProfile}
        component={SpeakerProfile}
      />
    </Stack.Navigator>
  );
}

export type MediaStackParamList = {
  [ScreenNames.MediaDashboard]: undefined;
  [ScreenNames.SpeakerProfile]: {
    speaker?: VideoSpeaker;
  };
};
