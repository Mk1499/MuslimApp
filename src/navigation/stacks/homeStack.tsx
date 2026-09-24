import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import { DashboardScreen } from '@/features/home/screens/Dashboard/Dashboard.screen';
import HadithColletionScreen from '@/features/hadith/screens/HadithCollections/HadithColletions.screens';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.HadithCollections}
        component={HadithColletionScreen}
      />
    </Stack.Navigator>
  );
}

export type HomeStackParamList = {
  [ScreenNames.HadithCollections]: undefined;
};
