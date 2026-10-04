import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import ScreenNames from '../ScreenNames';
import HadithColletionScreen from '@/features/hadith/screens/HadithCollections/HadithColletions.screens';
import CollectionsDetails from '@/features/hadith/screens/CollectionsDetails/CollectionsDetails.screen';
import { HadithCollection } from '@/types/hadith';
import StackNames from '../StackNames';
import TafseerStack, { TafseerStackParamList } from './tafseerStack';
import AzkarStack, { AzkarStackParamList } from './azkarStack';

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
      <Stack.Screen name={StackNames.Tafseer} component={TafseerStack} />
      <Stack.Screen name={StackNames.Azkar} component={AzkarStack} />
    </Stack.Navigator>
  );
}

export type HomeStackParamList = {
  [ScreenNames.HadithCollections]: undefined;
  [ScreenNames.CollectionsDetails]: {
    collection: HadithCollection;
  };
  [StackNames.Tafseer]: NavigatorScreenParams<TafseerStackParamList>;
  [StackNames.Azkar]: NavigatorScreenParams<AzkarStackParamList>;
};
