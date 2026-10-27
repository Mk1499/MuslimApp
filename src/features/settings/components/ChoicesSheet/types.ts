import { AppIcon } from '@/components/ui';

export type Choice<T extends string> = {
  value: T;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof AppIcon>['name'];
};

export type ChoiceSheetProps<T extends string> = {
  title: string;
  subtitle: string;
  choices: Choice<T>[];
  selectedValue: T;
  onSelect: (value: string) => void;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
};
