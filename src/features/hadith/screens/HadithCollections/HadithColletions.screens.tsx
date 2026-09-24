import { FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useHadithData from '@/hooks/queries/useHadithData';
import { Screen } from '@/components/ui';
import CommonListItem from '@/components/common/CommonListItem/CommonListItem.comp';
import { useTranslation } from 'react-i18next';
import useFormatter from '@/hooks/useFormatter';
import StackNames from '@/navigation/StackNames';
import ScreenNames from '@/navigation/ScreenNames';
import { AppStackParamList } from '@/navigation/types';
import { HadithCollection } from '@/types/hadith';

export default function HadithCollectionsScreen() {
  const { hadithCollectionsQuery } = useHadithData();
  const {
    data: hadithCollectionsData,
    isLoading,
    isError,
  } = hadithCollectionsQuery;
  const { collections = [] } = hadithCollectionsData?.data ?? {};
  const { t } = useTranslation();
  const { getLocalizedText } = useFormatter();
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

  useEffect(() => {
    if (isError) {
      console.error('Error fetching hadith collections');
    }
  }, [isError]);

  function handleItemPress(item: HadithCollection) {
    navigate(StackNames.HomeStack, {
      screen: ScreenNames.CollectionsDetails,
      params: {
        collection: item,
      },
    });
  }

  return (
    <Screen
      isInnerPage
      isLoading={isLoading}
      scroll
      screenTitle={t('hadith.collectionScreenTitle')}
    >
      <FlatList
        data={collections}
        keyExtractor={item => item.key}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <CommonListItem
            title={getLocalizedText(item?.arabic_name ?? '', item.name)}
            subtitle={`${t('common.total')}: ${item.total_hadiths}`}
            onPress={() => handleItemPress(item)}
            withChevron={true}
          />
        )}
      />
    </Screen>
  );
}
