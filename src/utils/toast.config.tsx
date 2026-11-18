import { AppText } from '@/components/ui/AppText';
import { View } from 'react-native';
import Toast, {
  BaseToast,
  ErrorToast,
  BaseToastProps,
  ToastProps,
} from 'react-native-toast-message';

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({
    text1,
    props,
  }: {
    text1: string;
    props: { uuid: string };
  }) => (
    <View
      style={{
        height: 60,
        width: '90%',
        backgroundColor: 'tomato',
        alignSelf: 'center',
        borderRadius: 12,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 15,
      }}
    >
      <AppText
        style={{
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'left',
        }}
      >
        {text1}
      </AppText>
    </View>
  ),
};
