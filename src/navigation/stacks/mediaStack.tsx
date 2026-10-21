import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import MediaDashboard from '@/features/media/screens/MediaDasboard/MediaDashboard.screen';
import { Surah } from '@/types/surah';

const Stack = createNativeStackNavigator<MediaStackParamList>();

export default function MediaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.MediaDashboard}
        component={MediaDashboard}
      />
    </Stack.Navigator>
  );
}

export type MediaStackParamList = {
  [ScreenNames.MediaDashboard]: undefined;
};
