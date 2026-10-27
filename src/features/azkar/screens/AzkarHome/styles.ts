import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
    heading: { color: theme.text.primary },
    subtitle: { color: theme.text.secondary, marginTop: spacing.xs, marginBottom: spacing.lg },
    optionsCard: { borderRadius: radius.lg, overflow: 'hidden' },
    optionTouchable: { alignSelf: 'stretch' },
    optionRow: {
      minHeight: 82,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    favoriteIcon: {
      width: 46,
      height: 46,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.status.errorSoft,
    },
    allIcon: {
      width: 46,
      height: 46,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.status.infoSoft,
    },
    optionCopy: { flex: 1 },
    optionTitle: { color: theme.text.primary },
    optionSubtitle: { color: theme.text.muted, marginTop: 3 },
    divider: { height: StyleSheet.hairlineWidth, marginStart: spacing.md + 46 + spacing.md, backgroundColor: theme.divider },
  });
