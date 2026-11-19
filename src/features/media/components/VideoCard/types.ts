import { Video, VideoSpeaker } from '@/types/media.types';

export type VideoCardProps = {
  video: Video;
  speakers?: VideoSpeaker[];
};
