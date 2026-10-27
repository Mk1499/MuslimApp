import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  AppCard,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '@/components/ui';
import type { AppStackParamList } from '@/navigation/types';
import ScreenNames from '@/navigation/ScreenNames';
import StackNames from '@/navigation/StackNames';
import { getSurahByNumber } from '@/features/quran/player/ayahSequence';
import { useSavedAyahsStore } from '@/store/useSavedAyahsStore';
import { useTheme } from '@/theme';
import makeStyles from './styles';

export default function SavedAyahsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { params } =
    useRoute<RouteProp<AppStackParamList, ScreenNames.SavedAyahs>>();
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const bookmarks = useSavedAyahsStore(state => state.bookmarks);
  const favorites = useSavedAyahsStore(state => state.favorites);
  const removeBookmark = useSavedAyahsStore(state => state.removeBookmark);
  const removeFavorite = useSavedAyahsStore(state => state.removeFavorite);
  const records = params.kind === 'bookmarks' ? bookmarks : favorites;
  const items = useMemo(
    () => Object.values(records).sort((a, b) => b.page - a.page),
    [records],
  );
  const isBookmarkList = params.kind === 'bookmarks';

  return (
    <Screen
      isInnerPage
      screenTitle={t(
        isBookmarkList ? 'settings.bookmarks' : 'settings.favoriteAyahs',
      )}
      scroll={false}
      padded
      withBGPattern={false}
    >
      <FlatList
        data={items}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AppCard padded={false} style={styles.ayahCard}>
            <View style={styles.ayahRow}>
              <AppTouchable
                variant="ghost"
                style={styles.openAyah}
                onPress={() => {
                  const surah = getSurahByNumber(item.surahNumber);
                  if (!surah) return;
                  navigate(StackNames.Quran, {
                    screen: ScreenNames.Mushaf,
                    params: { surah, initialPage: item.page },
                  });
                }}
              >
                <AppText style={styles.arabicText}>{item.arabic}</AppText>
                <AppText variant="caption" style={styles.ayahCaption}>
                  {item.surahNameArabic} · {item.surahNameEnglish} ·{' '}
                  {item.ayahNumber}
                </AppText>
              </AppTouchable>
              <AppTouchable
                variant="ghost"
                accessibilityRole="button"
                accessibilityLabel={t('common.remove')}
                onPress={() =>
                  isBookmarkList
                    ? removeBookmark(item.key)
                    : removeFavorite(item.key)
                }
                style={styles.removeButton}
              >
                <AppIcon
                  name="trash-outline"
                  size={20}
                  color={theme.status.error}
                />
              </AppTouchable>
            </View>
          </AppCard>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppIcon
              name={isBookmarkList ? 'bookmark-outline' : 'heart-outline'}
              size={34}
              color={theme.text.muted}
            />
            <AppText variant="body" style={styles.emptyText}>
              {t(
                isBookmarkList
                  ? 'settings.noBookmarks'
                  : 'settings.noFavoriteAyahs',
              )}
            </AppText>
          </View>
        }
      />
    </Screen>
  );
}
