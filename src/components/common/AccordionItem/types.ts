import { ReactNode } from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  viewKey: string;
  duration?: number;
}
