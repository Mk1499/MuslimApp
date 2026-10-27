import {
  AudioContext,
  AudioManager,
  PlaybackNotificationManager,
  type AudioBuffer,
  type AudioBufferSourceNode,
} from 'react-native-audio-api';
import { AYAH_INDEX, AYAH_LIST, SURAH_NAMES } from './ayahSequence';
import {
  RECITER_FOLDER,
  getAyahStreamUrl,
  getReciterDisplayName,
} from './ayahAudio';

export interface AyahTarget {
  surah_number: number;
  ayah_number: number;
}

export interface AyahPlayerSnapshot {
  currentAyahKey: string | null;
  isPlaying: boolean;
  isLoading: boolean;
}

type SnapshotListener = (snapshot: AyahPlayerSnapshot) => void;

const EMPTY_SNAPSHOT: AyahPlayerSnapshot = {
  currentAyahKey: null,
  isPlaying: false,
  isLoading: false,
};

/**
 * Plays recitations through decoded AudioBuffers. The next ayah is downloaded
 * and decoded during the current ayah, then its source is scheduled at the
 * current source's exact end time on the AudioContext clock. This avoids
 * relying on a JS onEnded callback to start the next audio file.
 */
class AyahPlayerEngine {
  private listeners = new Set<SnapshotListener>();
  private snapshot = EMPTY_SNAPSHOT;
  private context: AudioContext | null = null;
  private cursor = -1;
  private currentOffset = 0;
  private currentStartTime = 0;
  private currentBuffer: AudioBuffer | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;
  private nextBuffer: AudioBuffer | null = null;
  private nextIndex: number | null = null;
  private nextStartTime = 0;
  private bufferPromises = new Map<number, Promise<AudioBuffer>>();
  private runId = 0;
  private pendingPlay = false;
  private nativeListenersReady = false;
  private notificationPermissionRequested = false;

  subscribe = (listener: SnapshotListener): (() => void) => {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): AyahPlayerSnapshot => this.snapshot;

  play = (target: AyahTarget): void => {
    const index = AYAH_INDEX.get(
      `${target.surah_number}:${target.ayah_number}`,
    );
    if (index === undefined) return;
    this.prepareNativeSession();
    this.startAt(index, 0);
  };

  pause = (): void => {
    if (this.cursor < 0) return;
    const context = this.getContext();
    if (this.currentBuffer && context) {
      this.currentOffset = Math.min(
        this.currentBuffer.duration,
        this.currentOffset +
          Math.max(0, context.currentTime - this.currentStartTime),
      );
    }
    this.pendingPlay = false;
    this.runId += 1;
    this.cancelSources();
    this.patch({ isPlaying: false, isLoading: false });
    this.updateNotification('paused');
  };

  resume = (): void => {
    if (this.cursor < 0 || this.snapshot.currentAyahKey == null) return;
    this.prepareNativeSession();
    this.startAt(this.cursor, this.currentOffset);
  };

  toggle = (): void => {
    if (this.snapshot.isPlaying) this.pause();
    else this.resume();
  };

  stop = (): void => {
    this.pendingPlay = false;
    this.runId += 1;
    this.cancelSources();
    this.cursor = -1;
    this.currentOffset = 0;
    this.currentStartTime = 0;
    this.currentBuffer = null;
    this.nextIndex = null;
    this.nextStartTime = 0;
    this.bufferPromises.clear();
    this.patch({
      currentAyahKey: null,
      isPlaying: false,
      isLoading: false,
    });
    this.releaseNativeSession();
    PlaybackNotificationManager.hide().catch(() => {});
  };

  next = (): void => {
    const nextIndex = this.cursor + 1;
    if (this.cursor < 0 || nextIndex >= AYAH_LIST.length) return;
    this.startAt(nextIndex, 0);
  };

  previous = (): void => {
    const previousIndex = this.cursor - 1;
    if (previousIndex < 0) return;
    this.startAt(previousIndex, 0);
  };

