import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, Switch, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  AudioContext,
  AudioManager,
  type AudioBufferSourceNode,
} from 'react-native-audio-api';
import notifee, {
  AndroidNotificationSetting,
  AuthorizationStatus,
} from 'react-native-notify-kit';
import { useTranslation } from 'react-i18next';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppCard,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '@/components/ui';
import { isIOS, useTheme } from '@/theme';
import {
  PRAYER_NAMES,
  type TrackedPrayer,
} from '@/store/usePrayerTrackerStore';
import {
  ATHAN_SOUNDS,
  useAthanSettingsStore,
  type AthanSoundId,
} from '@/store/useAthanSettingsStore';
import { isRTL } from '@/utils/constants';
import makeStyles from './styles';
import { rescheduleAthanNotificationsForCurrentSettings } from './athanNotifications';

const SOUND_ASSETS: Record<AthanSoundId, number> = {
  default_azan: require('@/assets/sounds/default_azan.mp3'),
  banna_azan: require('@/assets/sounds/Azans/banna_azan.mp3'),
  haram_azan: require('@/assets/sounds/Azans/haram_azan.mp3'),
  qatamy_azan: require('@/assets/sounds/Azans/qatamy_azan.mp3'),
  abdelbaset_azan: require('@/assets/sounds/Azans/abdelbaset_azan.mp3'),
  refaat_azan: require('@/assets/sounds/Azans/refaat_azan.mp3'),
};

