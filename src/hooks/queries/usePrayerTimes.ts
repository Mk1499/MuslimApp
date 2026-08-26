import { useQuery } from '@tanstack/react-query';

import { getPrayerTimes, GetPrayerTimesParams } from '@/api/prayerTimes';

export function usePrayerTimes(params: GetPrayerTimesParams) {
  return useQuery({
    queryKey: ['prayer-times', params],
    queryFn: () => getPrayerTimes(params),
  });
}
