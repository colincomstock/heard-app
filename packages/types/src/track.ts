import type { Genre } from './genre';

export type TrackCore = {
  id: string;
  title: string;
  album: string;
  artistName: string;
  artistNames: string[];
  coverUrl: string;
  appleBgColor: string;
  appleTextColor1: string;
  appleTextColor2: string;
  appleTextColor3: string;
  appleTextColor4: string;
  coverColorVibrant: string;
  coverColorDarkVibrant: string;
  coverColorDarkContrast: string;
  genres: Genre[];
};

export type TrackQueue = TrackCore & {
  appleMusicUrl: string;
  spotifyUrl: string | null;
  songPreviewUrl: string;
  releaseDate: string;
};
