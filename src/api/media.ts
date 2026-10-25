import { mediaClient } from '@/api/APIClients';
import { Video, VideoSpeaker } from '@/types/media.types';

type GetLatestVideosResponse = {
  data: Video[];
};

type GetFeaturedSpeakersResponse = {
  data: VideoSpeaker[];
};

// Videos
export async function getLatestVideos(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/published?page=1&limit=5',
  );

  return response.data;
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
