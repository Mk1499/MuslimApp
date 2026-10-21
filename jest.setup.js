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

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    setRNConfiguration: jest.fn(),
    requestAuthorization: jest.fn(),
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(() => 1),
    clearWatch: jest.fn(),
  },
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  const WebView = React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  );
  WebView.displayName = 'WebView';

  return {
    __esModule: true,
    default: WebView,
    WebView,
  };
});

jest.mock('react-native-restart', () => ({
  __esModule: true,
  default: { restart: jest.fn(), Restart: jest.fn() },
}));

jest.mock('react-native-compass-heading', () => ({
  __esModule: true,
  default: {
    start: jest.fn(() => Promise.resolve(undefined)),
    stop: jest.fn(() => Promise.resolve(undefined)),
  },
}));

jest.mock('react-native-audio-api', () => {
  const React = require('react');

  const Audio = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      play: jest.fn(),
      pause: jest.fn(),
      seekToTime: jest.fn(),
      setVolume: jest.fn(),
      setMuted: jest.fn(),
      setPlaybackRate: jest.fn(),
    }));
    return null;
  });
  Audio.displayName = 'Audio';

  const AudioContext = jest.fn().mockImplementation(() => ({
    currentTime: 0,
    sampleRate: 44100,
    state: 'running',
    destination: {},
    resume: jest.fn().mockResolvedValue(undefined),
    suspend: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
  }));

  return {
    __esModule: true,
    Audio,
    AudioContext,
    AudioManager: {
      getDevicePreferredSampleRate: jest.fn(() => 44100),
      setAudioSessionActivity: jest.fn().mockResolvedValue(undefined),
      setAudioSessionOptions: jest.fn(),
      disableSessionManagement: jest.fn(),
      observeAudioInterruptions: jest.fn(),
      activelyReclaimSession: jest.fn(),
      observeVolumeChanges: jest.fn(),
      addSystemEventListener: jest.fn(() => ({ subscriptionId: '0' })),
      requestRecordingPermissions: jest.fn(),
      checkRecordingPermissions: jest.fn(),
      requestNotificationPermissions: jest.fn(),
      checkNotificationPermissions: jest.fn(),
      getDevicesInfo: jest.fn(),
      setInputDevice: jest.fn(),
    },
    PlaybackNotificationManager: {
      show: jest.fn().mockResolvedValue(undefined),
      hide: jest.fn().mockResolvedValue(undefined),
      isActive: jest.fn().mockResolvedValue(false),
      enableControl: jest.fn().mockResolvedValue(undefined),
      addEventListener: jest.fn(() => ({ subscriptionId: '0' })),
    },
    RecordingNotificationManager: {
      show: jest.fn().mockResolvedValue(undefined),
      hide: jest.fn().mockResolvedValue(undefined),
      isActive: jest.fn().mockResolvedValue(false),
      addEventListener: jest.fn(() => ({ subscriptionId: '0' })),
    },
    decodeAudioData: jest.fn(),
    getAudioDuration: jest.fn(),
    isFfmpegEnabled: jest.fn(() => false),
  };
});

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

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock'),
);

// `react-native-reanimated`'s native initializers call into the CSS native
// proxy, which is not implemented by the Jest (JSReanimated) backend.
jest.mock('react-native-reanimated/src/css/native/proxy', () => {
  const actual = jest.requireActual('react-native-reanimated/src/css/native/proxy');
  return {
    ...actual,
    setCSSEventHandler: jest.fn(),
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
