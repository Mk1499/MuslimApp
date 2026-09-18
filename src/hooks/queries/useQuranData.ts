import { getSurahsList } from '@/api/quran';
import { useQuery } from '@tanstack/react-query';

export default function useQuranData() {
  const listSurahsQuery = useQuery({
    queryKey: ['list-surahs'],
    queryFn: () => getSurahsList(),
  });

  return {
    listSurahsQuery,
  };
}
