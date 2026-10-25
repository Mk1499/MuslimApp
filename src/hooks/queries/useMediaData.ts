import { useQuery } from '@tanstack/react-query';
import { getLatestVideos, getFeaturedVideos } from '@/api/media';

export default function useMediaData() {
  const useGetLatestVideosQuery = () =>
    useQuery({
      queryKey: ['latest-videos'],
      queryFn: () => getLatestVideos(),
    });

  const useGetFeaturedVideosQuery = () =>
    useQuery({
      queryKey: ['featured-videos'],
      queryFn: () => getFeaturedVideos(),
    });

  return { useGetLatestVideosQuery, useGetFeaturedVideosQuery };
}
