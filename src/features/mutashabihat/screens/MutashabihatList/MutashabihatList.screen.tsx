import { View, Text } from 'react-native';
import React from 'react';
import { Surah } from '@/types/surah';
import { AppText, Screen } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import SurahListView from '@/features/quran/screens/QuranDB/Views/SurahsList/SurahList.view';
import useStyles from './styles';
import { useTheme } from '@/theme';

export default function MutashabihatList() {
  const { t } = useTranslation();
  const themes = useTheme();
  const styles = useStyles(themes);

  function handleChooseSurah(surah: Surah) {
    // Handle the selection of a Surah here
  }

  return (
    <Screen isInnerPage screenTitle={t('home.features.mutashabihat')} padded>
      <View style={styles.surahListView}>
        <SurahListView onPressItem={handleChooseSurah} />
      </View>
    </Screen>
  );
}
