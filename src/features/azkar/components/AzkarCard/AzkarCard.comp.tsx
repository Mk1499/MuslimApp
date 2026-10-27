import { View } from 'react-native';
import React from 'react';
import makeStyle from './styles';
import { IProps } from './type';
import { AppCard, AppIcon, AppText, AppTouchable } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useAzkarFavoritesStore } from '@/store/useAzkarFavoritesStore';

export default function AzkarCard({ item, category }: IProps) {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const { ARABIC_TEXT: arabic, ID, REPEAT } = item ?? {};
  const isFavorite = useAzkarFavoritesStore(state => state.isFavorite(ID));
  const toggleFavorite = useAzkarFavoritesStore(state => state.toggleFavorite);

  return (
    <AppCard
      style={styles.container}
    >
      <AppText style={styles.hadithText}>{arabic}</AppText>
      {!!category && (
        <View style={styles.categoryRow}>
          <AppText style={styles.categoryLabel}>{t('azkar.category')}:</AppText>
          <AppText style={styles.categoryText}>{category}</AppText>
        </View>
      )}
      <View style={styles.headerRow}>
        <AppText style={styles.rawyAuthorText}>{`${t('azkar.repeat')} : ${
          REPEAT ?? 1
        }`}</AppText>
        <AppTouchable
          variant="ghost"
          onPress={() => toggleFavorite(item, category)}
          accessibilityRole="button"
          accessibilityLabel={t(isFavorite ? 'azkar.removeFavorite' : 'azkar.addFavorite')}
          style={styles.favoriteButton}
        >
          <AppIcon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? theme.status.error : theme.text.secondary}
          />
        </AppTouchable>
      </View>
    </AppCard>
  );
}
