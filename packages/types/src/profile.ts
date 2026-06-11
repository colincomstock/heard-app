export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  pfpUrl: string;
  bio: string | null;
  isPrivate: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
};
