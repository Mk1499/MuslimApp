import {
  AudioContext,
  AudioManager,
  PlaybackNotificationManager,
} from 'react-native-audio-api';
import { AYAH_INDEX, AYAH_LIST, SURAH_NAMES } from './ayahSequence';
import {
  RECITER_FOLDER,
  getAyahStreamUrl,
  getReciterDisplayName,
} from './ayahAudio';

/**
 * Minimal info needed to start playback. A pressed `QuranWord` satisfies it,
 * and so does a bare `{ surah_number, ayah_number }` (used when resuming from
 * the home screen's last-read card).
 */
export interface AyahTarget {
  surah_number: number;
  ayah_number: number;
}

/**
 * Everything the UI needs to know about the player at a given moment.
 */
export interface AyahPlayerSnapshot {
  /** URL of the ayah currently loaded into the audio element. */
  sourceUrl: string | null;
  /**
   * Bumped every time the loaded source changes. The audio host uses it to
   * ignore events that belong to a source that has already been replaced.
   */
  sourceId: number;
  /** "surah:ayah" of the ayah that is loaded. */
  currentAyahKey: string | null;
  /** True while the audio element is actually producing sound. */
  isPlaying: boolean;
  /** True while the current source is still being fetched/decoded. */
  isLoading: boolean;
}

/**
 * The imperative surface the audio host (the `<Audio>` element) hands over to
 * the engine. The engine owns *what* should play, the host owns *how*.
 */
export interface AyahAudioHost {
  play(): void;
  pause(): void;
}

type SnapshotListener = (snapshot: AyahPlayerSnapshot) => void;

const EMPTY_SNAPSHOT: AyahPlayerSnapshot = {
  sourceUrl: null,
  sourceId: 0,
  currentAyahKey: null,
  isPlaying: false,
  isLoading: false,
};

/**
 * Playback engine for ayah recitation, built on `react-native-audio-api`.
 *
 * `react-native-track-player` used to own a native queue of tracks; the audio
 * API has no such concept, so the queue lives here instead: the engine keeps
 * a cursor into `AYAH_LIST` and walks it forward, one ayah at a time, as each
 * source finishes playing.
 *
 * The engine is a singleton because — like the old playback service — it has
 * to outlive the component that started the recitation (the mushaf screen can
 * be left while the audio keeps going).
 */
class AyahPlayerEngine {
  private listeners = new Set<SnapshotListener>();

  private snapshot: AyahPlayerSnapshot = EMPTY_SNAPSHOT;

  private host: AyahAudioHost | null = null;

  private context: AudioContext | null = null;

  /** Index into `AYAH_LIST` of the ayah that is currently loaded. */
  private cursor = -1;

  /**
   * Whether playback should be running as soon as the current source is ready.
   * Lets the user pause while a source is still loading.
   */
  private pendingPlay = false;

  /** Set once the native listeners (interruption + notification) are wired. */
  private nativeListenersReady = false;

  /** The notification permission is only ever asked for once per session. */
  private notificationPermissionRequested = false;

  // ---------------------------------------------------------------------
  // Subscription
  // ---------------------------------------------------------------------

  subscribe = (listener: SnapshotListener): (() => void) => {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): AyahPlayerSnapshot => this.snapshot;

  /**
   * The shared audio context. It is created once and reused for every ayah so
   * swapping sources never tears down the underlying native audio runtime.
   *
   * It is created lazily so the audio host always hands the very same context
   * to the `<Audio>` element — a changing context would make the library
   * build a new one.
   */
  getAudioContext = (): AudioContext | null => this.getContext();

  /** Registers the audio element that actually produces the sound. */
  attachHost = (host: AyahAudioHost): (() => void) => {
    this.host = host;
    return () => {
      if (this.host === host) {
        this.host = null;
      }
    };
  };

  // ---------------------------------------------------------------------
  // Commands
  // ---------------------------------------------------------------------

