import { useQuery } from '@tanstack/react-query';
import { getTodayHijriDate } from '@/api/todayHijriDate';

export function useTodayHijriDate() {
  return useQuery({
    queryKey: ['today-hijri-date'],
    queryFn: () => getTodayHijriDate(),
  });
}
