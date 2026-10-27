import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import AzkarCollectionsScreen from '@/features/azkar/screens/AzkarCollections/AzkarColletions.screens';
import AzkarDetailsScreen from '@/features/azkar/screens/AzkarDetails/AzkarDetails.screen';
import AzkarHomeScreen from '@/features/azkar/screens/AzkarHome/AzkarHome.screen';
import AzkarFavoritesScreen from '@/features/azkar/screens/AzkarFavorites/AzkarFavorites.screen';
import { AzkarCollection } from '@/types/azkar';

const Stack = createNativeStackNavigator<AzkarStackParamList>();

export default function AzkarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ScreenNames.AzkarHome} component={AzkarHomeScreen} />
      <Stack.Screen
        name={ScreenNames.AzkarFavorites}
        component={AzkarFavoritesScreen}
      />
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
  [ScreenNames.AzkarHome]: undefined;
  [ScreenNames.AzkarFavorites]: undefined;
  [ScreenNames.AzkarCollections]: undefined;
  [ScreenNames.AzkarDetails]: {
    item: AzkarCollection;
  };
};