  private startAt = (index: number, offset: number): void => {
    if (!AYAH_LIST[index]) return;
    this.pendingPlay = true;
    this.runId += 1;
    const runId = this.runId;
    this.cancelSources();
    this.cursor = index;
    this.currentOffset = offset;
    this.currentBuffer = null;
    this.nextIndex = null;
    this.patch({
      currentAyahKey: this.getAyahKey(index),
      isLoading: true,
      isPlaying: false,
    });

    const context = this.getContext();
    if (!context) {
      this.pendingPlay = false;
      this.patch({ isLoading: false });
      return;
    }

    // Fetch and decode current and next concurrently. Only the current ayah is
    // scheduled to play; the following one is scheduled once decoded.
    const currentBuffer = this.getBuffer(index);
    if (index + 1 < AYAH_LIST.length) {
      void this.getBuffer(index + 1).catch(() => {});
    }

    context
      .resume()
      .then(() => {
        currentBuffer
          .then(buffer => {
            if (runId !== this.runId || !this.pendingPlay) return;
            this.currentBuffer = buffer;
            if (offset >= buffer.duration) {
              this.currentOffset = 0;
              this.startAt(index + 1, 0);
              return;
            }
            const startTime = context.currentTime + 0.015;
            this.scheduleCurrent(index, buffer, offset, startTime, runId);
          })
          .catch(() => {
            if (runId !== this.runId) return;
            this.pendingPlay = false;
            this.patch({ isLoading: false, isPlaying: false });
          });
      })
      .catch(() => {
        if (runId === this.runId) {
          this.pendingPlay = false;
          this.patch({ isLoading: false, isPlaying: false });
        }
      });
  };

  private scheduleCurrent = (
    index: number,
    buffer: AudioBuffer,
    offset: number,
    startTime: number,
    runId: number,
  ): void => {
    if (runId !== this.runId || !this.pendingPlay) return;
    const context = this.getContext();
    if (!context) return;

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.onEnded = () => this.handleSourceEnded(index, source, runId);
    source.start(startTime, offset);

    this.cursor = index;
    this.currentBuffer = buffer;
    this.currentSource = source;
    this.currentOffset = offset;
    this.currentStartTime = startTime;
    this.patch({
      currentAyahKey: this.getAyahKey(index),
      isLoading: false,
      isPlaying: true,
    });
    this.updateNotification('playing');
    this.scheduleNext(index, buffer, startTime, runId);
  };

  private scheduleNext = (
    index: number,
    currentBuffer: AudioBuffer,
    currentStartTime: number,
    runId: number,
  ): void => {
    const indexToPreload = index + 1;
    if (indexToPreload >= AYAH_LIST.length) return;
    const startTime = currentStartTime + currentBuffer.duration;

    void this.getBuffer(indexToPreload)
      .then(buffer => {
        if (
          runId !== this.runId ||
          this.cursor !== index ||
          this.nextSource != null
        ) {
          return;
        }
        const context = this.getContext();
        if (!context) return;

        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.onEnded = () =>
          this.handleSourceEnded(indexToPreload, source, runId);
        source.start(startTime);
        this.nextSource = source;
        this.nextBuffer = buffer;
        this.nextIndex = indexToPreload;
        this.nextStartTime = startTime;
      })
      .catch(() => {
        // The current ayah continues; its end handler retries the next fetch.
      });
  };

  private handleSourceEnded = (
    index: number,
    source: AudioBufferSourceNode,
    runId: number,
  ): void => {
    if (runId !== this.runId) return;

    // A scheduled next source can begin exactly at the current source's end;
    // promote it even if the native ended callbacks arrive in reverse order.
    if (index === this.nextIndex && index === this.cursor + 1) {
      this.promoteNext(index, source, runId);
      // This path means the native end notification for the scheduled next
      // ayah overtook the previous source's notification. Advance now because
      // the promoted source has already ended.
      this.handleSourceEnded(index, source, runId);
      return;
    }
    if (index !== this.cursor || source !== this.currentSource) return;
    this.disconnectSource(source);

    const completedIndex = index;
    const followingIndex = index + 1;
    if (followingIndex >= AYAH_LIST.length) {
      this.stop();
      return;
    }

    if (this.nextIndex === followingIndex && this.nextSource) {
      this.promoteNext(followingIndex, this.nextSource, runId);
      return;
    }

    this.currentSource = null;
    this.currentBuffer = null;
    this.bufferPromises.delete(completedIndex);
    this.cursor = followingIndex;
    this.currentOffset = 0;
    this.patch({
      currentAyahKey: this.getAyahKey(followingIndex),
      isLoading: true,
      isPlaying: false,
    });
    this.updateNotification('playing');

    void this.getBuffer(followingIndex)
      .then(buffer => {
        if (runId !== this.runId || this.cursor !== followingIndex) return;
        const context = this.getContext();
        if (!context) return;
        this.scheduleCurrent(
          followingIndex,
          buffer,
          0,
          context.currentTime + 0.015,
          runId,
        );
      })
      .catch(() => {
        if (runId === this.runId && this.cursor === followingIndex) {
          this.pendingPlay = false;
          this.patch({ isLoading: false, isPlaying: false });
        }
      });
  };

