export type IProps = {
  incMode?: boolean;
  minutes: number;
  onFinish?: () => void;
  onTick?: (remainingTime: number) => void;
};
