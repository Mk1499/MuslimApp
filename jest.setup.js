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
