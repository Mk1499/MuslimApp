module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Must be listed last - required by react-native-reanimated.
    'react-native-reanimated/plugin',
  ],
};