export default function AthanSettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const enabled = useAthanSettingsStore(state => state.enabled);
  const sound = useAthanSettingsStore(state => state.sound);
  const setPrayerEnabled = useAthanSettingsStore(
    state => state.setPrayerEnabled,
  );
  const setSound = useAthanSettingsStore(state => state.setSound);
  const soundSheetRef = useRef<AppBottomSheetRef>(null);
  const permissionPromptedRef = useRef(false);
  const [pendingPrayer, setPendingPrayer] = useState<TrackedPrayer | null>(
    null,
  );
  const [previewSound, setPreviewSound] = useState<AthanSoundId | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<AthanSoundId | null>(
    null,
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const previewRunRef = useRef(0);

  const stopPreview = useCallback((updateUi = true) => {
    previewRunRef.current += 1;
    const source = audioSourceRef.current;
    audioSourceRef.current = null;
    if (source) {
      source.onEnded = null;
      try {
        source.stop();
        source.disconnect();
      } catch {
        // The source may have finished between the tap and this cleanup.
      }
    }
    if (updateUi) {
      setPreviewSound(null);
      setLoadingPreview(null);
    }
    const context = audioContextRef.current;
    if (context) void context.suspend().catch(() => undefined);
    void AudioManager.setAudioSessionActivity(false).catch(() => undefined);
  }, []);

  const playPreview = useCallback(
    async (soundId: AthanSoundId) => {
      if (previewSound === soundId) {
        stopPreview();
        return;
      }

      stopPreview();
      const runId = previewRunRef.current;
      setLoadingPreview(soundId);

      try {
        const context = audioContextRef.current ?? new AudioContext();
        audioContextRef.current = context;
        AudioManager.setAudioSessionOptions({
          iosCategory: 'playback',
          iosMode: 'spokenAudio',
          iosOptions: ['duckOthers'],
        });
        await AudioManager.setAudioSessionActivity(true);
        await context.resume();
        const buffer = await context.decodeAudioData(SOUND_ASSETS[soundId]);

        if (previewRunRef.current !== runId) {
          await context.suspend();
          await AudioManager.setAudioSessionActivity(false);
          return;
        }

        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.onEnded = () => {
          if (previewRunRef.current !== runId) return;
          source.disconnect();
          audioSourceRef.current = null;
          setPreviewSound(null);
          void context.suspend();
          void AudioManager.setAudioSessionActivity(false);
        };
        audioSourceRef.current = source;
        setPreviewSound(soundId);
        source.start();
      } catch {
        if (previewRunRef.current === runId) {
          Alert.alert(
            t('athan.previewErrorTitle'),
            t('athan.previewErrorMessage'),
          );
          stopPreview();
        }
      } finally {
        if (previewRunRef.current === runId) setLoadingPreview(null);
      }
    },
    [previewSound, stopPreview, t],
  );

  useEffect(
    () => () => {
      stopPreview(false);
      const context = audioContextRef.current;
      audioContextRef.current = null;
      if (context) void context.close().catch(() => undefined);
    },
    [stopPreview],
  );

  useEffect(() => {
    let active = true;
    async function requestNotificationPermissionIfNeeded() {
      if (permissionPromptedRef.current) return;
      if (
        !PRAYER_NAMES.some(
          prayer => useAthanSettingsStore.getState().enabled[prayer],
        )
      ) {
        return;
      }
      permissionPromptedRef.current = true;
      try {
        let settings = await notifee.getNotificationSettings();
        let requestedNow = false;
        if (
          settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
          settings.authorizationStatus !== AuthorizationStatus.PROVISIONAL
        ) {
          requestedNow = true;
          settings = await notifee.requestPermission();
        }
        if (!active) return;

        if (
          settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
          settings.authorizationStatus !== AuthorizationStatus.PROVISIONAL
        ) {
          Alert.alert(
            t('athan.permissionTitle'),
            t('athan.permissionMessage'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('athan.openSettings'),
                onPress: () => void notifee.openNotificationSettings(),
              },
            ],
          );
        } else if (
          Platform.OS === 'android' &&
          settings.android.alarm === AndroidNotificationSetting.DISABLED
        ) {
          Alert.alert(
            t('athan.exactAlarmTitle'),
            t('athan.exactAlarmMessage'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('athan.openSettings'),
                onPress: () => void notifee.openAlarmPermissionSettings(),
              },
            ],
          );
          if (requestedNow) {
            void rescheduleAthanNotificationsForCurrentSettings().catch(
              error => {
                console.warn('Unable to refresh Athan reminders:', error);
              },
            );
          }
        } else if (requestedNow) {
          void rescheduleAthanNotificationsForCurrentSettings().catch(error => {
            console.warn('Unable to refresh Athan reminders:', error);
          });
        }
      } catch {
        // The per-prayer switches remain usable if permission status is unavailable.
      }
    }

    void requestNotificationPermissionIfNeeded();
    return () => {
      active = false;
    };
  }, [t]);

  async function togglePrayer(prayer: TrackedPrayer, value: boolean) {
    if (!value) {
      setPrayerEnabled(prayer, false);
      return;
    }

    setPendingPrayer(prayer);
    try {
      let settings = await notifee.getNotificationSettings();
      if (
        settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
        settings.authorizationStatus !== AuthorizationStatus.PROVISIONAL
      ) {
        settings = await notifee.requestPermission();
      }

      if (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      ) {
        setPrayerEnabled(prayer, true);
        if (
          Platform.OS === 'android' &&
          settings.android.alarm === AndroidNotificationSetting.DISABLED
        ) {
          Alert.alert(
            t('athan.exactAlarmTitle'),
            t('athan.exactAlarmMessage'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('athan.openSettings'),
                onPress: () => void notifee.openAlarmPermissionSettings(),
              },
            ],
          );
        }
      } else {
        Alert.alert(t('athan.permissionTitle'), t('athan.permissionMessage'), [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('athan.openSettings'),
            onPress: () => void notifee.openNotificationSettings(),
          },
        ]);
      }
    } catch {
      Alert.alert(t('athan.permissionTitle'), t('athan.permissionMessage'));
    } finally {
      setPendingPrayer(null);
    }
  }

  function soundName(soundId: AthanSoundId): string {
    const option = ATHAN_SOUNDS.find(item => item.id === soundId);
    return option ? t(`athan.sounds.${option.translationKey}`) : '';
  }

  return (
    <Screen isInnerPage screenTitle={t('athan.title')} scroll padded>
      <AppText variant="body" style={styles.description}>
        {t('athan.description')}
      </AppText>

      <AppText variant="subtitle" weight="semiBold" style={styles.sectionTitle}>
        {t('athan.prayersTitle')}
      </AppText>
      <AppCard padded={false} style={styles.optionsCard}>
        {PRAYER_NAMES.map((prayer, index) => (
          <React.Fragment key={prayer}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.prayerOption}>
              <View style={styles.prayerCopy}>
                <AppText
                  variant="body"
                  weight="semiBold"
                  style={styles.rowTitle}
                >
                  {t(`prayerTimes.${prayer}`)}
                </AppText>
                <AppText variant="caption" style={styles.rowSubtitle}>
                  {t(enabled[prayer] ? 'athan.enabled' : 'athan.disabled')}
                </AppText>
              </View>
              <Switch
                value={enabled[prayer]}
                disabled={pendingPrayer !== null}
                onValueChange={value => void togglePrayer(prayer, value)}
                trackColor={{
                  false: theme.divider,
                  true: theme.button.primaryBg,
                }}
                thumbColor={theme.basic.white}
                accessibilityLabel={t(`prayerTimes.${prayer}`)}
              />
            </View>
          </React.Fragment>
        ))}
      </AppCard>

      <AppText variant="subtitle" weight="semiBold" style={styles.sectionTitle}>
        {t('athan.soundTitle')}
      </AppText>
      <AppTouchable
        variant="ghost"
        style={styles.soundSelector}
        onPress={() => soundSheetRef.current?.present()}
        accessibilityRole="button"
      >
        <View style={styles.soundIcon}>
          <AppIcon
            name="volume-high-outline"
            size={20}
            color={theme.text.brand}
          />
        </View>
        <View style={styles.soundCopy}>
          <AppText variant="body" weight="semiBold" style={styles.rowTitle}>
            {soundName(sound)}
          </AppText>
          <AppText variant="caption" style={styles.rowSubtitle}>
            {isIOS
              ? t('athan.soundDescription')
              : t('athan.soundDescriptionAndroid')}
          </AppText>
        </View>
        <AppIcon
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={theme.text.muted}
        />
      </AppTouchable>

      <AppBottomSheet
        ref={soundSheetRef}
        snapPoints={['55%']}
        scrollable
        onDismiss={stopPreview}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <AppText
            variant="subtitle"
            weight="semiBold"
            style={styles.sheetTitle}
          >
            {t('athan.chooseSound')}
          </AppText>
          {ATHAN_SOUNDS.map(option => (
            <View
              key={option.id}
              style={[
                styles.soundOption,
                sound === option.id && styles.selectedSoundOption,
              ]}
            >
              <AppTouchable
                variant="ghost"
                style={styles.soundSelectAction}
                onPress={() => {
                  setSound(option.id);
                  soundSheetRef.current?.dismiss();
                  stopPreview();
                }}
              >
                <View style={styles.soundOptionCopy}>
                  <AppText
                    variant="body"
                    style={[
                      styles.rowTitle,
                      sound === option.id
                        ? styles.selectedSoundText
                        : undefined,
                    ]}
                  >
                    {t(`athan.sounds.${option.translationKey}`)}
                  </AppText>
                </View>
              </AppTouchable>
              <AppTouchable
                variant="ghost"
                style={styles.previewButton}
                accessibilityRole="button"
                accessibilityLabel={t(
                  previewSound === option.id
                    ? 'athan.stopPreview'
                    : 'athan.playPreview',
                )}
                disabled={loadingPreview !== null}
                onPress={() => void playPreview(option.id)}
              >
                <AppIcon
                  name={
                    loadingPreview === option.id
                      ? 'time-outline'
                      : previewSound === option.id
                      ? 'pause-circle-outline'
                      : 'play-circle-outline'
                  }
                  size={25}
                  color={
                    sound === option.id ? theme.accent.soft : theme.text.muted
                  }
                />
              </AppTouchable>
            </View>
          ))}
        </BottomSheetScrollView>
      </AppBottomSheet>
    </Screen>
  );
}
