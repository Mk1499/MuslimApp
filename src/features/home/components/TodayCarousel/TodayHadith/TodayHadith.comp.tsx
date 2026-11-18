import { View, Pressable } from 'react-native';
import NetworkFail from '@/components/common/NetworkFail/NetworkFail.comp';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import { useAppStore } from '@/store/useAppStore';
import useRandomData from '@/hooks/queries/useRandomData';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';
import useFormatter from '@/hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import {
  AppBottomSheet,
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/ui';

export default function TodayHadith() {
  const { getLocalizedText } = useFormatter();
  const { randomHadithQuery } = useRandomData();
  const { t, i18n } = useTranslation();
  const { isInternetConnected } = useAppStore();

  const { data } = randomHadithQuery;
  const { arabic, english, collection } = data?.data ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);
  const bottomSheetRef = React.useRef<AppBottomSheetRef>(null);

  if (!isInternetConnected)
    return <NetworkFail message={t('appMessages.netReqHadith')} />;

  return (
    <>
      <Pressable
        style={styles.container}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <AppText style={styles.basmala}>{'قال رسول الله ﷺ'}</AppText>
        <AppText style={styles.aya} numberOfLines={4}>
          {getLocalizedText(arabic ?? '', english ?? '')}
        </AppText>
        <AppText style={styles.surah} numberOfLines={1}>
          {i18n.exists(`hadith.collection.${collection}`)
            ? t(`hadith.collection.${collection}`)
            : collection}
        </AppText>
      </Pressable>

      <AppBottomSheet
        ref={bottomSheetRef}
        containerStyle={styles.sheetCont}
        snapPoints={['50%', '80%']}
      >
        <AppText style={styles.sheetText}>
          {getLocalizedText(arabic ?? '', english ?? '')}
        </AppText>
      </AppBottomSheet>
    </>
  );
}
