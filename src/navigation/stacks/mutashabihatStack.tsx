import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import MutashabihatListScreen from '@/features/mutashabihat/screens/MutashabihatList/MutashabihatList.screen';

const Stack = createNativeStackNavigator<MutashabihatStackParamList>();

export default function MutashabihatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.MutashanihatList}
        component={MutashabihatListScreen}
      />
    </Stack.Navigator>
  );
}

export type MutashabihatStackParamList = {
  [ScreenNames.MutashanihatList]: undefined;
};
