import type { ProfileFull, ProfilePost } from '@heard/types';

type MeResponse = { profile: ProfileFull; posts: ProfilePost[] };
type LikedPostsResponse = { likedPosts: ProfilePost[]; nextCursor: string | null };

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

export async function getLikedPosts(token: string): Promise<LikedPostsResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/me/liked`, {
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
