import { FlatList } from 'react-native';
import React from 'react';
import useHadithData from '@/hooks/queries/useHadithData';
import { Screen } from '@/components/ui';
import CommonListItem from '@/components/common/CommonListItem/CommonListItem.comp';
import { useTranslation } from 'react-i18next';
import useFormatter from '@/hooks/useFormatter';

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
            title={getLocalizedText(item?.arabic_name, item.name)}
            subtitle={`${t('common.total')}: ${item.total_hadiths}`}
            onPress={() => {}}
            withChevron={true}
          />
        )}
        // contentContainerStyle={{ height: 150 }}
      />
    </Screen>
  );
}
