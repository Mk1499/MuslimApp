import { mediaClient } from '@/api/APIClients';
import { Video } from '@/types/media.types';

type GetLatestVideosResponse = {
  data: Video[];
};

export async function getLatestVideos(): Promise<GetLatestVideosResponse> {
  const response = await mediaClient.get<GetLatestVideosResponse>(
    '/videos/all',
  );

  return response.data;
}
