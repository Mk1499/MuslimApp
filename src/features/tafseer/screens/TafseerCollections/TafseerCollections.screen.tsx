import { Pressable, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppGradient,
  AppIcon,
  AppText,
  Screen,
} from '@/components/ui';
import CommonListItem from '@/components/common/CommonListItem/CommonListItem.comp';
import { useTranslation } from 'react-i18next';
import { AppStackParamList } from '@/navigation/types';
import useTafseerData from '@/hooks/queries/useTafseetData';
import { Tafseer } from '@/types/tafseer.types';
import { isRTL } from '@/utils/constants';
import makeStyles from './styles';
import { useTheme } from '@/theme';
import SurahListView from '@/features/quran/screens/QuranDB/Views/SurahsList/SurahList.view';
import { Surah } from '@/types/surah';

export default function TafseerCollectionsScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const { tafseerCollectionsQuery } = useTafseerData();
  const {
    data: tafseerCollectionsData,
    isLoading,
    isError,
    error,
  } = tafseerCollectionsQuery;
  const collections = isRTL
    ? tafseerCollectionsData?.filter(item => item?.language === 'ar') ?? []
    : tafseerCollectionsData?.filter(item => item?.language === 'en') ?? [];
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Tafseer | null>(
    null,
  );

  const bottomSheetRef = React.useRef<AppBottomSheetRef>(null);

  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

  useEffect(() => {
    if (isError) {
      console.error('Error fetching Tafseer collections : ', error);
    }
  }, [isError]);

  useEffect(() => {
    if (collections?.length > 0 && !selectedCollection) {
      setSelectedCollection(collections?.[0] ?? null);
    }
  }, [collections]);

  function handleItemPress(item: Tafseer) {
    setSelectedCollection(item);
    bottomSheetRef.current?.dismiss();
  }

  function handleChooseSurah(surah: Surah) {
    console.log('Chosen Surah: ', surah);
    alert(`Chosen Surah: ${surah.name_english ?? surah.name_arabic ?? ''}`);
  }

  return (
    <Screen
      isInnerPage
      isLoading={isLoading}
      //   scroll
      screenTitle={t('tafseer.screenName')}
    >
      <AppGradient style={styles.tafseerHead}>
        <Pressable
          style={styles.tafseerBtn}
          onPress={() => bottomSheetRef.current?.present()}
        >
          <AppText style={styles.tafseerName}>
            {selectedCollection?.name ?? ''}
          </AppText>
          <AppIcon
            name="chevron-down"
            as="Feather"
            size={30}
            color={theme.basic.white}
          />
        </Pressable>
      </AppGradient>
      <View style={styles.surahListView}>
        <SurahListView onPressItem={handleChooseSurah} />
      </View>

      <AppBottomSheet
        ref={bottomSheetRef}
        snapPoints={['50%', '70%']}
        onDismiss={() => setIsBottomSheetVisible(false)}
        scrollable={true}
      >
        <BottomSheetFlatList
          data={collections}
          keyExtractor={item => item.id?.toString() ?? ''}
          renderItem={({ item }) => (
            <CommonListItem
              title={item?.name ?? item?.book_name ?? ''}
              subtitle={item?.book_name}
              onPress={() => handleItemPress(item)}
              withChevron={true}
              icon={<AppIcon name="book" as="Feather" />}
            />
          )}
        />
      </AppBottomSheet>
    </Screen>
  );
}
