import { ReactNode } from 'react';
import { SharedValue } from 'react-native-reanimated';

export default interface TafseerCardProps {
  text: string;
  tafsir: string;
}

interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  viewKey: string;
  duration?: number;
}
