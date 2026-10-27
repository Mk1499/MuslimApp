import { AppTheme, fontFamily, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    content: { paddingBottom: spacing.xl },
    topBar: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
    },
    topBarSpacer: { width: 28 },
    videoInfo: { paddingHorizontal: spacing.md },
    title: { color: theme.text.primary, lineHeight: 25 },
    videoMeta: { color: theme.text.muted, marginTop: spacing.xs },
    channelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: theme.background.secondary,
    },
    channelInfo: { flex: 1 },
    speakerName: { color: theme.text.primary },
    channelLabel: { color: theme.text.muted, marginTop: 2 },
    visitLabel: { color: theme.text.brand },
    description: {
      backgroundColor: theme.background.secondary,
      borderRadius: 12,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    descriptionText: { color: theme.text.primary, lineHeight: 21 },
    relatedSection: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
    relatedTitle: {
      color: theme.text.brand,
      marginBottom: spacing.md,
      fontFamily: fontFamily.bold,
    },
    relatedCard: { marginBottom: spacing.md },
    loader: { paddingVertical: spacing.xl },
    emptyText: { color: theme.text.muted, paddingVertical: spacing.md },
    playerCont: {
      marginHorizontal: spacing.md,
      backgroundColor: theme.background.primary,
      paddingBottom: spacing.sm,
    },
  });
