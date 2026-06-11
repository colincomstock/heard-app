import type { Genre } from './genre';

export type TrackCore = {
  id: string;
  title: string;
  album: string;
  artistName: string;
  artistNames: string[];
  coverUrl: string;
  coverColorVibrant: string;
  coverColorDarkVibrant: string;
  coverColorDarkContrast: string;
  genres: Genre[];
};

export type TrackQueue = TrackCore & {
    appleMusicUrl: string;
    spotifyUrl: string | null;
    songPreviewUrl: string;
    durationMs: number;
    releaseDate: string;
};
