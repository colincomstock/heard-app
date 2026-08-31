import type { ProfileFull, ProfilePost } from '@heard/types';

type MeResponse = { 
    profile: ProfileFull; 
    posts: ProfilePost[];
};

type LikedPostsResponse = { 
        likedPosts: ProfilePost[]; 
        nextCursor: string | null;
    };

type GetLikedPostsOptions = {
    limit?: number;
    cursor?: string | null;
};

export async function getMe(token: string): Promise<MeResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch me: ${response.statusText}`);
    }
    return response.json();
};

export async function getLikedPosts(
    token: string, 
    options: GetLikedPostsOptions = {},
): Promise<LikedPostsResponse> {
    const params = new URLSearchParams();

    params.set('limit', options.limit?.toString() ?? '10');

    if (options.cursor) {
        params.set('cursor', options.cursor);
    }

    const query = params.toString();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/me/liked?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch liked posts: ${response.statusText}`);
    }
    
    return response.json();
}
