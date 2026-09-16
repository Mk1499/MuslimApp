import { useAppStore } from '@/store/useAppStore';

export default function useFormatter() {
  const { isRTL } = useAppStore();
  const getLocalizedText = (arabic: string, english: string) => {
    return isRTL ? arabic : english;
  };
  return { getLocalizedText };
}
