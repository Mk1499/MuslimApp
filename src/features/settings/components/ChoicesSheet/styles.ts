import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    sheetContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    sheetTitle: { color: theme.text.primary, textAlign: 'left' },
    sheetSubtitle: {
      color: theme.text.secondary,
      textAlign: 'left',
      marginTop: spacing.xs,
    },
    choiceList: { marginTop: spacing.lg, gap: spacing.xs },
    choiceTouchable: { alignSelf: 'stretch' },
    choiceRow: {
      minHeight: 68,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      gap: spacing.md,
      borderRadius: radius.md,
    },
    choiceIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background.secondary,
    },
    choiceIconSelected: { backgroundColor: theme.status.infoSoft },
    choiceCopy: { flex: 1 },
    choiceLabel: { color: theme.text.primary },
    choiceDescription: { color: theme.text.muted, marginTop: 2 },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: theme.card.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: { borderColor: theme.text.brand },
    radioDot: {
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor: theme.text.brand,
    },
    confirmButton: { marginTop: spacing.lg },
    confirmText: { color: theme.basic.white },
    cancelButton: { marginTop: spacing.sm, paddingVertical: spacing.md },
    cancelText: { color: theme.text.secondary },
  });
