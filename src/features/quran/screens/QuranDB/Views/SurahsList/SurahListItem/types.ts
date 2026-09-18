import type { Surah } from '@/types/surah';

export type IProps = {
  surah: Surah;
  onPress?: (surah: Surah) => void;
};
