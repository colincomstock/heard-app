import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost } from "../../../lib/api/post";
import { useAuth } from '@/context/useAuth';

type UseLikePostOptions = {
    onRollback?: () => void;
};

export function useLikePost(postId: string, options?: UseLikePostOptions) {
    const { accessToken, userId } = useAuth();
    const queryClient = useQueryClient();

    // Mutation currently invalidates queries to refresh the post and user data after liking a post.
    // In the future, should write to the cache directly to avoid unnecessary network requests and improve performance.

    return useMutation({
        mutationFn: () => {
            if (!accessToken) {
                throw new Error("Cannot like post without access token");
            }

            return likePost(accessToken, postId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue', userId] });
            queryClient.invalidateQueries({ queryKey: ['me', userId] });
        },
        onError: (error) => {
            console.error("Error liking post:", error);
            options?.onRollback?.();
        }
    });
}