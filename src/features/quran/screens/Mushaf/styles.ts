import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    sheetContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl,
    },
    sheetHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    sheetBackButton: { width: 40, height: 40, borderRadius: 20 },
    sheetHeadingCopy: { flex: 1 },
    sheetTitle: { color: theme.text.primary },
    sheetSubtitle: { color: theme.text.muted, marginTop: 2 },
    selectedAyahCard: {
      borderRadius: radius.lg,
      backgroundColor: theme.background.secondary,
    },
    selectedAyahText: {
      color: theme.text.primary,
      fontSize: 24,
      lineHeight: 42,
      textAlign: 'right',
    },
    actionList: { gap: spacing.sm, marginTop: spacing.md },
    actionTouchable: { alignSelf: 'stretch' },
    actionCard: {
      minHeight: 62,
      borderRadius: radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.status.infoSoft,
    },
    actionText: { color: theme.text.primary, flex: 1, textAlign: 'left' },
    detailContent: { gap: spacing.sm, marginTop: spacing.sm },
    detailText: { color: theme.text.primary, fontSize: 18, lineHeight: 30 },
    detailMessage: {
      color: theme.text.secondary,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
    similarVerseCard: { borderRadius: radius.md },
    similarVerseLabel: {
      color: theme.text.muted,
      marginTop: spacing.sm,
      textAlign: 'left',
    },
  });
