import { getTafseerCollections } from '@/api/tafseer';
import { useQuery } from '@tanstack/react-query';

export default function useTafseerData() {
  const tafseerCollectionsQuery = useQuery({
    queryKey: ['tafseer-collections'],
    queryFn: () => getTafseerCollections(),
  });
  return {
    tafseerCollectionsQuery,
  };
}
