import { View, Image } from 'react-native';
import React from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import makeStyle from './styles';
import { useTheme } from '@/theme/ThemeProvider';
import { AppGradient, AppIcon, AppText, AppTouchable } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { QuranImage } from '@/assets/images';
import { useAppStore } from '@/store/useAppStore';
import {
  getSurahByNumber,
  PAGE_TO_FIRST_AYAH,
} from '@/features/quran/player/ayahSequence';
import ScreenNames from '@/navigation/ScreenNames';
import StackNames from '@/navigation/StackNames';
import type { AppStackParamList } from '@/navigation/types';

export default function LastReadQuran() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const language = useAppStore(state => state.language);
  const lastReadPage = useAppStore(state => state.lastReadPage);
  const lastPlayedAyah = useAppStore(state => state.lastPlayedAyah);
  // Keep older installs useful until the user opens a page with page tracking.
  const page = lastReadPage ?? lastPlayedAyah?.page;
  const firstAyahKey = page ? PAGE_TO_FIRST_AYAH.get(page) : undefined;
  const [surahNumber, ayahNumber] = firstAyahKey
    ? firstAyahKey.split(':').map(Number)
    : [];

  const surah = surahNumber ? getSurahByNumber(surahNumber) : undefined;

  // Nothing has been opened yet — there is nothing to continue.
  if (!page || !surah) {
    return null;
  }

  const surahName = language === 'ar' ? surah.name_arabic : surah.name_english;

  // Reopen the last viewed page without resuming audio playback.
  const handleContinue = () => {
    navigate(StackNames.Quran, {
      screen: ScreenNames.Mushaf,
      params: { surah, initialPage: page },
    });
  };

  return (
    <AppGradient
      colors={theme.gradient.scrim}
      start={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={styles.lastReadCont}>
        <View style={styles.lastReadData}>
          <AppText style={styles.lastReadLabel}>{t('lastRead.title')}</AppText>
          <View style={styles.lastReadRow}>
            <AppIcon name="book" size={24} color={theme.tabBar.active} />
            <AppText
              style={styles.surahName}
            >{`${surahName} : ${ayahNumber}`}</AppText>
            <View style={styles.pageCont}>
              <AppText style={styles.pageName}>{`${t(
                'lastRead.page',
              )} ${page}`}</AppText>
            </View>
          </View>
          <AppTouchable style={styles.continueBtn} onPress={handleContinue}>
            <AppText style={styles.continueBtnText}>
              {t('common.continue')}
            </AppText>
          </AppTouchable>
        </View>
        <Image source={QuranImage} style={styles.bgImg} />
      </View>
    </AppGradient>
  );
}
