import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type IProps = Omit<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'onSubmitEditing'
  | 'editable'
  | 'autoFocus'
  | 'style'
> & {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  /** Shows a clear ("x") button whenever there is a value and this is provided. */
  onClear?: () => void;
  /** Renders the component as a non-editable pressable trigger (e.g. to navigate to a dedicated search screen). */
  onPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
};
