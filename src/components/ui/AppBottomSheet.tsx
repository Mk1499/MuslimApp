import React, { forwardRef } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

/** Ref handle used to present/dismiss the sheet - keeps gorhom out of features. */
export type AppBottomSheetRef = BottomSheetModal;

export type AppBottomSheetProps = Omit<
  BottomSheetModalProps,
  'backdropComponent' | 'backgroundStyle' | 'handleIndicatorStyle' | 'children'
> & {
  /** Percent or px snap points. Omit for dynamic (content-sized) sheets. */
  snapPoints?: (string | number)[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

function ThemedBackdrop({
  props,
  baseProps,
}: {
  props: BottomSheetBackdropProps;
  baseProps: BottomSheetModalProps;
}): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior={
        baseProps.enableDismissOnClose === false ? 'none' : 'close'
      }
    />
  );
}

export const AppBottomSheet = forwardRef<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    scrollable?: boolean;
  }
>(function AppBottomSheetBase(
  { snapPoints, contentContainerStyle, children, scrollable = false, ...rest },
  ref,
): React.JSX.Element {
  const theme = useTheme();

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      enablePanDownToClose
      backdropComponent={props => (
        <ThemedBackdrop props={props} baseProps={rest} />
      )}
      backgroundStyle={{ backgroundColor: theme.card.primary }}
      handleIndicatorStyle={{ backgroundColor: theme.text.muted }}
      {...rest}
    >
      {scrollable ? (
        children
      ) : (
        <BottomSheetView style={contentContainerStyle}>
          {children}
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
});
