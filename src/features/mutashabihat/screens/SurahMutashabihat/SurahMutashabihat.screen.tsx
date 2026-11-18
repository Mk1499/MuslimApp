import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import EmptyList from '@/components/common/EmptyList/EmptyList.comp';
import React, { useEffect } from 'react';
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
import { useAnalytics, EVENTS } from '@/hooks/useAnalytics';

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
    isError,
    error,
  } = useSurahMutashabihatQuery(number);
  const { trackEvent } = useAnalytics();

  const verses =
    mutashabihatData?.pages.flatMap(page => page.data.verses) ?? [];

  function loadNextPage() {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

  useEffect(() => {
    if (isError && JSON.parse(JSON.stringify(error)).status !== 404) {
      trackEvent(
        EVENTS.General_API_ERROR,
        {
          error: error?.message ?? 'Unknown error',
          context: 'SurahMutashabihat',
          surahNumber: number,
        },
        true,
        t('appMessages.error'),
      );
    }
  }, [isError, error]);

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
