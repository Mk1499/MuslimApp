import { View, Text, Image } from 'react-native';
import React from 'react';
import makeStyle from './styles';
import { useTheme } from '@/theme/ThemeProvider';
import { AppIcon, AppText, AppTouchable } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { MinaretImage, QuranImage } from '@/assets/images';

export default function FastAction() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.lastReadCont}>
        <View style={styles.lastReadData}>
          <AppText style={styles.lastReadLabel}>{t('lastRead.title')}</AppText>
          <View style={styles.lastReadRow}>
            <AppIcon name="book" size={24} color={theme.tabBar.active} />
            <AppText style={styles.surahName}>Al Baqara : 120</AppText>
            <View style={styles.juzCont}>
              <AppText style={styles.juzName}>Juz 2</AppText>
            </View>
          </View>
          <AppTouchable style={styles.continueBtn} onPress={() => {}}>
            <AppText style={styles.continueBtnText}>
              {t('common.continue')}
            </AppText>
          </AppTouchable>
        </View>
        <Image source={QuranImage} style={styles.bgImg} />
      </View>
    </View>
  );
}
