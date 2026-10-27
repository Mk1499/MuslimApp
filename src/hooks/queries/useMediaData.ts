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
  getAllSpeakers,
  searchMedia,
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

  const useAllSpeakersQuery = () =>
    useInfiniteQuery({
      queryKey: ['all-speakers'],
      queryFn: ({ pageParam = 1 }) => getAllSpeakers(pageParam),
      getNextPageParam: lastPage => {
        const { page, totalPages } = lastPage.pagination ?? {};
        return page && totalPages && page < totalPages ? page + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 5,
    });

  const useMediaSearchQuery = (query: string) =>
    useInfiniteQuery({
      queryKey: ['media-search', query],
      queryFn: ({ pageParam = 1 }) => searchMedia(query, pageParam, 10),
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        const { page, totalPages } = lastPage.pagination ?? {};
        if (page && totalPages) {
          return page < totalPages ? page + 1 : undefined;
        }
        const resultCount =
          (lastPage.data.speakers?.length ?? 0) +
          (lastPage.data.videos?.length ?? 0);
        return resultCount >= 10 ? Number(lastPageParam) + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: !!query,
      staleTime: 1000 * 60 * 2,
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
    useAllSpeakersQuery,
    useMediaSearchQuery,
    useMediaDashboardQueries,
    useSpeakerTopVideosQuery,
    useSpeakerLatestVideosQuery,
    useRelatedVideosQuery,
    useWatchVideoQuery,
  };
}
