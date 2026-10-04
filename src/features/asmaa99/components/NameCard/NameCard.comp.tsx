import React from 'react';
import { View } from 'react-native';
import { AppCard, AppText } from '@/components/ui';
import useFormatter from '@/hooks/useFormatter';
import { useTheme } from '@/theme';
import type { DivineName } from '@/types/asmaa';
import makeStyles from './styles';

interface NameCardProps {
  name: DivineName;
}

function NameCard({ name }: NameCardProps): React.JSX.Element {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { getLocalizedText, toArabicIndic } = useFormatter();

  return (
    <AppCard style={styles.card}>
      <AppText style={styles.name} numberOfLines={2} adjustsFontSizeToFit>
        {getLocalizedText(name.arabic, name.english)}
      </AppText>
    </AppCard>
  );
}

export default React.memo(NameCard);
