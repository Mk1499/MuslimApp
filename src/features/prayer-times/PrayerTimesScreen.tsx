import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppIcon, AppText, Screen } from '../../components/ui';
import { useTheme } from '../../theme';
import makeStyles from './styles';
import { Pressable } from 'react-native';
import moment from 'moment';

export function PrayerTimesScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Screen isInnerPage padded style={styles.container}>
      <Pressable>
        <AppText style={styles.dateText}>
          {moment(selectedDate).format('LL')}
        </AppText>
      </Pressable>
    </Screen>
  );
}
