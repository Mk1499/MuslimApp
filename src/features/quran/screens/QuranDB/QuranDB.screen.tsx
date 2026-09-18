import React from 'react';
import { useTranslation } from 'react-i18next';
import { Screen, AppText } from '@/components/ui';
import LastReadQuran from '@/features/home/components/LastReadQuran/LastReadQuran.comp';
import { useTheme } from '@/theme';
import makeStyle from './styles';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';

export function QuranScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen scroll padded>
      <AppText style={styles.screenTitle} variant="title">
        {t('quran.title')}
      </AppText>
      <SearchInput
        containerStyle={styles.searchInputContainer}
        placeholder={t('quran.searchPlaceholder')}
      />
      <LastReadQuran />
    </Screen>
  );
}
