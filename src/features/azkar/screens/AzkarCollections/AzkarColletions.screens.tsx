import { FlatList, View } from 'react-native';
import NetworkFail from '@/components/common/NetworkFail/NetworkFail.comp';
import { useAnalytics, EVENTS } from '@/hooks/useAnalytics';
import React, { useEffect, useMemo, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AzkarStackParamList } from '@/navigation/stacks/azkarStack';
import { AppIcon, AppText, Screen } from '@/components/ui';
import CommonListItem from '@/components/common/CommonListItem/CommonListItem.comp';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';
import { useTranslation } from 'react-i18next';
import ScreenNames from '@/navigation/ScreenNames';
import { AzkarCollection } from '@/types/azkar';
import useAzkarData from '@/hooks/queries/useAzkarData';
import makeStyles from './styles';
import { useAppStore } from '@/store/useAppStore';

export default function AzkarCollectionsScreen() {
  const { useAzkarCollectionQuery } = useAzkarData();
  const { isInternetConnected } = useAppStore();
  const { trackEvent } = useAnalytics();
  const {
    data: azkarCollectionsData,
    isLoading,
    isError,
  } = useAzkarCollectionQuery();
  const collections = azkarCollectionsData
    ? azkarCollectionsData[Object.keys(azkarCollectionsData)?.[0]]
    : [];
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const styles = makeStyles();
  const filteredCollections = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return collections;
    return collections.filter(collection =>
      collection?.TITLE?.toLocaleLowerCase().includes(query),
    );
  }, [collections, searchQuery]);
  const { navigate } =
    useNavigation<
      NavigationProp<AzkarStackParamList, ScreenNames.AzkarCollections>
    >();

  useEffect(() => {
    if (isError) {
      console.error('Error fetching hadith collections');
      trackEvent(
        EVENTS.Get_AZKAR_COLLECTIONS_ERROR,
        {
          error: 'Error fetching hadith collections',
        },
        true,
        t('appMessages.error'),
      );
    }
  }, [isError]);

  function handleItemPress(item: AzkarCollection) {
    navigate(ScreenNames.AzkarDetails, {
      item,
    });
  }

  if (!isInternetConnected) {
    return (
      <Screen isInnerPage screenTitle={t('azkar.screenName')}>
        <NetworkFail />
      </Screen>
    );
  }

  return (
    <Screen
      isInnerPage
      isLoading={isLoading}
      screenTitle={t('azkar.screenName')}
      scroll={false}
    >
      <View style={styles.listCont}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder={t('azkar.searchPlaceholder')}
          containerStyle={styles.searchInput}
          returnKeyType="search"
          testID="azkar-collections-search"
        />
        <FlatList
          data={filteredCollections}
          keyExtractor={item => item.ID + '-ssd'}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <CommonListItem
              title={item?.TITLE ?? ''}
              onPress={() => handleItemPress(item)}
              withChevron={true}
              icon={<AppIcon name="book" as="Feather" />}
            />
          )}
          ListEmptyComponent={
            !isLoading ? (
              <AppText variant="caption" style={styles.emptyMessage}>
                {searchQuery.trim()
                  ? t('azkar.noCollectionsFound')
                  : t('common.noData')}
              </AppText>
            ) : undefined
          }
        />
      </View>
    </Screen>
  );
}
