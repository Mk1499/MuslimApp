import { Image, Pressable, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyle from './style';
import { IProps } from './types';
import useFormatter from '@/hooks/useFormatter';
import { MadinahImage, MekkahImage } from '@/assets/images';

export default function SurahListItem({ surah, onPress }: IProps) {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const { getLocalizedText } = useFormatter();
  const isMakkah = surah.revelation_place === 'makkah';

  return (
    <Pressable
      onPress={() => onPress?.(surah)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>{surah.number}</AppText>
        </View>
        <View>
          <AppText
            style={styles.arabicName}
            variant="subtitle"
            numberOfLines={1}
          >
            {getLocalizedText(surah.name_arabic, surah.name_english)}
          </AppText>

          <AppText style={styles.meta} variant="caption" color="secondary">
            {surah.verses_count} {t('quran.ayahs')}
          </AppText>
        </View>
      </View>
      <View style={styles.placeCont}>
        <Image
          style={styles.placeImg}
          source={isMakkah ? MekkahImage : MadinahImage}
        />
        <AppText style={styles.placeName}>
          {t(isMakkah ? 'quran.makkah' : 'quran.madinah')}
        </AppText>
      </View>
    </Pressable>
  );
}