  private promoteNext = (
    index: number,
    source: AudioBufferSourceNode,
    runId: number,
  ): void => {
    if (runId !== this.runId) return;
    if (this.currentSource && this.currentSource !== source) {
      this.disconnectSource(this.currentSource);
    }
    this.bufferPromises.delete(this.cursor);
    this.cursor = index;
    this.currentSource = source;
    const promotedBuffer = this.nextBuffer;
    if (!promotedBuffer) return;
    this.currentBuffer = promotedBuffer;
    this.currentOffset = 0;
    this.currentStartTime = this.nextStartTime;
    this.nextSource = null;
    this.nextBuffer = null;
    this.nextIndex = null;
    this.nextStartTime = 0;
    this.patch({
      currentAyahKey: this.getAyahKey(index),
      isLoading: false,
      isPlaying: true,
    });
    this.updateNotification('playing');
    this.scheduleNext(index, promotedBuffer, this.currentStartTime, runId);
  };

  private getBuffer = (index: number): Promise<AudioBuffer> => {
    const cached = this.bufferPromises.get(index);
    if (cached) return cached;

    const ayah = AYAH_LIST[index];
    if (!ayah) return Promise.reject(new Error('Ayah index out of range'));

    const context = this.getContext();
    if (!context) return Promise.reject(new Error('AudioContext unavailable'));

    const bufferPromise = context
      .decodeAudioData(
        getAyahStreamUrl({
          surah_number: ayah.surah,
          ayah_number: ayah.ayah,
        }),
      )
      .catch(error => {
        this.bufferPromises.delete(index);
        throw error;
      });
    this.bufferPromises.set(index, bufferPromise);
    return bufferPromise;
  };

  private getAyahKey = (index: number): string | null => {
    const ayah = AYAH_LIST[index];
    return ayah ? `${ayah.surah}:${ayah.ayah}` : null;
  };

  private cancelSources = (): void => {
    const sources = [this.currentSource, this.nextSource];
    this.currentSource = null;
    this.nextSource = null;
    this.nextBuffer = null;
    this.nextIndex = null;
    this.nextStartTime = 0;
    sources.forEach(source => {
      if (!source) return;
      try {
        source.stop();
      } catch {
        // The source may already have ended.
      }
      this.disconnectSource(source);
    });
  };

  private disconnectSource = (source: AudioBufferSourceNode): void => {
    try {
      source.disconnect();
    } catch {
      // The source may already be disconnected.
    }
  };

  private patch = (changes: Partial<AyahPlayerSnapshot>): void => {
    const keys = Object.keys(changes) as (keyof AyahPlayerSnapshot)[];
    if (!keys.some(key => this.snapshot[key] !== changes[key])) return;
    this.snapshot = { ...this.snapshot, ...changes };
    this.listeners.forEach(listener => listener(this.snapshot));
  };

  private getContext = (): AudioContext | null => {
    if (!this.context) {
      try {
        this.context = new AudioContext();
      } catch {
        return null;
      }
    }
    return this.context;
  };

  private prepareNativeSession = (): void => {
    if (!this.nativeListenersReady) {
      this.nativeListenersReady = true;
      this.listenToNativeEvents();
    }
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
      // Keep default audio-session options when native setup is unavailable.
    }
  };

  private ensureNotificationPermission = (): void => {
    if (this.notificationPermissionRequested) return;
    this.notificationPermissionRequested = true;
    try {
      AudioManager.requestNotificationPermissions().catch(() => {});
    } catch {
      // Notification controls are optional.
    }
  };

  private releaseNativeSession = (): void => {
    try {
      AudioManager.observeAudioInterruptions(false);
      AudioManager.setAudioSessionActivity(false).catch(() => {});
    } catch {
      // Ignore native cleanup failures.
    }
  };

  private listenToNativeEvents = (): void => {
    try {
      AudioManager.addSystemEventListener('interruption', event => {
        if (event.type === 'began') this.pause();
        else if (event.shouldResume) this.resume();
      });
    } catch {
      // Native interruption handling is optional.
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
      // Notification controls are optional.
    }
  };

  private updateNotification = (state: 'playing' | 'paused'): void => {
    const key = this.snapshot.currentAyahKey;
    if (!key) return;
    const [surah, ayah] = key.split(':').map(Number);
    try {
      PlaybackNotificationManager.show({
        title: `آية ${ayah}`,
        artist: SURAH_NAMES[surah] ?? `سورة ${surah}`,
        album: getReciterDisplayName(RECITER_FOLDER),
        state,
      }).catch(() => {});
    } catch {
      // Notification controls are optional.
    }
  };
}

export const ayahPlayerEngine = new AyahPlayerEngine();
