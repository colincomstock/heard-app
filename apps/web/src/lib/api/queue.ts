import type { QueuePost } from '@heard/types';

type QueueResponse = { posts: QueuePost[] };

export async function getQueuePosts(token: string): Promise<QueueResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/queue`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching queue posts: ${response.statusText}`);
    }
    return response.json() as Promise<QueueResponse>;
};