import React from 'react';
import { Pressable, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppIcon, AppText, AppTouchable, Screen } from '@/components/ui';
import AppImage from '@/components/ui/AppImage';
import { MediaStackParamList } from '@/navigation/stacks/mediaStack';
import ScreenNames from '@/navigation/ScreenNames';
import { spacing, useTheme } from '@/theme';
import useFormatter from '@/hooks/useFormatter';
import { isRTL } from '@/utils/constants';
import { useTranslation } from 'react-i18next';
import makeStyles from './styles';
import LatestVideosView from './Views/LatestVideos/LatestVideos.view';
import PopularVideosView from './Views/PopularVideos/PopularVideos.view';

export default function SpeakerProfile() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { goBack } = useNavigation();
  const { params } =
    useRoute<RouteProp<MediaStackParamList, ScreenNames.SpeakerProfile>>();
  const speaker = params?.speaker;
  const { getLocalizedText } = useFormatter();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const tabs = [
    { id: 'latest', label: t('media.latestVideos') },
    { id: 'popular', label: t('media.mostViewedVideos') },
  ] as const;
  const activeTab = tabs[selectedIndex] ?? tabs[0];
  const speakerName =
    getLocalizedText(speaker?.nameAr, speaker?.nameEn) || speaker?.name || '';
  const speakerBio =
    getLocalizedText(speaker?.bioAr, speaker?.bioEn) || speaker?.bio || '';

  const profileHeader = (
    <View style={styles.profileHeader}>
      <View style={styles.bgCover} />
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
      <View style={styles.dataCont}>
        <AppImage source={{ uri: speaker?.imageUrl }} style={styles.image} />
        <AppText variant="title" style={styles.name}>
          {speakerName}
        </AppText>
        <AppText style={styles.views} variant="caption">
          {`${(speaker?.views ?? 0).toLocaleString()} ${t('media.views')}`}
        </AppText>
        {!!speakerBio && (
          <AppText style={styles.bio} variant="caption" numberOfLines={4}>
            {speakerBio}
          </AppText>
        )}
      </View>
    </View>
  );

  const stickyTabs = (
    <View style={styles.stickyHeader}>
      <View style={styles.segmentCont}>
        {tabs.map((tab, index) => (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedIndex === index }}
            onPress={() => setSelectedIndex(index)}
            style={styles.tabButton}
          >
            <AppText
              style={[
                styles.tabText,
                selectedIndex === index ? styles.selectedTabText : undefined,
              ]}
            >
              {tab.label}
            </AppText>
            {selectedIndex === index && <View style={styles.tabIndicator} />}
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <Screen
      topSafeAreaStyle={styles.topSafeAreaStyle}
      scroll={false}
      withBottomSafeArea={false}
    >
      {activeTab.id === 'latest' ? (
        <LatestVideosView
          speakerId={speaker?._id ?? ''}
          ListHeaderComponent={profileHeader}
          StickyHeaderComponent={stickyTabs}
        />
      ) : (
        <PopularVideosView
          speakerId={speaker?._id ?? ''}
          ListHeaderComponent={profileHeader}
          StickyHeaderComponent={stickyTabs}
        />
      )}
    </Screen>
  );
}
