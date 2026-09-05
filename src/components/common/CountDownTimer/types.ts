export type IProps = {
  minutes: number;
  onFinish?: () => void;
  onTick?: (remainingTime: number) => void;
};
