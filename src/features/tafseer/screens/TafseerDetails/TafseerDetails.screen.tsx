import { View, Text } from 'react-native';
import AppDropDown from '@/components/ui/AppDropDown';
import { AppIcon } from '@/components/ui/AppIcon';
import React, { useMemo } from 'react';
import makeStyles from './styles';
import { Screen } from '@/components/ui';
import useQuranData from '@/hooks/queries/useQuranData';
import { CommonListItemProps } from '@/components/common/CommonListItem/type';
import useFormatter from '@/hooks/useFormatter';
import { useTheme } from '@/theme';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TafseerStackParamList } from '@/navigation/stacks/tafseerStack';
import useTafseerData from '@/hooks/queries/useTafseetData';
import { isRTL } from '@/utils/constants';

export default function TafseerDetailsScreen() {
  const theme = useTheme();
  const styles = makeStyles();
  const { params } =
    useRoute<RouteProp<TafseerStackParamList, 'tafseerDetails'>>();
  const { tafseer, surah } = params;

  const { getLocalizedText } = useFormatter();
  const { listSurahsQuery } = useQuranData();
  const { data: surahsData } = listSurahsQuery ?? {};
  const { tafseerCollectionsQuery } = useTafseerData();
  const { data: tafseerCollectionsData } = tafseerCollectionsQuery ?? {};

  const surahs: CommonListItemProps[] = useMemo(() => {
    return (
      surahsData?.data?.surahs?.map(surah => ({
        id: surah.number?.toString(),
        title: getLocalizedText(surah.name_arabic, surah.name_english),
        icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
      })) ?? []
    );
  }, [surahsData?.data?.surahs]);

  const collections = isRTL
    ? tafseerCollectionsData?.filter(item => item?.language === 'ar') ?? []
    : tafseerCollectionsData?.filter(item => item?.language === 'en') ?? [];

  const tafseerCollections: CommonListItemProps[] = useMemo(() => {
    return (
      collections?.map(tafseer => ({
        id: tafseer.id?.toString(),
        title: tafseer.name ?? tafseer.book_name,
        icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
      })) ?? []
    );
  }, [collections]);

  return (
    <Screen isInnerPage padded>
      <View style={styles.headCont}>
        <AppDropDown
          placeholder="Select Surah"
          options={surahs ?? []}
          preSelectedOption={{
            id: surah.number?.toString(),
            title: getLocalizedText(surah.name_arabic, surah.name_english),
            icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
          }}
        />
        <AppDropDown
          placeholder="Select Tafseer"
          options={tafseerCollections ?? []}
          preSelectedOption={{
            id: tafseer.id?.toLocaleString(),
            title: tafseer.name ?? tafseer.book_name,
            icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
          }}
        />
      </View>
    </Screen>
  );
}
