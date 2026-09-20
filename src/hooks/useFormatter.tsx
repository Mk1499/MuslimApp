import { useAppStore } from '@/store/useAppStore';

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export default function useFormatter() {
  const { isRTL } = useAppStore();
  const getLocalizedText = (arabic: string, english: string) => {
    return isRTL ? arabic : english;
  };

  function toArabicIndic(num: number): string {
    return String(num)
      .split('')
      .map(d => ARABIC_INDIC_DIGITS[parseInt(d, 10)])
      .join('');
  }

  return { getLocalizedText, toArabicIndic };
}
