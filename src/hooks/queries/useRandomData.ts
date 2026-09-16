import { useQuery } from '@tanstack/react-query';
import { getRandomAya, getRandomDuaa, getRandomHadith } from '@/api/randomData';

export default function useRandomData() {
  const randomAyaQuery = useQuery({
    queryKey: ['random-aya'],
    queryFn: () => getRandomAya(),
  });

  const randomHadithQuery = useQuery({
    queryKey: ['random-hadith'],
    queryFn: () => getRandomHadith(),
  });

  const randomDuaaQuery = useQuery({
    queryKey: ['random-duaa'],
    queryFn: () => getRandomDuaa(),
  });

  return {
    randomAyaQuery,
    randomHadithQuery,
    randomDuaaQuery,
  };
}
