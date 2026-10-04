import { StyleSheet } from 'react-native';
import { fontFamily, fontSize, spacing, type AppTheme } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    pointer: {
      position: 'absolute',
      top: -spacing.xxl,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 1,
    },
    dial: {
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    layer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
    },
    tick: {
      width: 2,
      height: spacing.sm,
      marginTop: spacing.xs + spacing.xxs,
      borderRadius: 1,
      backgroundColor: theme.text.muted,
    },
    tickMajor: {
      height: spacing.md,
      backgroundColor: theme.text.secondary,
    },
    cardinal: {
      marginTop: spacing.xl,
      fontSize: fontSize.lg,
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    kaabaMarker: {
      marginTop: spacing.xxxl,
    },
  });
