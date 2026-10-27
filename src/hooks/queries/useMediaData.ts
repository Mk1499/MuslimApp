import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import {
  getLatestVideos,
  getFeaturedVideos,
  getFeaturedSpeakers,
  getMostViewedVideos,
  getSpeakerLatestVideos,
  getSpeakerMostViewedVideos,
  getRelatedVideos,
  watchVideo,
} from '@/api/media';

export default function useMediaData() {
  const useMediaDashboardQueries = () =>
    useQueries({
      queries: [
        {
          queryKey: ['latest-videos'],
          queryFn: () => getLatestVideos(),
        },
        {
          queryKey: ['featured-videos'],
          queryFn: () => getFeaturedVideos(),
        },
        {
          queryKey: ['most-viewed-videos'],
          queryFn: () => getMostViewedVideos(),
        },
        {
          queryKey: ['featured-speakers'],
          queryFn: () => getFeaturedSpeakers(),
        },
      ],
      combine: results => ({
        data: {
          latestVideos: results[0]?.data,
          featuredVideos: results[1]?.data,
          mostViewedVideos: results[2]?.data,
          featuredSpeakers: results[3]?.data,
        },
        isLoading: results.some(result => result.isLoading),
        isError: results.some(result => result.isError),
        error: results.some(result => (result.isError ? result.error : null)),
        refetch: () => Promise.all(results.map(result => result.refetch())),
        isRefetching: results.some(result => result.isRefetching),
      }),
    });

  const useGetFeaturedSpeakersQuery = () =>
    useQuery({
      queryKey: ['featured-speakers'],
      queryFn: () => getFeaturedSpeakers(),
    });

  const useSpeakerTopVideosQuery = (speakerId: string) =>
    useInfiniteQuery({
      queryKey: ['speaker-most-viewed-videos', speakerId],
      queryFn: ({ pageParam = 1 }) =>
        getSpeakerMostViewedVideos(speakerId, pageParam),
      getNextPageParam: lastPage => {
        const { pagination } = lastPage || [];
        const { page, totalPages } = pagination ?? {};
        return page && totalPages && page < totalPages ? page + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const useSpeakerLatestVideosQuery = (speakerId: string) =>
    useInfiniteQuery({
      queryKey: ['speaker-latest-videos', speakerId],
      queryFn: ({ pageParam = 1 }) =>
        getSpeakerLatestVideos(speakerId, pageParam),
      getNextPageParam: lastPage => {
        const { pagination } = lastPage || [];
        const { page, totalPages } = pagination ?? {};
        return page && totalPages && page < totalPages ? page + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const useRelatedVideosQuery = (videoId: string) =>
    useQuery({
      queryKey: ['related-videos', videoId],
      queryFn: () => getRelatedVideos(videoId),
      enabled: !!videoId,
      staleTime: 1000 * 60 * 5,
    });

  const useWatchVideoQuery = (videoId: string) =>
    useQuery({
      queryKey: ['watch-video', videoId],
      queryFn: () => watchVideo(videoId),
      enabled: false,
    });

  return {
    useGetFeaturedSpeakersQuery,
    useMediaDashboardQueries,
    useSpeakerTopVideosQuery,
    useSpeakerLatestVideosQuery,
    useRelatedVideosQuery,
    useWatchVideoQuery,
  };
}
