import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import Mushaf from '@/features/quran/screens/Mushaf/Mushaf.screen';
import { Surah } from '@/types/surah';

const Stack = createNativeStackNavigator<QuranStackParamList>();

export default function QuranStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ScreenNames.Mushaf} component={Mushaf} />
    </Stack.Navigator>
  );
}

export type QuranStackParamList = {
  [ScreenNames.Mushaf]: {
    surah: Surah;
  };
};
