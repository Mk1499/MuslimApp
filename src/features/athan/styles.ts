import { AppTheme, fontFamily, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    description: {
      color: theme.text.secondary,
      marginBottom: spacing.xl,
      textAlign: 'left',
    },
    sectionTitle: {
      color: theme.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'left',
    },
    optionsCard: { borderRadius: radius.lg, marginBottom: spacing.xl },
    prayerOption: {
      minHeight: 74,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    prayerCopy: { flex: 1 },
    rowTitle: { color: theme.text.primary, textAlign: 'left' },
    rowSubtitle: { color: theme.text.muted, marginTop: 2, textAlign: 'left' },
    divider: {
      height: StyleSheet.hairlineWidth,
      marginStart: spacing.md,
      backgroundColor: theme.divider,
    },
    soundSelector: {
      minHeight: 76,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: theme.card.primary,
      borderWidth: 1,
      borderColor: theme.card.border,
      gap: spacing.md,
    },
    soundIcon: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.status.infoSoft,
      borderRadius: radius.md,
    },
    soundCopy: { flex: 1 },
    sheetContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
    sheetTitle: {
      color: theme.text.primary,
      marginBottom: spacing.md,
      textAlign: 'left',
    },
    soundOption: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
    },
    soundSelectAction: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'center',
      minHeight: 56,
      paddingHorizontal: spacing.sm,
    },
    soundOptionCopy: { flex: 1, justifyContent: 'center' },
    selectedSound: { color: theme.text.brand, marginTop: 2 },
    previewButton: {
      width: 48,
      minHeight: 56,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedSoundOption: {
      backgroundColor: theme.background.brand,
      borderRadius: radius.sm,
    },
    selectedSoundText: {
      color: theme.accent.soft,
      fontFamily: fontFamily.bold,
    },
  });
