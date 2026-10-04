import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppIcon, AppText, AppTouchable } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyles from './styles';

interface GuidanceFooterProps {
  /** The instruction to read out, already localised. */
  message: string;
  /** Signed angle left to turn; positive means turn right. Null when unknown. */
  offset: number | null;
  bearing: number | null;
  distanceKm: number | null;
  aligned: boolean;
  canRetry: boolean;
  onRetry: () => void;
}

export default function GuidanceFooter({
  message,
  offset,
  bearing,
  distanceKm,
  aligned,
  canRetry,
  onRetry,
}: GuidanceFooterProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const hintIcon = (() => {
    if (aligned) {
      return 'checkmark-circle';
    }
    if (offset === null) {
      return 'compass-outline';
    }
    // Physical turn direction, so it must not be mirrored for RTL.
    return offset > 0 ? 'arrow-forward' : 'arrow-back';
  })();

  return (
    <View style={styles.container}>
      <View style={styles.hint}>
        <AppIcon
          name={hintIcon}
          size={28}
          color={aligned ? theme.status.success : theme.accent.primary}
        />
      </View>

      <AppText
        variant="subtitle"
        color={aligned ? 'success' : 'primary'}
        style={styles.message}
        accessibilityLiveRegion="polite"
      >
        {message}
      </AppText>

      {bearing !== null && (
        <AppText variant="body" color="secondary" style={styles.detail}>
          {t('qibla.bearing', { degrees: Math.round(bearing) })}
        </AppText>
      )}

      {distanceKm !== null && (
        <AppText variant="caption" color="muted" style={styles.detail}>
          {t('qibla.distance', { distance: Math.round(distanceKm) })}
        </AppText>
      )}

      {canRetry && (
        <AppTouchable
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retry}
        >
          <AppText variant="subtitle" color="primaryText">
            {t('common.retry')}
          </AppText>
        </AppTouchable>
      )}
    </View>
  );
}
