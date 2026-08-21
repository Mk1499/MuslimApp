/* eslint-env jest */
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  return {
    createMMKV: jest.fn(() => ({
      getString: key => store.get(key),
      set: (key, value) => store.set(key, value),
      remove: key => store.delete(key),
      contains: key => store.has(key),
      clearAll: () => store.clear(),
    })),
  };
});

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en', countryCode: 'US' }],
  getCountry: () => 'US',
}));

jest.mock('react-native-restart', () => ({
  __esModule: true,
  default: { restart: jest.fn(), Restart: jest.fn() },
}));

jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = props =>
    React.createElement(Text, { ...props, allowFontScaling: false }, '?');

  MockIcon.getRawGlyphMap = () => ({});
  MockIcon.getImageSource = async () => ({ uri: '' });
  MockIcon.getImageSourceSync = () => ({ uri: '' });
  MockIcon.loadFont = async () => undefined;
  MockIcon.hasIcon = () => true;

  return {
    __esModule: true,
    default: MockIcon,
  };
});

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockLinearGradient = (props, ref) => {
    const { colors, locations, start, end, ...viewProps } = props;
    return React.createElement(View, { ...viewProps, ref });
  };

  return {
    __esModule: true,
    default: React.forwardRef(MockLinearGradient),
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');

  const BottomSheetModal = React.forwardRef((props, ref) => {
    React.useImperativeHandle(
      ref,
      () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
        close: jest.fn(),
        expand: jest.fn(),
        collapse: jest.fn(),
        snapToIndex: jest.fn(),
      }),
      [],
    );
    return React.createElement(View, null, props.children);
  });

  return {
    __esModule: true,
    BottomSheetModalProvider: ({ children }) => children,
    BottomSheetModal,
    BottomSheetView: (props) =>
      React.createElement(View, { style: props.style }, props.children),
    BottomSheetScrollView: (props) =>
      React.createElement(View, { style: props.style }, props.children),
    BottomSheetFlatList: () => null,
    BottomSheetBackdrop: () => null,
    BottomSheetTextInput: (props) =>
      React.createElement(View, { style: props.style }),
    useBottomSheet: () => ({
      expand: jest.fn(),
      collapse: jest.fn(),
      close: jest.fn(),
      snapToIndex: jest.fn(),
    }),
    useBottomSheetModal: () => ({
      present: jest.fn(),
      dismiss: jest.fn(),
    }),
  };
});
