import { FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppIcon, Screen } from '@/components/ui';
import CommonListItem from '@/components/common/CommonListItem/CommonListItem.comp';
import { useTranslation } from 'react-i18next';
import ScreenNames from '@/navigation/ScreenNames';
import { AppStackParamList } from '@/navigation/types';
import { AzkarCollection } from '@/types/azkar';
import useAzkarData from '@/hooks/queries/useAzkarData';

export default function AzkarCollectionsScreen() {
  const { useAzkarCollectionQuery } = useAzkarData();
  const {
    data: azkarCollectionsData,
    isLoading,
    isError,
  } = useAzkarCollectionQuery();
  const collections = azkarCollectionsData
    ? azkarCollectionsData[Object.keys(azkarCollectionsData)?.[0]]
    : [];
  console.log('MK COLLECTIONS: ', collections);
  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

  useEffect(() => {
    if (isError) {
      console.error('Error fetching hadith collections');
    }
  }, [isError]);

  function handleItemPress(item: AzkarCollection) {
    // navigate(StackNames.HomeStack, {
    //   screen: ScreenNames.CollectionsDetails,
    //   params: {
    //     collection: item,
    //   },
    // });
  }

  return (
    <Screen
      isInnerPage
      isLoading={isLoading}
      scroll
      screenTitle={t('azkar.screenName')}
    >
      <FlatList
        data={collections}
        keyExtractor={item => item.ID + '-ssd'}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <CommonListItem
            title={item?.TITLE ?? ''}
            onPress={() => handleItemPress(item)}
            withChevron={true}
            icon={<AppIcon name="book" as="Feather" />}
          />
        )}
      />
    </Screen>
  );
}
