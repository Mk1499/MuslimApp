import { useQuery } from '@tanstack/react-query';
import { getAzkarCollections } from '@/api/azkar';

export default function useAzkarData() {
  const useAzkarCollectionQuery = () =>
    useQuery({
      queryKey: ['azkar-collections-list'],
      queryFn: () => getAzkarCollections(),
    });

  return { useAzkarCollectionQuery };
}
