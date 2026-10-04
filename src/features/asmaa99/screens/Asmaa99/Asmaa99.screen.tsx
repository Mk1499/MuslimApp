import React, { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui';
import asmaa99 from '@/assets/offline-res/asmaa99.json';
import type { DivineName } from '@/types/asmaa';
import NameCard from '../../components/NameCard/NameCard.comp';
import makeStyles from './styles';

const NAMES: DivineName[] = asmaa99.data;

export default function Asmaa99(): React.JSX.Element {
  const { t } = useTranslation();
  const styles = makeStyles();

  const renderItem = useCallback<ListRenderItem<DivineName>>(
    ({ item }) => <NameCard name={item} />,
    [],
  );

  return (
    <Screen isInnerPage screenTitle={t('home.features.99Names')} padded>
      <FlatList
        data={NAMES}
        keyExtractor={item => String(item.number)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        numColumns={3}
      />
    </Screen>
  );
}
