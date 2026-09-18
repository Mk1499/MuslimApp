import { TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { IProps } from './types';
import makeStyle from './style';
import { AppIcon } from '@/components/ui';
import { useTheme } from '@/theme';

export default function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search Surah, Ayah, or Keyword...',
  onSubmitEditing,
  onClear,
  onPress,
  editable = true,
  autoFocus,
  containerStyle,
  inputStyle,
  testID,
  ...rest
}: IProps) {
  const theme = useTheme();
  const styles = makeStyle(theme);
  // When onPress is provided the field acts as a pressable trigger (e.g. navigate to a search screen)
  // instead of an editable input, so typing is disabled and taps bubble up to the wrapper.
  const isTrigger = !!onPress;

  return (
    <TouchableOpacity
      activeOpacity={isTrigger ? 0.7 : 1}
      disabled={!isTrigger}
      onPress={onPress}
      style={[styles.container, containerStyle]}
      testID={testID}
    >
      <AppIcon name="search" size={20} color="text.muted" />
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={theme.text.muted}
        editable={editable && !isTrigger}
        autoFocus={autoFocus}
        style={[styles.input, inputStyle]}
        pointerEvents={isTrigger ? 'none' : 'auto'}
      />
      {!!value && !!onClear ? (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <AppIcon name="close-circle" size={18} color="text.muted" />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}
