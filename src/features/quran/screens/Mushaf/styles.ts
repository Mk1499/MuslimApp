import { AppTheme, fontFamily, radius, spacing } from '@/theme';
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
      backgroundColor: theme.background.brand,
    },
    selectedAyahText: {
      color: theme.basic.white,
      fontSize: 24,
      lineHeight: 42,
      textAlign: 'center',
      fontFamily: fontFamily.hafs,
    },
    selectedAyahNum: {
      fontFamily: fontFamily.uthmani,
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
    detailContent: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    detailText: {
      color: theme.text.primary,
      fontSize: 24,
      // lineHeight: 30,
      fontFamily: fontFamily.hafs,
    },
    detailFetured: {
      color: theme.text.brand,
      textAlign: 'right',
    },
    detailMessage: {
      color: theme.text.secondary,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
    similarVerseCard: {
      borderRadius: radius.md,
    },
    similarVerseLabel: {
      color: theme.text.brand,
      marginTop: spacing.sm,
      textAlign: 'left',
    },
  });
