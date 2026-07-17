import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unlikePost } from "../../../lib/api/post";
import { useAuth } from '@/context/useAuth';

type UseUnlikePostOptions = {
    onRollback?: () => void;
};

export function useUnlikePost(postId: string, options?: UseUnlikePostOptions) {
    const { accessToken, userId } = useAuth();
    const queryClient = useQueryClient();

    // Mutation currently invalidates queries to refresh the post and user data after unliking a post.
    // In the future, should write to the cache directly to avoid unnecessary network requests and improve performance.

    return useMutation({
        mutationFn: () => {
            if (!accessToken) {
                throw new Error("Cannot unlike post without access token");
            }

            return unlikePost(accessToken, postId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue', userId] });
            queryClient.invalidateQueries({ queryKey: ['me', userId] });
        },
        onError: (error) => {
            console.error("Error unliking post:", error);
            options?.onRollback?.();
        }
    });
}