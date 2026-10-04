import { useQuery } from '@tanstack/react-query';
import { getAzkarCollections, getAzkarDetailsByID } from '@/api/azkar';

export default function useAzkarData() {
  const useAzkarCollectionQuery = () =>
    useQuery({
      queryKey: ['azkar-collections-list'],
      queryFn: () => getAzkarCollections(),
    });

  const useAzkarDetailsByID = (id: string) =>
    useQuery({
      queryKey: ['azkar-details', id],
      queryFn: () => getAzkarDetailsByID(id),
    });

  return { useAzkarCollectionQuery, useAzkarDetailsByID };
}
