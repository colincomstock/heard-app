import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPostComment } from "../../../lib/api/post";
import { useAuth } from '@/context/useAuth';

export function useAddPostComment(postId: string) {
    const { accessToken, userId } = useAuth();
    const queryClient = useQueryClient();
    
    // Mutation currently invalidates queries to refresh the post and user data after adding a comment.
    // In the future, should write to the cache directly to avoid unnecessary network requests and improve performance.
    return useMutation({
        mutationFn: (body: string) => {
            if (!accessToken) {
                throw new Error("Cannot add comment without access token");
            }

            return addPostComment(accessToken, postId, body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue', userId] });
            queryClient.invalidateQueries({ queryKey: ['me', userId] });
        },
        onError: (error) => {
            console.error("Error adding comment:", error);
        }
    });
};