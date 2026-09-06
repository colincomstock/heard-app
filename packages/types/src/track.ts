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
  genres: Genre[];
};

export type TrackViewer = TrackCore & {
  appleMusicUrl: string;
  spotifyUrl: string | null;
  songPreviewUrl: string;
  releaseDate: string;
};

// Temporary type to maintain functionality while we refactor the track queue to use TrackViewer instead of TrackCore. This will be removed once the refactor is complete.
export type TrackQueue = TrackViewer;
