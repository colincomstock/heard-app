import type { Comment } from "@heard/types";

type GetPostCommentsOptions = {
    limit?: number | null;
    cursor?: string | null;
};

type GetPostCommentsResponse = {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
};

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

// Function to get comments for a specific post with optional pagination using limit and cursor
export async function getPostComments(
    token: string, 
    postId: string, 
    options: GetPostCommentsOptions = {}
): Promise<GetPostCommentsResponse> {
    const queryParams = new URLSearchParams();

    queryParams.set("limit", options.limit?.toString() ?? "10");

    if (options.cursor) {
        queryParams.set("cursor", options.cursor);
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments?${queryParams}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        },
    );

    if (!response.ok) {
        throw new Error(
        `Failed to fetch comments: ${response.statusText}`,
        );
    }

    return response.json();
}
