import React from 'react';
import { useTranslation } from 'react-i18next';
import { Screen, AppText } from '@/components/ui';
import ListSurahsView from './Views/SurahsList/SurahList.view';
import LastReadQuran from '@/features/home/components/LastReadQuran/LastReadQuran.comp';
import { useTheme } from '@/theme';
import makeStyle from './styles';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function QuranScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen padded>
      <AppText style={styles.screenTitle} variant="title">
        {t('quran.title')}
      </AppText>

      <LastReadQuran />

      <View style={styles.listCont}>
        <ListSurahsView />
      </View>
    </Screen>
  );
}
