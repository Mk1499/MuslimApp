export type CommonListItemProps = {
  id?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  withChevron?: boolean;
  icon?: React.ReactNode;
  value?: string | number;
};
