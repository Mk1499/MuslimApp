import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import AzkarCollectionsScreen from '@/features/azkar/screens/AzkarCollections/AzkarColletions.screens';
import AzkarDetailsScreen from '@/features/azkar/screens/AzkarDetails/AzkarDetails.screen';
import { AzkarCollection } from '@/types/azkar';

const Stack = createNativeStackNavigator<AzkarStackParamList>();

export default function AzkarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.AzkarCollections}
        component={AzkarCollectionsScreen}
      />
      <Stack.Screen
        name={ScreenNames.AzkarDetails}
        component={AzkarDetailsScreen}
      />
    </Stack.Navigator>
  );
}

export type AzkarStackParamList = {
  [ScreenNames.AzkarCollections]: undefined;
  [ScreenNames.AzkarDetails]: {
    item: AzkarCollection;
  };
};
