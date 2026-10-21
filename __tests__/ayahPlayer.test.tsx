/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

/**
 * The engine drives `react-native-audio-api` through its public `<Audio>`
 * element, so the mock records the props of the last mounted element and
 * exposes an imperative handle the engine can call.
 */
jest.mock('react-native-audio-api', () => {
  const ReactModule = require('react');

  const state = {
    props: null as any,
    mounts: 0,
    handle: {
      play: jest.fn(),
      pause: jest.fn(),
      seekToTime: jest.fn(),
      setVolume: jest.fn(),
      setMuted: jest.fn(),
      setPlaybackRate: jest.fn(),
    },
  };

  const Audio = ReactModule.forwardRef((props: any, ref: any) => {
    state.props = props;
    ReactModule.useImperativeHandle(ref, () => state.handle, []);
    ReactModule.useEffect(() => {
      state.mounts += 1;
    }, []);
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
      setAudioSessionActivity: jest.fn().mockResolvedValue(undefined),
      setAudioSessionOptions: jest.fn(),
      observeAudioInterruptions: jest.fn(),
      addSystemEventListener: jest.fn(() => ({ subscriptionId: '0' })),
      requestNotificationPermissions: jest.fn().mockResolvedValue('granted'),
    },
    PlaybackNotificationManager: {
      show: jest.fn().mockResolvedValue(undefined),
      hide: jest.fn().mockResolvedValue(undefined),
      addEventListener: jest.fn(() => ({ subscriptionId: '0' })),
    },
    __mockState: state,
  };
});

const audioApi = require('react-native-audio-api');

import AyahAudioHost from '../src/features/quran/player/AyahAudioHost.comp';
import { ayahPlayerEngine } from '../src/features/quran/player/ayahPlayerEngine';

const state = audioApi.__mockState;

/** Renders the headless audio host and returns its renderer. */
async function renderHost() {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<AyahAudioHost />);
  });
  return renderer;
}

beforeEach(async () => {
  // The engine is a singleton — reset it between tests.
  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.stop();
  });
  state.props = null;
  state.mounts = 0;
  state.handle.play.mockClear();
  state.handle.pause.mockClear();
});

test('plays the requested ayah once its source is loaded', async () => {
  await renderHost();

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 1, ayah_number: 1 });
  });

  expect(ayahPlayerEngine.getSnapshot().currentAyahKey).toBe('1:1');
  expect(state.props.source.uri).toContain('001001.mp3');

  // Nothing sounds until the source finished loading.
  expect(state.handle.play).not.toHaveBeenCalled();

  await ReactTestRenderer.act(async () => {
    state.props.onLoad();
  });

  expect(state.handle.play).toHaveBeenCalledTimes(1);
});

test('advances to the next ayah when the current one ends', async () => {
  await renderHost();

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 1, ayah_number: 1 });
  });

  await ReactTestRenderer.act(async () => {
    state.props.onLoad();
  });

  await ReactTestRenderer.act(async () => {
    state.props.onEnded();
  });

  expect(ayahPlayerEngine.getSnapshot().currentAyahKey).toBe('1:2');
  expect(state.props.source.uri).toContain('001002.mp3');
});

test('keeps playing across the surah boundary', async () => {
  await renderHost();

  // The last ayah of Al-Fatiha is followed by the first ayah of Al-Baqarah.
  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 1, ayah_number: 7 });
  });

  await ReactTestRenderer.act(async () => {
    state.props.onLoad();
  });

  await ReactTestRenderer.act(async () => {
    state.props.onEnded();
  });

  expect(ayahPlayerEngine.getSnapshot().currentAyahKey).toBe('2:1');
});

test('ignores events that belong to an already replaced source', async () => {
  await renderHost();

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 1, ayah_number: 1 });
  });

  // The props of the first ayah — they are stale once the engine moved on.
  const staleProps = state.props;

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 2, ayah_number: 1 });
  });

  await ReactTestRenderer.act(async () => {
    staleProps.onLoad();
    staleProps.onEnded();
  });

  expect(ayahPlayerEngine.getSnapshot().currentAyahKey).toBe('2:1');
});

test('pauses and resumes the current ayah', async () => {
  await renderHost();

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 1, ayah_number: 1 });
  });

  await ReactTestRenderer.act(async () => {
    state.props.onLoad();
  });

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.pause();
  });

  expect(state.handle.pause).toHaveBeenCalled();
  expect(ayahPlayerEngine.getSnapshot().isPlaying).toBe(false);

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.resume();
  });

  expect(state.handle.play).toHaveBeenCalledTimes(2);
});

test('stop clears the loaded ayah', async () => {
  await renderHost();

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.play({ surah_number: 1, ayah_number: 1 });
  });

  expect(ayahPlayerEngine.getSnapshot().currentAyahKey).toBe('1:1');

  await ReactTestRenderer.act(async () => {
    ayahPlayerEngine.stop();
  });

  expect(ayahPlayerEngine.getSnapshot().currentAyahKey).toBeNull();
  expect(ayahPlayerEngine.getSnapshot().sourceUrl).toBeNull();
  expect(state.handle.pause).toHaveBeenCalled();
});
