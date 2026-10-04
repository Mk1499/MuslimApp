import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import TafseerCollections from '@/features/tafseer/screens/TafseerCollections/TafseerCollections.screen';
import TafseerDetailsScreen from '@/features/tafseer/screens/TafseerDetails/TafseerDetails.screen';
import { Surah } from '@/types/surah';
import { Tafseer } from '@/types/tafseer.types';

const Stack = createNativeStackNavigator<TafseerStackParamList>();

export default function TafseerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.TafseerCollections}
        component={TafseerCollections}
      />
      <Stack.Screen
        name={ScreenNames.TafseerDetails}
        component={TafseerDetailsScreen}
      />
    </Stack.Navigator>
  );
}

export type TafseerStackParamList = {
  [ScreenNames.TafseerCollections]: undefined;
  [ScreenNames.TafseerDetails]: {
    surah: Surah;
    tafseer: Tafseer;
  };
};
