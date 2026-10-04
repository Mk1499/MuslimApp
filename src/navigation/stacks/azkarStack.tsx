import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames from '../ScreenNames';
import AzkarCollectionsScreen from '@/features/azkar/screens/AzkarCollections/AzkarColletions.screens';

const Stack = createNativeStackNavigator<AzkarStackParamList>();

export default function AzkarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ScreenNames.AzkarCollections}
        component={AzkarCollectionsScreen}
      />
    </Stack.Navigator>
  );
}

export type AzkarStackParamList = {
  [ScreenNames.AzkarCollections]: undefined;
};
