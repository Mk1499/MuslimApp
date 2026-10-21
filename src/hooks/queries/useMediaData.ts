import { useQuery } from '@tanstack/react-query';
import { getLatestVideos } from '@/api/media';

export default function useMediaData() {
  const useGetLatestVideosQuery = () =>
    useQuery({
      queryKey: ['latest-videos'],
      queryFn: () => getLatestVideos(),
    });

  return { useGetLatestVideosQuery };
}
