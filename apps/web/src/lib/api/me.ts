import type { Profile, ProfilePost } from '@heard/types';

type MeResponse = { profile: Profile; posts: ProfilePost[] };

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