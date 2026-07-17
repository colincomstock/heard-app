import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePostComment } from "../../../lib/api/comment";
import { useAuth } from '@/context/useAuth';

type UseLikePostCommentOptions = {
    onRollback?: () => void;
};

export function useLikePostComment(commentId: string, options?: UseLikePostCommentOptions) {
    const { accessToken, userId } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            if (!accessToken) {
                throw new Error("Cannot like comment without access token");
            }

            return likePostComment(accessToken, commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue', userId] });
        },
        onError: (error) => {
            console.error("Error liking comment:", error);
            options?.onRollback?.();
        }
    });
};