import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { AppText, Screen } from '@/components/ui';
import SearchInput from '@/components/common/SearchInput/SearchInput.comp';
import SpeakerCard from '@/features/media/components/SpeakerCard/SpeakerCard.comp';
import useMediaData from '@/hooks/queries/useMediaData';
import { useTheme } from '@/theme';
import makeStyles from './styles';
import ScreenNames from '@/navigation/ScreenNames';

export default function AllSpeakers() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { useAllSpeakersQuery } = useMediaData();
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllSpeakersQuery();
  const hasScrolled = useRef(false);
  const requestInFlight = useRef(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const speakers = data?.pages.flatMap(page => page.data) ?? [];

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    navigation.navigate(ScreenNames.MediaSearchResults, { query });
  };

  const loadNextPage = useCallback(() => {
    if (
      !hasScrolled.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      requestInFlight.current
    ) {
      return;
    }

    requestInFlight.current = true;
    fetchNextPage().finally(() => {
      requestInFlight.current = false;
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Screen
      isInnerPage
      screenTitle={t('media.allSpeakers')}
      scroll={false}
      withBottomSafeArea={false}
    >
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('media.searchSpeakers')}
          onClear={() => setSearchQuery('')}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
        />
      </View>
      <FlatList
        data={speakers}
        style={{ flex: 1 }}
        numColumns={3}
        keyExtractor={speaker => speaker._id}
        renderItem={({ item }) => (
          <View style={styles.speakerCell}>
            <SpeakerCard speaker={item} />
          </View>
        )}
        columnWrapperStyle={styles.speakerRow}
        contentContainerStyle={styles.listContent}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y > 0) hasScrolled.current = true;
        }}
        scrollEventThrottle={16}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            colors={[theme.background.brand]}
            onRefresh={() => {
              hasScrolled.current = false;
              refetch();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator color={theme.text.brand} />
            ) : (
              <AppText style={styles.emptyText}>
                {isError ? t('media.speakersLoadError') : t('common.noData')}
              </AppText>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size={36}
              color={theme.text.brand}
              style={styles.footerLoader}
            />
          ) : undefined
        }
      />
    </Screen>
  );
}
