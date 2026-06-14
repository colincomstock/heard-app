export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  pfpUrl: string;
  bio: string | null;
  isPrivate: boolean;
  postCount: number;
  followingCount: number;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
};
