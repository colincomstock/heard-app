type PostRequest = {
    caption: string;
    appleMusicTrackId: string;
};

export async function createPost(token: string, { caption, appleMusicTrackId }: PostRequest): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ appleMusicTrackId, caption })
    });
    if (!response.ok) {
        throw new Error('Failed to create post');
    }
};

export async function likePost(token: string, postId: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error('Failed to like post');
    }
};

export async function unlikePost(token: string, postId: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/unlike`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error('Failed to unlike post');
    }
};