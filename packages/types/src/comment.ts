import type { ProfileCore } from './profile';

export type Comment = {
    id: string;
    userId: string;
    body: string;
    likeCount: number;
    likedByMe: boolean;
    createdAt: string;
    updatedAt: string;
    profile: ProfileCore;
};