import { Screen } from '@/components/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AzkarStackParamList } from '@/navigation/stacks/azkarStack';
import React from 'react';
import { View, FlatList } from 'react-native';
import useAzkarData from '@/hooks/queries/useAzkarData';
import AzkarCard from '../../components/AzkarCard/AzkarCard.comp';

export default function AzkarDetailsScreen() {
  const { params } = useRoute<RouteProp<AzkarStackParamList, 'azkarDetails'>>();
  const { item: collectionItem } = params;
  const { useAzkarDetailsByID } = useAzkarData();
  const { data: azkarDetails, isLoading } = useAzkarDetailsByID(
    collectionItem.ID?.toString() ?? '',
  );
  const azkarDetailsArray = azkarDetails
    ? Object.values(azkarDetails).flat()
    : [];

  return (
    <Screen
      isInnerPage
      screenTitle={collectionItem.TITLE}
      padded
      isLoading={isLoading}
    >
      <View>
        <FlatList
          data={azkarDetailsArray ?? []}
          keyExtractor={item => item.ID?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => <AzkarCard item={item} />}
        />
      </View>
    </Screen>
  );
}
