import { View, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { Screen } from '@/components/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '@/navigation/stacks/homeStack';
import ScreenNames from '@/navigation/ScreenNames';
import useFormatter from '@/hooks/useFormatter';
import useHadithData from '@/hooks/queries/useHadithData';
import HadithCard from '../../components/HadithCard/HadithCard.comp';
import { HadithItem } from '@/types/hadith';
import { useTheme } from '@/theme';

export default function CollectionsDetails() {
  const { getLocalizedText } = useFormatter();
  const theme = useTheme();
  const { params } =
    useRoute<
      RouteProp<HomeStackParamList, typeof ScreenNames.CollectionsDetails>
    >();
  const { collection } = params;
  const { key, arabic_name, name } = collection ?? {};
  const { useHadithCollectionQuery } = useHadithData();
  const {
    data: hadithCollectionData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isHadithCollectionLoading,
  } = useHadithCollectionQuery(key);
  const hadiths =
    hadithCollectionData?.pages.flatMap(page => page.data.hadiths) ?? [];

  function loadNextPage() {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

  return (
    <Screen
      isInnerPage
      screenTitle={getLocalizedText(arabic_name ?? '', name)}
      padded
      isLoading={isHadithCollectionLoading}
    >
      <View style={{ flexGrow: 1 }}>
        <FlatList
          data={hadiths}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <HadithCard item={item as HadithItem} />}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.5}
        />
        {isFetchingNextPage && (
          <ActivityIndicator size="large" color={theme.accent.primary} />
        )}
      </View>
    </Screen>
  );
}
