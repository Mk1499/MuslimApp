export type VideoCategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  nameAr: string;
  nameEn: string;
};

export type VideoSpeaker = {
  _id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  bio: string;
  bioAr: string;
  bioEn: string;
  imageUrl: string;
  instagramProfileUrl: string;
  tiktokProfileUrl: string;
  facebookProfileUrl: string;
  youtubeProfileUrl: string;
  isActive: boolean;
  views: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Video = {
  _id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  publishedAt: string;
  views: number;
  duration: number;
  categories: VideoCategory[];
  speakers: VideoSpeaker[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
