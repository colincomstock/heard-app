import type { GenreProfile } from './genre';

export type ProfileCore = {
  id: string;
  handle: string;
  displayName: string;
  pfpUrl: string;
}

export type ProfileFull = ProfileCore & {
  bio: string | null;
  isPrivate: boolean;
  postCount: number;
  followingCount: number;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
  topGenres: GenreProfile[];
};
