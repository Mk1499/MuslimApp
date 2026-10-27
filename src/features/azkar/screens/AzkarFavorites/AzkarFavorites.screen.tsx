import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/ui';
import AzkarCard from '@/features/azkar/components/AzkarCard/AzkarCard.comp';
import { useAzkarFavoritesStore } from '@/store/useAzkarFavoritesStore';
import { useTheme } from '@/theme';
import makeStyles from './styles';

export default function AzkarFavoritesScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const styles = makeStyles(useTheme());
  const favorites = useAzkarFavoritesStore(state => state.favorites);
  const favoriteItems = useMemo(() => Object.values(favorites), [favorites]);

  return (
    <Screen isInnerPage screenTitle={t('azkar.favoriteAzkar')} scroll={false} padded>
      <FlatList
        data={favoriteItems}
        keyExtractor={item => String(item.ID)}
        renderItem={({ item }) => (
          <AzkarCard item={item} category={item.category} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText variant="subtitle" style={styles.emptyTitle}>{t('azkar.noFavoritesTitle')}</AppText>
            <AppText variant="caption" style={styles.emptySubtitle}>{t('azkar.noFavoritesSubtitle')}</AppText>
          </View>
        }
      />
    </Screen>
  );
}
