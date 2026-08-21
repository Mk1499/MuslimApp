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

function ThemedBackdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );
}

export const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  function AppBottomSheetBase(
    { snapPoints, contentContainerStyle, children, ...rest },
    ref,
  ): React.JSX.Element {
    const theme = useTheme();

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={!snapPoints}
        enablePanDownToClose
        backdropComponent={ThemedBackdrop}
        backgroundStyle={{ backgroundColor: theme.card.primary }}
        handleIndicatorStyle={{ backgroundColor: theme.text.muted }}
        {...rest}>
        <BottomSheetView style={contentContainerStyle}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
