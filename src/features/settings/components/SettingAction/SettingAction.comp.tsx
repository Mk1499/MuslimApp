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
        <View style={styles.rhs}>
          <View style={styles.actionIcon}>
            <AppIcon name={icon} size={21} color={theme.text.brand} />
          </View>
          <View>
            <AppText
              variant="body"
              weight="semiBold"
              style={styles.actionTitle}
            >
              {title}
            </AppText>
            <AppText variant="caption" style={styles.actionSubtitle}>
              {subtitle}
            </AppText>
          </View>
        </View>
        <AppIcon
          name={!isRTL ? 'chevron-forward' : 'chevron-back'}
          size={19}
          color={theme.text.muted}
        />
      </View>
    </AppTouchable>
  );
}
