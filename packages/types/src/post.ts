import type { TrackCore, TrackQueue, TrackViewer } from './track';
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

// New type for PostViewerData that includes TrackViewer and ProfileCore and omits comments
export type PostViewerData = PostCore & {
    track: TrackViewer;
    profile: ProfileCore;
};

// Will be removed once the refactor is complete. This type is used to maintain functionality while we refactor the track queue to use TrackViewer instead of TrackCore.
export type ProfilePost = PostCore & {
    track: TrackCore;
    profile: ProfileCore;
};

// Will be removed once the refactor is complete. This type is used to maintain functionality while we refactor the track queue to use TrackViewer instead of TrackCore.
export type QueuePost = PostCore & {
    track: TrackQueue;
    profile: ProfileCore;
    comments: Comment[];

};
