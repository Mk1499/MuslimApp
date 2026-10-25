import { useAppStore } from '@/store/useAppStore';

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export default function useFormatter() {
  const { isRTL } = useAppStore();
  const getLocalizedText = (arabic?: string, english?: string) => {
    if (isRTL && !!arabic) return arabic;
    if (!isRTL && !!english) return english;
    return isRTL ? arabic : english;
  };

  function toArabicIndic(num: number): string {
    return String(num)
      .split('')
      .map(d => ARABIC_INDIC_DIGITS[parseInt(d, 10)])
      .join('');
  }

  function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    seconds %= 3600;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs} : ${mins.toString().padStart(2, '0')} : ${secs
          .toString()
          .padStart(2, '0')}`
      : `${mins} : ${secs.toString().padStart(2, '0')}`;
  }

  return { getLocalizedText, toArabicIndic, formatDuration };
}
