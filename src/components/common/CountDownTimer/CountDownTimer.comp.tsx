import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { IProps } from './types';
import makeStyle from './style';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export default function CountDownTimer({ minutes, onFinish, onTick }: IProps) {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const [remainingTime, setRemainingTime] = React.useState(minutes * 60);
  const [seconds, setSeconds] = React.useState(remainingTime % 60);
  const [minutesLeft, setMinutesLeft] = React.useState(
    Math.floor(remainingTime / 60),
  );
  const [hoursLeft, setHoursLeft] = React.useState(
    Math.floor(remainingTime / 3600),
  );
  const intervalRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    if (minutes > 0) {
      setRemainingTime(minutes * 60);
      startTimer();
    }
  }, [minutes]);

  useEffect(() => {
    setSeconds(remainingTime % 60);
    setMinutesLeft(Math.floor((remainingTime % 3600) / 60));
    setHoursLeft(Math.floor(remainingTime / 3600));
  }, [remainingTime]);

  function startTimer() {
    intervalRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
          onFinish?.();
          return 0;
        }
        const newTime = prevTime - 1;
        onTick?.(newTime);
        return newTime;
      });
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.numberText}>
        {seconds.toString().padStart(2, '0')}
      </AppText>
      <AppText style={styles.seperator}>{':'}</AppText>
      <AppText style={styles.numberText}>
        {minutesLeft.toString().padStart(2, '0')}
      </AppText>
      <AppText style={styles.seperator}>{':'}</AppText>
      <AppText style={styles.numberText}>
        {hoursLeft.toString().padStart(2, '0')}
      </AppText>
    </View>
  );
}
