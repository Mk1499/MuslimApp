import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import MutashabihatListScreen from '@/features/mutashabihat/screens/MutashabihatList/MutashabihatList.screen';
import SurahMutashabihatScreen from '@/features/mutashabihat/screens/SurahMutashabihat/SurahMutashabihat.screen';
import { Surah } from '@/types/surah';

const Stack = createNativeStackNavigator<MutashabihatStackParamList>();

export default function MutashabihatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.MutashanihatList}
        component={MutashabihatListScreen}
      />
      <Stack.Screen
        name={ScreenNames.SurahMutashabihat}
        component={SurahMutashabihatScreen}
      />
    </Stack.Navigator>
  );
}

export type MutashabihatStackParamList = {
  [ScreenNames.MutashanihatList]: undefined;
  [ScreenNames.SurahMutashabihat]: {
    surah: Surah;
  };
};
