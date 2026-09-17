import { StyleSheet } from 'react-native';

const Styles = () =>
  StyleSheet.create({
    container: {
      paddingBottom: 0,
    },
    featureItem: {
      marginBottom: 16,
      alignItems: 'center',
      flex: 1,
    },
    featureImage: {
      width: 50,
      height: 50,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    featureTitle: {
      fontSize: 12,
      textAlign: 'center',
    },
    listRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });

export default Styles;
