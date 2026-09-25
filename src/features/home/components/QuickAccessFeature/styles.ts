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

    featureImageCont: {
      padding: 10,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    featureImage: {
      width: '100%',
      height: '100%',
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
