import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IProps } from './types';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';
import SurahListItem from './SurahListItem/SurahListItem.comp';
import makeStyle from './styles';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';
import ScreenNames from '@/navigation/ScreenNames';
import StackNames from '@/navigation/StackNames';
import quranSurahs from '@/assets/offline-res/quran-surahs.json';
import type { Surah } from '@/types/surah';

const surahs: Surah[] = quranSurahs.map(surah => ({
  number: surah.id,
  name_arabic: surah.name_arabic,
  name_english: surah.name_simple,
  name_complex: surah.name_complex,
  name_translation: surah.translated_name.name,
  revelation_place: surah.revelation_place,
  revelation_order: surah.revelation_order,
  bismillah_pre: surah.bismillah_pre,
  verses_count: surah.verses_count,
  pages: surah.pages,
}));

export default function SurahListView({ onPressItem }: IProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const { navigate } = useNavigation<any>();

  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        surah =>
          surah?.name_arabic
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          surah?.name_english
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          surah?.name_translation
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, surahs],
  );

  return (
    <View style={styles.container}>
      <SearchInput
        placeholder={t('quran.searchPlaceholder')}
        onChangeText={setSearchQuery}
      />
      {filteredSurahs.length === 0 ? (
        <View style={styles.centered}>
          <AppText color="secondary">{t('quran.empty')}</AppText>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.listContent}
          data={filteredSurahs}
          keyExtractor={item => item.number.toString()}
          renderItem={({ item }) => (
            <SurahListItem
              surah={item}
              onPress={() => {
                if (onPressItem) {
                  onPressItem(item);
                } else {
                  navigate(StackNames.Quran, {
                    screen: ScreenNames.Mushaf,
                    params: {
                      surah: item,
                    },
                  });
                }
              }}
            />
          )}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
