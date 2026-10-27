import { useTheme } from '@/theme/ThemeProvider';
import makeStyles from './styles';
import { AppText, AppTouchable, AppIcon } from '@/components/ui';
import { View } from 'react-native';
import { isRTL } from '@/utils/constants';

export default function SettingAction({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof AppIcon>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <AppTouchable
      variant="ghost"
      onPress={onPress}
      accessibilityRole="button"
      style={styles.actionTouchable}
    >
      <View style={styles.actionRow}>
        <View style={styles.actionIcon}>
          <AppIcon name={icon} size={21} color={theme.text.brand} />
        </View>
        <View style={styles.actionCopy}>
          <AppText variant="body" weight="semiBold" style={styles.actionTitle}>
            {title}
          </AppText>
          <AppText variant="caption" style={styles.actionSubtitle}>
            {subtitle}
          </AppText>
        </View>
        <AppIcon
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={19}
          color={theme.text.muted}
        />
      </View>
    </AppTouchable>
  );
}
