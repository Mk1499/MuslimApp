import { getHadithCollections } from '@/api/hadith';
import { useQuery } from '@tanstack/react-query';

export default function useHadithData() {
  const hadithCollectionsQuery = useQuery({
    queryKey: ['hadith-collections'],
    queryFn: () => getHadithCollections(),
  });

  return {
    hadithCollectionsQuery,
  };
}
