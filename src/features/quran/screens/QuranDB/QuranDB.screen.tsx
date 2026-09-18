import React from 'react';
import { useTranslation } from 'react-i18next';
import { Screen, AppText } from '@/components/ui';
import ListSurahsView from './Views/SurahsList/SurahList.view';
import LastReadQuran from '@/features/home/components/LastReadQuran/LastReadQuran.comp';
import { useTheme } from '@/theme';
import makeStyle from './styles';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';
import { View } from 'react-native';

export function QuranScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen padded>
      <AppText style={styles.screenTitle} variant="title">
        {t('quran.title')}
      </AppText>
      {/* <SearchInput
        containerStyle={styles.searchInputContainer}
        placeholder={t('quran.searchPlaceholder')}
      /> */}
      <LastReadQuran />

      <View style={styles.listCont}>
        <ListSurahsView />
      </View>
    </Screen>
  );
}
