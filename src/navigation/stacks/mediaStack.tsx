import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import MediaDashboard from '@/features/media/screens/MediaDasboard/MediaDashboard.screen';
import { Surah } from '@/types/surah';
import SpeakerProfile from '@/features/media/screens/SpeakerProfile/SpeakerProfile.screen';
import { VideoSpeaker } from '@/types/media.types';
import VideoDetails from '@/features/media/screens/VideoDetails/VideoDetails.screen';
import AllSpeakers from '@/features/media/screens/AllSpeakers/AllSpeakers.screen';
import { Video } from '@/types/media.types';
import MediaSearchResults from '@/features/media/screens/MediaSearchResults/MediaSearchResults.screen';

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
      <Stack.Screen name={ScreenNames.VideoDetails} component={VideoDetails} />
      <Stack.Screen name={ScreenNames.AllSpeakers} component={AllSpeakers} />
      <Stack.Screen
        name={ScreenNames.MediaSearchResults}
        component={MediaSearchResults}
      />
    </Stack.Navigator>
  );
}

export type MediaStackParamList = {
  [ScreenNames.MediaDashboard]: undefined;
  [ScreenNames.SpeakerProfile]: {
    speaker?: VideoSpeaker;
  };
  [ScreenNames.VideoDetails]: { video: Video };
  [ScreenNames.AllSpeakers]: undefined;
  [ScreenNames.MediaSearchResults]: { query: string };
};