  /**
   * Starts a recitation at the given ayah and keeps going through the
   * following ayahs, across page and surah boundaries.
   */
  play = (target: AyahTarget): void => {
    const index = AYAH_INDEX.get(
      `${target.surah_number}:${target.ayah_number}`,
    );
    if (index === undefined) {
      return;
    }

    this.pendingPlay = true;
    this.prepareNativeSession();
    this.load(index);
  };

  pause = (): void => {
    this.pendingPlay = false;
    this.host?.pause();
    this.patch({ isPlaying: false });
    this.updateNotification('paused');
  };

  resume = (): void => {
    if (this.snapshot.currentAyahKey == null) {
      return;
    }

    this.pendingPlay = true;
    // Still loading — playback starts on its own once the source is ready.
    if (this.snapshot.isLoading) {
      return;
    }
    this.host?.play();
  };

  toggle = (): void => {
    if (this.snapshot.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  };

  /** Stops everything and clears the loaded ayah. */
  stop = (): void => {
    this.pendingPlay = false;
    this.host?.pause();
    this.cursor = -1;
    this.patch({
      sourceUrl: null,
      sourceId: this.snapshot.sourceId + 1,
      currentAyahKey: null,
      isPlaying: false,
      isLoading: false,
    });
    this.releaseNativeSession();
    PlaybackNotificationManager.hide().catch(() => {});
  };

  /** Jumps to the next ayah in reading order. */
  next = (): void => {
    const next = this.cursor + 1;
    if (next < 0 || next >= AYAH_LIST.length) {
      return;
    }
    this.pendingPlay = true;
    this.load(next);
  };

  /** Jumps back to the previous ayah in reading order. */
  previous = (): void => {
    const previous = this.cursor - 1;
    if (previous < 0) {
      return;
    }
    this.pendingPlay = true;
    this.load(previous);
  };

  // ---------------------------------------------------------------------
  // Events coming from the audio host
  // ---------------------------------------------------------------------

  /** The current source finished loading and is ready to play. */
  handleLoaded = (sourceId: number): void => {
    if (sourceId !== this.snapshot.sourceId) {
      return;
    }

    this.patch({ isLoading: false });

    if (!this.pendingPlay) {
      return;
    }

    const start = () => {
      // The user may have hit pause while the context was resuming.
      if (this.pendingPlay) {
        this.host?.play();
      }
    };

    const context = this.getContext();
    if (!context) {
      start();
      return;
    }

    context.resume().then(start).catch(start);
  };

  /** The current source played to its end — move on to the next ayah. */
  handleEnded = (sourceId: number): void => {
    if (sourceId !== this.snapshot.sourceId) {
      return;
    }

    const next = this.cursor + 1;
    if (next >= AYAH_LIST.length) {
      this.stop();
      return;
    }

    this.load(next);
  };

  /** The current source failed to load. */
  handleError = (sourceId: number): void => {
    if (sourceId !== this.snapshot.sourceId) {
      return;
    }
    this.pendingPlay = false;
    this.patch({ isLoading: false, isPlaying: false });
  };

  /** The audio element started / stopped producing sound. */
  handlePlaying = (isPlaying: boolean): void => {
    if (this.snapshot.isPlaying === isPlaying) {
      return;
    }
    this.patch({ isPlaying });
    this.updateNotification(isPlaying ? 'playing' : 'paused');
  };

  // ---------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------

  /**
   * Points the audio element at a new ayah. Bumping `sourceId` makes the host
   * swap the `<Audio>` element, which tears the previous source down.
   */
  private load = (index: number): void => {
    const ayah = AYAH_LIST[index];
    if (!ayah) {
      return;
    }

    this.cursor = index;
    this.patch({
      sourceUrl: getAyahStreamUrl({
        surah_number: ayah.surah,
        ayah_number: ayah.ayah,
      }),
      sourceId: this.snapshot.sourceId + 1,
      currentAyahKey: `${ayah.surah}:${ayah.ayah}`,
      isLoading: true,
    });
  };

  /**
   * Merges the changes into the snapshot and notifies the listeners.
   *
   * Nothing is published when the values did not actually change: every
   * notification re-renders the audio host, and a re-render would in turn
   * restart the underlying source.
   */
  private patch = (changes: Partial<AyahPlayerSnapshot>): void => {
    const keys = Object.keys(changes) as (keyof AyahPlayerSnapshot)[];
    const changed = keys.some(key => this.snapshot[key] !== changes[key]);
    if (!changed) {
      return;
    }

    this.snapshot = { ...this.snapshot, ...changes };
    this.listeners.forEach(listener => listener(this.snapshot));
  };

  private getContext = (): AudioContext | null => {
    if (!this.context) {
      try {
        this.context = new AudioContext();
      } catch {
        // The native module is unavailable — playback simply won't start.
        return null;
      }
    }
    return this.context;
  };

  /**
   * Configures the audio session for spoken content and starts observing
   * interruptions (phone calls, other apps taking over).
   */
  private prepareNativeSession = (): void => {
    if (!this.nativeListenersReady) {
      this.nativeListenersReady = true;
      this.listenToNativeEvents();
    }

    // Created up-front so the audio host can hand it to every `<Audio>`
    // element instead of letting each one spin up its own context.
    this.getContext();

    this.ensureNotificationPermission();

    try {
      AudioManager.setAudioSessionOptions({
        iosCategory: 'playback',
        iosMode: 'spokenAudio',
        iosOptions: ['duckOthers'],
      });
      AudioManager.observeAudioInterruptions('gain');
      AudioManager.setAudioSessionActivity(true).catch(() => {});
    } catch {
      // ignore — the session keeps its defaults.
    }
  };

  /**
   * Asks for the notification permission once, so the lock screen / shade
   * controls are available on Android 13+. Playback never depends on it.
   */
  private ensureNotificationPermission = (): void => {
    if (this.notificationPermissionRequested) {
      return;
    }
    this.notificationPermissionRequested = true;

    try {
      AudioManager.requestNotificationPermissions().catch(() => {});
    } catch {
      // ignore — the controls are a bonus, not a requirement.
    }
  };

  private releaseNativeSession = (): void => {
    try {
      AudioManager.observeAudioInterruptions(false);
      AudioManager.setAudioSessionActivity(false).catch(() => {});
    } catch {
      // ignore
    }
  };

  private listenToNativeEvents = (): void => {
    try {
      AudioManager.addSystemEventListener('interruption', event => {
        if (event.type === 'began') {
          this.pause();
        } else if (event.shouldResume) {
          this.resume();
        }
      });
    } catch {
      // ignore
    }

    try {
      PlaybackNotificationManager.addEventListener(
        'playbackNotificationPlay',
        () => this.resume(),
      );
      PlaybackNotificationManager.addEventListener(
        'playbackNotificationPause',
        () => this.pause(),
      );
      PlaybackNotificationManager.addEventListener(
        'playbackNotificationStop',
        () => this.stop(),
      );
      PlaybackNotificationManager.addEventListener(
        'playbackNotificationNextTrack',
        () => this.next(),
      );
      PlaybackNotificationManager.addEventListener(
        'playbackNotificationPreviousTrack',
        () => this.previous(),
      );
    } catch {
      // ignore — the notification is a bonus, not a requirement.
    }
  };

  /** Keeps the lock screen / notification in sync with the player. */
  private updateNotification = (state: 'playing' | 'paused'): void => {
    const key = this.snapshot.currentAyahKey;
    if (!key) {
      return;
    }

    const [surah, ayah] = key.split(':').map(Number);

    try {
      PlaybackNotificationManager.show({
        title: `آية ${ayah}`,
        artist: SURAH_NAMES[surah] ?? `سورة ${surah}`,
        album: getReciterDisplayName(RECITER_FOLDER),
        state,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };
}

export const ayahPlayerEngine = new AyahPlayerEngine();
