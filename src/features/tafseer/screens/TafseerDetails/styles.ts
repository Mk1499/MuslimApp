import { StyleSheet } from 'react-native';

export default () =>
  StyleSheet.create({
    container: {},
    headCont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      paddingBottom: 16,
    },
    list: {
      paddingTop: 8,
    },
    footerLoader: {
      paddingVertical: 16,
    },
  });
