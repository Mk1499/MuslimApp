import { mediaClient } from '@/api/APIClients';
import { Video, VideoSpeaker } from '@/types/media.types';

type GetLatestVideosResponse = {
  data: Video[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type GetFeaturedSpeakersResponse = {
  data: VideoSpeaker[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type MediaSearchResponse = {
  data: {
    speakers: VideoSpeaker[];
    videos: Video[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Videos
export async function getLatestVideos(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/latest?page=1&limit=5',
  );

  return response.data;
}

export async function getMostViewedVideos(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/most-viewed?page=1&limit=5',
  );

  return response.data;
}

export async function getRelatedVideos(
  videoId: string,
): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    `/videos/${videoId}/related`,
  );
  return response.data;
}

export async function watchVideo(videoId: string): Promise<void> {
  await mediaClient.get(`/videos/${videoId}/watch`);
}

export async function getFeaturedVideos(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/featured?page=1&limit=5',
  );

  return response.data;
}

// Speakers
export async function getFeaturedSpeakers(): Promise<GetFeaturedSpeakersResponse> {
  const response = await mediaClient.get<GetFeaturedSpeakersResponse>(
    '/speakers/featured?page=1&limit=5',
  );

  return response.data;
}

export async function getAllSpeakers(
  page: number,
  limit = 24,
): Promise<GetFeaturedSpeakersResponse> {
  const response = await mediaClient.get<GetFeaturedSpeakersResponse>(
    `/speakers?page=${page}&limit=${limit}`,
  );
  return response.data;
}

export async function searchMedia(
  query: string,
  page: number,
  limit = 10,
): Promise<MediaSearchResponse> {
  const response = await mediaClient.get<MediaSearchResponse>(
    `/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`,
  );
  return response.data;
}

export async function getSpeakerLatestVideos(
  speakerId: string,
  page: number,
): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    `/videos/latest?speaker=${speakerId}&page=${page}&limit=3`,
  );

  return response.data;
}

export async function getSpeakerMostViewedVideos(
  speakerId: string,
  page: number,
): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    `/videos/most-viewed?speaker=${speakerId}&page=${page}&limit=3`,
  );

  return response.data;
}
