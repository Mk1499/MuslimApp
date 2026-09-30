import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { CommonListItemProps } from '../common/CommonListItem/type';
import {
  AppBottomSheet,
  AppBottomSheetProps,
  AppBottomSheetRef,
} from './AppBottomSheet';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import CommonListItem from '@/components/common/CommonListItem/CommonListItem.comp';
import { AppText } from '@/components/ui/AppText';
import { AppTheme, useTheme } from '@/theme';
import { AppIcon } from './AppIcon';

type IProps = {
  options: CommonListItemProps[];
  preSelectedOption?: CommonListItemProps;
  placeholder?: string;
  preLabel?: string;
  onSelectOption?: (option: CommonListItemProps) => void;
};

export default function AppDropDown({
  options,
  preSelectedOption,
  placeholder,
  onSelectOption,
  preLabel,
}: IProps) {
  const [selectedOption, setSelectedOption] = React.useState<
    CommonListItemProps | undefined
  >(preSelectedOption);
  const bottomSheetRef = React.useRef<AppBottomSheetRef>(null);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const renderHeader = () => {
    return (
      <Pressable
        style={styles.headCont}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <AppText>
          {preLabel ? preLabel + ' ' : ''}
          {selectedOption?.title ?? placeholder}
        </AppText>
        <AppIcon name="chevron-down" size={24} color={theme.background.brand} />
      </Pressable>
    );
  };

  const renderOptions = () => {
    return (
      <AppBottomSheet
        scrollable={true}
        ref={bottomSheetRef}
        snapPoints={['50%']}
      >
        <AppText style={styles.title}>{placeholder}</AppText>
        <BottomSheetFlatList
          data={options}
          renderItem={({ item }) => (
            <CommonListItem
              {...item}
              withChevron
              onPress={() => handleChooseItem(item)}
            />
          )}
          keyExtractor={item => item.title.toString()}
        />
      </AppBottomSheet>
    );
  };

  function handleChooseItem(item: CommonListItemProps) {
    bottomSheetRef.current?.dismiss();
    setSelectedOption(item);
    onSelectOption?.(item);
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderOptions()}
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    headCont: {
      borderWidth: 2,
      borderColor: theme.background.brand,
      borderRadius: 14,
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginStart: 16,
    },
  });
