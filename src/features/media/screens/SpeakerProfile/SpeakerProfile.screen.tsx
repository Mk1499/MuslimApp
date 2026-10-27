import { View } from 'react-native';
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppIcon, AppText, AppTouchable, Screen } from '@/components/ui';
import { MediaStackParamList } from '@/navigation/stacks/mediaStack';
import ScreenNames from '@/navigation/ScreenNames';
import makeStyles from './styles';
import { spacing, useTheme } from '@/theme';
import AppImage from '@/components/ui/AppImage';
import useFormatter from '@/hooks/useFormatter';
import { isRTL } from '@/utils/constants';
import { useTranslation } from 'react-i18next';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import LatestVideosView from './Views/LatestVideos/LatestVideos.view';
import PopularVideosView from './Views/PopularVideos/PopularVideos.view';

export default function SpeakerProfile() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { goBack } = useNavigation();
  const { params } =
    useRoute<RouteProp<MediaStackParamList, ScreenNames.SpeakerProfile>>();
  const { speaker } = params ?? {};
  const { name, imageUrl, nameAr, nameEn, bio, bioAr, bioEn, views, _id } =
    speaker ?? {};
  const { getLocalizedText } = useFormatter();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSegmentChange = (index: number) => {
    setSelectedIndex(index);
  };

  function renderMetaItem(label: string, value: number | string) {
    return (
      <View style={styles.metaCont}>
        <AppText style={styles.metaTitle}>{label}</AppText>
        <AppText style={styles.metaValue}>{value}</AppText>
      </View>
    );
  }

  const listHeader = (
    <>
      <AppTouchable
        variant="ghost"
        onPress={goBack}
        hitSlop={spacing.md}
        style={styles.backBtn}
      >
        <AppIcon
          name={isRTL ? 'chevron-forward' : 'chevron-back'}
          color={theme.basic.white}
          size={30}
        />
      </AppTouchable>
      <View style={styles.bgCover} />
      <View style={styles.dataCont}>
        <AppImage source={{ uri: imageUrl }} style={styles.image} />
        <AppText variant="title" style={styles.name}>
          {getLocalizedText(nameAr, nameEn) || name}
        </AppText>
        <View style={styles.rowCont}>
          {renderMetaItem(t('media.videos'), 222)}
          <View style={styles.colLine} />
          {renderMetaItem(t('media.likes'), 222)}
          <View style={styles.colLine} />
          {renderMetaItem(t('media.disLike'), 222)}
          <View style={styles.colLine} />
          {renderMetaItem(t('media.views'), views ?? 0)}
        </View>
        <AppText style={styles.bio} variant="caption">
          {getLocalizedText(bioAr, bioEn) || bio}
        </AppText>
      </View>
      <View style={styles.segmentCont}>
        <SegmentedControl
          values={[t('media.latestVideos'), t('media.mostViewedVideos')]}
          selectedIndex={selectedIndex}
          onChange={event =>
            handleSegmentChange(event.nativeEvent.selectedSegmentIndex)
          }
          style={styles.viewCont}
          fontStyle={styles.segmentText}
          activeFontStyle={styles.activeSegment}
          direction={isRTL ? 'rtl' : 'ltr'}
        />
      </View>
    </>
  );

  return (
    <Screen
      topSafeAreaStyle={styles.topSafeAreaStyle}
      scroll={false}
      withBottomSafeArea={false}
    >
      {selectedIndex === 0 ? (
        <LatestVideosView speakerId={_id as string} ListHeaderComponent={listHeader} />
      ) : (
        <PopularVideosView speakerId={_id as string} ListHeaderComponent={listHeader} />
      )}
    </Screen>
  );
}
