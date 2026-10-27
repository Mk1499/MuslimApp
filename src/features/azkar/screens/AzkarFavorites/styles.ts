import { StyleSheet } from 'react-native';
import { AppTheme, spacing } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    listContent: { flexGrow: 1, paddingBottom: spacing.lg },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    emptyTitle: { color: theme.text.primary, textAlign: 'center' },
    emptySubtitle: { color: theme.text.muted, textAlign: 'center', marginTop: spacing.xs },
  });
