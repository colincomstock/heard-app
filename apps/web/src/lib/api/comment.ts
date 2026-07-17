export async function likePostComment(token: string, commentId: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}/like`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error('Failed to like comment');
    }
};

export async function unlikePostComment(token: string, commentId: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}/unlike`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error('Failed to unlike comment');
    }
};

