import { View, ActivityIndicator, FlatList } from 'react-native';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useQuranData from '@/hooks/queries/useQuranData';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';
import SurahListItem from './SurahListItem/SurahListItem.comp';
import makeStyle from './styles';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';

export default function SurahListView() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { listSurahsQuery } = useQuranData();
  const { data: surahsList, isLoading, isError } = listSurahsQuery;
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.tabBar.active} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <AppText color="secondary">{t('quran.loadError')}</AppText>
      </View>
    );
  }

  const surahs = surahsList?.data.surahs ?? [];

  if (surahs.length === 0) {
    return (
      <View style={styles.centered}>
        <AppText color="secondary">{t('quran.empty')}</AppText>
      </View>
    );
  }

  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        surah =>
          surah.name_arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.name_english
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          surah.name_translation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, surahs],
  );

  return (
    <View style={styles.list}>
      <SearchInput
        placeholder={t('quran.searchPlaceholder')}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredSurahs}
        keyExtractor={item => item.number.toString()}
        renderItem={({ item }) => <SurahListItem surah={item} />}
      />
    </View>
  );
}
