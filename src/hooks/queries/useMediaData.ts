import { useQuery } from '@tanstack/react-query';
import {
  getLatestVideos,
  getFeaturedVideos,
  getFeaturedSpeakers,
} from '@/api/media';

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

  const useGetFeaturedSpeakersQuery = () =>
    useQuery({
      queryKey: ['featured-speakers'],
      queryFn: () => getFeaturedSpeakers(),
    });

  return {
    useGetLatestVideosQuery,
    useGetFeaturedVideosQuery,
    useGetFeaturedSpeakersQuery,
  };
}
