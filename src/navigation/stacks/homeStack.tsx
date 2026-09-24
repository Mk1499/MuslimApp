import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import HadithColletionScreen from '@/features/hadith/screens/HadithCollections/HadithColletions.screens';
import CollectionsDetails from '@/features/hadith/screens/CollectionsDetails/CollectionsDetails.screen';
import { HadithCollection } from '@/types/hadith';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.HadithCollections}
        component={HadithColletionScreen}
      />
      <Stack.Screen
        name={ScreenNames.CollectionsDetails}
        component={CollectionsDetails}
      />
    </Stack.Navigator>
  );
}

export type HomeStackParamList = {
  [ScreenNames.HadithCollections]: undefined;
  [ScreenNames.CollectionsDetails]: {
    collection: HadithCollection;
  };
};
