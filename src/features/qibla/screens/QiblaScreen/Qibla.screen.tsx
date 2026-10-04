import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui';
import CompassDial from '../../components/CompassDial/CompassDial.comp';
import GuidanceFooter from '../../components/GuidanceFooter/GuidanceFooter.comp';
import { useQiblaBearing } from '../../hooks/useQiblaBearing';
import { useQiblaGuidance } from '../../hooks/useQiblaGuidance';
import { DIAL_MAX_SIZE, DIAL_WIDTH_RATIO } from '../../qibla.constants';
import makeStyles from './styles';

export default function QiblaScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const styles = makeStyles();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();

  const { bearing, distanceKm, status, retry } = useQiblaBearing();
  const { rotation, offset, aligned, supported } = useQiblaGuidance(
    bearing,
    isFocused,
  );

  const message = useMemo(() => {
    if (!supported) {
      return t('qibla.noCompass');
    }
    if (offset === null) {
      if (status === 'denied') {
        return t('qibla.permissionDenied');
      }
      if (status === 'error') {
        return t('qibla.locationError');
      }
      return t('qibla.locating');
    }
    if (aligned) {
      return t('qibla.aligned');
    }
    const degrees = Math.round(Math.abs(offset));
    return offset > 0
      ? t('qibla.turnRight', { degrees })
      : t('qibla.turnLeft', { degrees });
  }, [t, supported, offset, status, aligned]);

  const dialSize = Math.min(width * DIAL_WIDTH_RATIO, DIAL_MAX_SIZE);
  const canRetry =
    bearing === null && (status === 'denied' || status === 'error');

  return (
    <Screen
      isInnerPage
      withBGPattern={false}
      screenTitle={t('qibla.title')}
      isLoading={status === 'loading' && bearing === null}
    >
      <View style={styles.dialArea}>
        <CompassDial
          size={dialSize}
          rotation={rotation}
          bearing={bearing}
          aligned={aligned}
        />
      </View>

      <GuidanceFooter
        message={message}
        offset={offset}
        bearing={bearing}
        distanceKm={distanceKm}
        aligned={aligned}
        canRetry={canRetry}
        onRetry={retry}
      />
    </Screen>
  );
}
