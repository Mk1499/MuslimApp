import React from 'react';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyle from './styles';
import LastReadSurahComp from '../../components/LastReadSurah/LastReadSurah.comp';

export function QuranScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen scroll padded>
      <LastReadSurahComp />
    </Screen>
  );
}
