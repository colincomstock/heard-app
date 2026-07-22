import type { TrackCore, TrackQueue } from './track';
import type { Comment } from './comment';
import type { ProfileCore } from './profile';

export type PostCore = {
    id: string;
    caption: string | null;
    trackId: string | null;
    likeCount: number;
    commentCount: number;
    visibility: 'public' | 'private';
    likedByMe: boolean;
    createdAt: string;
    updatedAt: string;
};

export type ProfilePost = PostCore & {
    track: TrackCore;
    profile: ProfileCore;
};

export type QueuePost = PostCore & {
    track: TrackQueue;
    profile: ProfileCore;
    comments: Comment[];

};
