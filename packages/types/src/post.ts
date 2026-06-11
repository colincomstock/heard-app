import type { TrackCore, TrackQueue } from './track';

export type PostCore = {
  id: string;
  caption: string | null;
  trackId: string | null;
  likeCount: number;
  commentCount: number;
  visibility: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
};

export type ProfilePost = PostCore & {
    track: TrackCore | null;
};

export type QueuePost = PostCore & {
    track: TrackQueue | null;
};
