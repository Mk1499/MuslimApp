import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import EmptyList from '@/components/common/EmptyList/EmptyList.comp';
import React from 'react';
import { Screen } from '@/components/ui/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MutashabihatStackParamList } from '@/navigation/stacks/mutashabihatStack';
import ScreenNames from '@/navigation/ScreenNames';
import { useTheme } from '@/theme';
import useStyles from './styles';
import useMutashabihatData from '@/hooks/queries/useMutashabihatData';
import AyahMutCard from '../../components/AyahMutashabihatCard/AyahMutCard.comp';
import { useTranslation } from 'react-i18next';
import useFormatter from '@/hooks/useFormatter';

export default function SurahMutashabihat() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const { getLocalizedText } = useFormatter();

  const { params } =
    useRoute<
      RouteProp<MutashabihatStackParamList, ScreenNames.SurahMutashabihat>
    >();
  const { surah } = params ?? {};
  const { number, name_arabic, name_english } = surah ?? {};
  const { useSurahMutashabihatQuery } = useMutashabihatData();
  const {
    data: mutashabihatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMutashabihatLoading,
  } = useSurahMutashabihatQuery(number);

  const verses =
    mutashabihatData?.pages.flatMap(page => page.data.verses) ?? [];

  function loadNextPage() {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

  return (
    <Screen
      isInnerPage
      isLoading={isMutashabihatLoading}
      padded
      screenTitle={t('mutashabihat.screenName', {
        surah: getLocalizedText(name_arabic ?? '', name_english ?? ''),
      })}
    >
      {!isMutashabihatLoading && (
        <FlatList
          data={verses}
          keyExtractor={item => item.verse_key.toString()}
          renderItem={({ item }) => <AyahMutCard ayah={item} />}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <EmptyList message={t('mutashabihat.noSimilarAyahs')} />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size={'large'} color={theme.text.brand} />
            ) : (
              <></>
            )
          }
        />
      )}
    </Screen>
  );
}
