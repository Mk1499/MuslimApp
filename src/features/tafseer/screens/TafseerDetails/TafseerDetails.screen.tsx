import { View, Text, FlatList } from 'react-native';
import AppDropDown from '@/components/ui/AppDropDown';
import { AppIcon } from '@/components/ui/AppIcon';
import React, { useEffect, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { Surah } from '@/types/surah';
import { Tafseer } from '@/types/tafseer.types';
import TafseerCard from '../../components/TafseerCard/TafseerCard.comp';

export default function TafseerDetailsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles();
  const { params } =
    useRoute<RouteProp<TafseerStackParamList, 'tafseerDetails'>>();
  const { tafseer, surah } = params;
  const [selectedSurah, setSelectedSurah] = React.useState<Surah>(surah);
  const [selectedTafseer, setSelectedTafseer] =
    React.useState<Tafseer>(tafseer);
  const [fullSurahTafseer, setFullSurahTafseer] = React.useState<any[]>([]);
  const [tafseerLoading, setTafseerLoading] = React.useState(false);

  const { getLocalizedText } = useFormatter();
  const { listSurahsQuery } = useQuranData();
  const { data: surahsData } = listSurahsQuery ?? {};
  const { tafseerCollectionsQuery, getFullSurahTafseer } = useTafseerData();
  const { data: tafseerCollectionsData, isLoading: tafseerCollectionsLoading } =
    tafseerCollectionsQuery ?? {};

  const surahs: CommonListItemProps[] = useMemo(() => {
    return (
      surahsData?.data?.surahs?.map(surah => ({
        id: surah.number?.toString(),
        title: getLocalizedText(surah.name_arabic, surah.name_english),
        icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
        value: surah.verses_count?.toString(),
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

  useEffect(() => {
    const fetchFullSurahTafseer = async () => {
      setTafseerLoading(true);
      const fullSurahTafseerData = await getFullSurahTafseer(
        selectedSurah.number,
        selectedSurah.verses_count ?? 1,
        selectedTafseer.id,
      )?.finally(() => setTafseerLoading(false));
      setFullSurahTafseer(fullSurahTafseerData as any[]);
    };
    fetchFullSurahTafseer();
  }, [selectedSurah.number, selectedSurah.verses_count, selectedTafseer.id]);

  function renderHeader() {
    return (
      <View style={styles.headCont}>
        <AppDropDown
          preLabel={t('common.surah')}
          placeholder={t('tafseer.selectSurah')}
          options={surahs ?? []}
          preSelectedOption={{
            id: selectedSurah.number?.toString(),
            title: getLocalizedText(
              selectedSurah.name_arabic ?? '',
              selectedSurah.name_english ?? '',
            ),
            icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
          }}
          onSelectOption={option => {
            console.log({ option });
            setSelectedSurah({
              number: parseInt(option.id ?? '0', 10),
              name_arabic: option.title,
              name_english: option.title,
              verses_count: option.value ?? 1,
            });
          }}
        />
        <AppDropDown
          placeholder={t('tafseer.selectTafseer')}
          options={tafseerCollections ?? []}
          preSelectedOption={{
            id: selectedTafseer.id?.toLocaleString(),
            title: selectedTafseer.name ?? selectedTafseer.book_name,
            icon: <AppIcon name="book" size={24} color={theme.tabBar.active} />,
          }}
          onSelectOption={option => setSelectedTafseer(option)}
        />
      </View>
    );
  }

  const isLoading = tafseerCollectionsLoading || tafseerLoading;
  return (
    <Screen
      isInnerPage
      padded
      screenTitle={t('tafseer.screenName')}
      isLoading={isLoading}
    >
      {renderHeader()}
      <FlatList
        data={fullSurahTafseer}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TafseerCard text={item.text} tafsir={item.tafsir} />
        )}
        style={styles.list}
      />
    </Screen>
  );
}
