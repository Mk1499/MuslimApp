import { View, Text } from 'react-native';
import React from 'react';
import { Surah } from '@/types/surah';
import { AppText, Screen } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import SurahListView from '@/features/quran/screens/QuranDB/Views/SurahsList/SurahList.view';
import useStyles from './styles';
import { useTheme } from '@/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MutashabihatStackParamList } from '@/navigation/stacks/mutashabihatStack';
import ScreenNames from '@/navigation/ScreenNames';

export default function MutashabihatList() {
  const { t } = useTranslation();
  const themes = useTheme();
  const styles = useStyles(themes);
  const { navigate } =
    useNavigation<
      NavigationProp<MutashabihatStackParamList, ScreenNames.SurahMutashabihat>
    >();

  function handleChooseSurah(surah: Surah) {
    // Handle the selection of a Surah here
    navigate(ScreenNames.SurahMutashabihat, { surah });
  }

  return (
    <Screen isInnerPage screenTitle={t('home.features.mutashabihat')} padded>
      <View style={styles.surahListView}>
        <SurahListView onPressItem={handleChooseSurah} />
      </View>
    </Screen>
  );
}
