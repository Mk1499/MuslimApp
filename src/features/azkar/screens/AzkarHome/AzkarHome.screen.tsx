import React from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  AppCard,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '@/components/ui';
import type { AzkarStackParamList } from '@/navigation/stacks/azkarStack';
import ScreenNames from '@/navigation/ScreenNames';
import { useAzkarFavoritesStore } from '@/store/useAzkarFavoritesStore';
import { useTheme } from '@/theme';
import makeStyles from './styles';
import { isRTL } from '@/utils/constants';

export default function AzkarHomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { navigate } = useNavigation<NavigationProp<AzkarStackParamList>>();
  const favoriteCount = useAzkarFavoritesStore(
    state => Object.keys(state.favorites).length,
  );

  return (
    <Screen
      isInnerPage
      screenTitle={t('azkar.screenName')}
      withBGPattern={false}
    >
      <View style={styles.content}>
        <AppText variant="subtitle" style={styles.heading}>
          {t('azkar.homeTitle')}
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          {t('azkar.homeSubtitle')}
        </AppText>

        <AppCard padded={false} style={styles.optionsCard}>
          <AppTouchable
            variant="ghost"
            onPress={() => navigate(ScreenNames.AzkarFavorites)}
            accessibilityRole="button"
            style={styles.optionTouchable}
          >
            <View style={styles.optionRow}>
              <View style={styles.favoriteIcon}>
                <AppIcon name="heart" size={22} color={theme.status.error} />
              </View>
              <View style={styles.optionCopy}>
                <AppText
                  variant="body"
                  weight="semiBold"
                  style={styles.optionTitle}
                >
                  {t('azkar.favoriteAzkar')}
                </AppText>
                <AppText variant="caption" style={styles.optionSubtitle}>
                  {t('azkar.favoriteCount', { count: favoriteCount })}
                </AppText>
              </View>
              <AppIcon
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color={theme.text.muted}
              />
            </View>
          </AppTouchable>
          <View style={styles.divider} />
          <AppTouchable
            variant="ghost"
            onPress={() => navigate(ScreenNames.AzkarCollections)}
            accessibilityRole="button"
            style={styles.optionTouchable}
          >
            <View style={styles.optionRow}>
              <View style={styles.allIcon}>
                <AppIcon
                  name="book-outline"
                  size={22}
                  color={theme.text.brand}
                />
              </View>
              <View style={styles.optionCopy}>
                <AppText
                  variant="body"
                  weight="semiBold"
                  style={styles.optionTitle}
                >
                  {t('azkar.allAzkar')}
                </AppText>
                <AppText variant="caption" style={styles.optionSubtitle}>
                  {t('azkar.allAzkarSubtitle')}
                </AppText>
              </View>
              <AppIcon
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color={theme.text.muted}
              />
            </View>
          </AppTouchable>
        </AppCard>
      </View>
    </Screen>
  );
}
