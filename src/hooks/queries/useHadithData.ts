import { getHadithCollections, getHadithCollectionByKey } from '@/api/hadith';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export default function useHadithData() {
  const hadithCollectionsQuery = useQuery({
    queryKey: ['hadith-collections'],
    queryFn: () => getHadithCollections(),
  });

  const useHadithCollectionQuery = (key: string) =>
    useInfiniteQuery({
      queryKey: ['hadith-collections-list', key],
      queryFn: ({ pageParam }) => getHadithCollectionByKey(key, pageParam),
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        const { page, total_pages } = lastPage.data;

        return page < total_pages ? page + 1 : undefined;
      },
    });

  return {
    hadithCollectionsQuery,
    useHadithCollectionQuery,
  };
}
