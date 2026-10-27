import React from 'react';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppIcon,
  AppText,
  AppTouchable,
} from '@/components/ui';
import { ChoiceSheetProps } from './types';
import { useTheme } from '@/theme';
import makeStyles from './styles';
import { View } from 'react-native';

const ChoicesSheet = React.forwardRef(function ChoicesSheet<T extends string>(
  {
    title,
    subtitle,
    choices,
    selectedValue,
    onSelect,
    onConfirm,
    confirmLabel,
    cancelLabel,
    onCancel,
  }: ChoiceSheetProps<T>,
  ref: React.ForwardedRef<AppBottomSheetRef>,
): React.JSX.Element {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <AppBottomSheet ref={ref} contentContainerStyle={styles.sheetContent}>
      <AppText variant="subtitle" weight="semiBold" style={styles.sheetTitle}>
        {title}
      </AppText>
      <AppText variant="body" style={styles.sheetSubtitle}>
        {subtitle}
      </AppText>
      <View style={styles.choiceList}>
        {choices.map(choice => {
          const isSelected = choice.value === selectedValue;
          return (
            <AppTouchable
              key={choice.value}
              variant="ghost"
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(choice.value)}
              style={styles.choiceTouchable}
            >
              <View style={styles.choiceRow}>
                <View
                  style={[
                    styles.choiceIcon,
                    isSelected && styles.choiceIconSelected,
                  ]}
                >
                  <AppIcon
                    name={choice.icon}
                    size={20}
                    color={isSelected ? theme.text.brand : theme.text.secondary}
                  />
                </View>
                <View style={styles.choiceCopy}>
                  <AppText
                    variant="body"
                    weight={isSelected ? 'semiBold' : 'medium'}
                    style={styles.choiceLabel}
                  >
                    {choice.label}
                  </AppText>
                  <AppText variant="caption" style={styles.choiceDescription}>
                    {choice.description}
                  </AppText>
                </View>
                <View
                  style={[styles.radio, isSelected && styles.radioSelected]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </View>
            </AppTouchable>
          );
        })}
      </View>
      <AppTouchable
        variant="primary"
        onPress={onConfirm}
        style={styles.confirmButton}
      >
        <AppText variant="body" weight="semiBold" style={styles.confirmText}>
          {confirmLabel}
        </AppText>
      </AppTouchable>
      <AppTouchable
        variant="ghost"
        onPress={onCancel}
        style={styles.cancelButton}
      >
        <AppText variant="body" weight="medium" style={styles.cancelText}>
          {cancelLabel}
        </AppText>
      </AppTouchable>
    </AppBottomSheet>
  );
});

export default ChoicesSheet;
