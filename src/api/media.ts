import { mediaClient } from '@/api/APIClients';
import { Video } from '@/types/media.types';

type GetLatestVideosResponse = {
  data: Video[];
};

export async function getLatestVideos(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/published',
  );

  return response.data;
}

export async function getLatestSpeakers(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/published',
  );

  return response.data;
}
