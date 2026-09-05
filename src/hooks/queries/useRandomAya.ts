import { useQuery } from '@tanstack/react-query';
import { getRandomAya } from '@/api/randomData';

export function useRandomAya() {
  return useQuery({
    queryKey: ['random-aya'],
    queryFn: () => getRandomAya(),
  });
}
