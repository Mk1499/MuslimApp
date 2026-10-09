import { useInfiniteQuery } from '@tanstack/react-query';
import { getSurahsMutashbihat } from '@/api/mutashabihat';

export default function useMutashabihatData() {
  const useSurahMutashabihatQuery = (surahNumber: number) =>
    useInfiniteQuery({
      queryKey: ['surah-mutashabihat', surahNumber],
      queryFn: ({ pageParam }) => getSurahsMutashbihat(surahNumber, pageParam),
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        const { page, total_pages } = lastPage.data;
        return page < total_pages ? page + 1 : undefined;
      },
    });

  return {
    useSurahMutashabihatQuery,
  };
}
