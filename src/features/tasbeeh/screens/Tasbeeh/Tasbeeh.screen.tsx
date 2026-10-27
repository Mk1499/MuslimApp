import React, { useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
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
import { useTheme } from '@/theme';
import makeStyles from './styles';

const ADHKAR = [
  { id: 'subhanAllah', arabic: 'سُبْحَانَ اللَّهِ', goal: 33 },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', goal: 33 },
  { id: 'allahuAkbar', arabic: 'اللَّهُ أَكْبَرُ', goal: 34 },
  { id: 'laIlahaIllallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', goal: 100 },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', goal: 100 },
  {
    id: 'subhanAllahiWaBihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    goal: 100,
  },
] as const;

type DhikrId = (typeof ADHKAR)[number]['id'];
const DOT_COUNT = 48;

export default function TasbeehScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [selectedId, setSelectedId] = useState<DhikrId>(ADHKAR[0].id);
  const [count, setCount] = useState(0);
  const sheetRef = useRef<AppBottomSheetRef>(null);
  const selectedDhikr = useMemo(
    () => ADHKAR.find(item => item.id === selectedId) ?? ADHKAR[0],
    [selectedId],
  );
  const isComplete = count >= selectedDhikr.goal;

  const selectDhikr = (id: DhikrId) => {
    setSelectedId(id);
    setCount(0);
    sheetRef.current?.dismiss();
  };

  return (
    <Screen
      isInnerPage
      screenTitle={t('tasbeeh.title')}
      withBGPattern={false}
      withBottomSafeArea={false}
    >
      <View style={styles.screenContent}>
        <AppTouchable
          variant="secondary"
          onPress={() => sheetRef.current?.present()}
          accessibilityRole="button"
          style={styles.dhikrPicker}
        >
          <View style={styles.pickerCopy}>
            <AppText variant="caption" style={styles.pickerLabel}>
              {t('tasbeeh.selectedDhikr')}
            </AppText>
            <AppText
              variant="body"
              weight="semiBold"
              style={styles.pickerTitle}
            >
              {t(`tasbeeh.adhkar.${selectedDhikr.id}`)}
            </AppText>
          </View>
          <View style={styles.pickerGoal}>
            <AppText variant="caption" style={styles.pickerGoalText}>
              {t('tasbeeh.goalCount', { count: selectedDhikr.goal })}
            </AppText>
            <AppIcon
              name="chevron-down"
              size={18}
              color={theme.text.highlight}
            />
          </View>
        </AppTouchable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('tasbeeh.tapToCount')}
          accessibilityHint={t('tasbeeh.tapHint')}
          onPress={() =>
            setCount(current => Math.min(current + 1, selectedDhikr.goal))
          }
          style={styles.counterArea}
        >
          <View style={styles.progressCircle} pointerEvents="none">
            {Array.from({ length: DOT_COUNT }, (_, index) => {
              const angle = (index / DOT_COUNT) * Math.PI * 2 - Math.PI / 2;
              const dotSize = 8;
              const radius = 128;
              const activeDots = Math.round(
                (count / selectedDhikr.goal) * DOT_COUNT,
              );
              return (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      left: 140 + Math.cos(angle) * radius - dotSize / 2,
                      top: 140 + Math.sin(angle) * radius - dotSize / 2,
                      width: dotSize,
                      height: dotSize,
                      backgroundColor:
                        index < activeDots
                          ? theme.text.brand
                          : theme.card.border,
                      opacity: index < activeDots ? 1 : 0.7,
                    },
                  ]}
                />
              );
            })}
            <View style={styles.counterFace}>
              <AppText variant="caption" style={styles.counterEyebrow}>
                {isComplete
                  ? t('tasbeeh.completed')
                  : t('tasbeeh.progressLabel')}
              </AppText>
              <AppText style={styles.arabicDhikr}>
                {selectedDhikr.arabic}
              </AppText>
              <AppText variant="display" style={styles.countText}>
                {count}
              </AppText>
              <View style={styles.goalDivider} />
              <AppText variant="caption" style={styles.goalText}>
                {t('tasbeeh.ofGoal', { goal: selectedDhikr.goal })}
              </AppText>
            </View>
          </View>
          <AppText variant="caption" style={styles.tapHint}>
            {isComplete ? t('tasbeeh.goalReached') : t('tasbeeh.tapToCount')}
          </AppText>
        </Pressable>

        <View style={styles.bottomActions}>
          <AppTouchable
            variant="ghost"
            onPress={() => setCount(0)}
            accessibilityRole="button"
            style={styles.resetButton}
          >
            <AppIcon
              name="refresh-outline"
              size={19}
              color={theme.text.secondary}
            />
            <AppText variant="caption" style={styles.resetText}>
              {t('tasbeeh.reset')}
            </AppText>
          </AppTouchable>
          <AppText variant="caption" style={styles.goalSummary}>
            {t('tasbeeh.goalCount', { count: selectedDhikr.goal })}
          </AppText>
        </View>
      </View>

      <AppBottomSheet ref={sheetRef} snapPoints={['70%']} scrollable>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <AppText
            variant="subtitle"
            weight="semiBold"
            style={styles.sheetTitle}
          >
            {t('tasbeeh.chooseDhikr')}
          </AppText>
          <AppText variant="caption" style={styles.sheetSubtitle}>
            {t('tasbeeh.chooseDhikrSubtitle')}
          </AppText>
          <View style={styles.dhikrList}>
            {ADHKAR.map(item => {
              const selected = item.id === selectedId;
              return (
                <AppTouchable
                  key={item.id}
                  variant="ghost"
                  onPress={() => selectDhikr(item.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={styles.dhikrOption}
                >
                  <AppCard
                    padded={false}
                    style={[
                      styles.dhikrOptionCard,
                      selected ? styles.dhikrOptionSelected : undefined,
                    ]}
                  >
                    <View style={styles.dhikrOptionCopy}>
                      <AppText
                        variant="body"
                        weight="semiBold"
                        style={styles.dhikrOptionTitle}
                      >
                        {t(`tasbeeh.adhkar.${item.id}`)}
                      </AppText>
                      <AppText variant="caption" style={styles.dhikrOptionGoal}>
                        {t('tasbeeh.goalCount', { count: item.goal })}
                      </AppText>
                    </View>
                    <AppText style={styles.dhikrOptionArabic}>
                      {item.arabic}
                    </AppText>
                    {selected && (
                      <AppIcon
                        name="checkmark-circle"
                        size={20}
                        color={theme.text.brand}
                      />
                    )}
                  </AppCard>
                </AppTouchable>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </AppBottomSheet>
    </Screen>
  );
}
