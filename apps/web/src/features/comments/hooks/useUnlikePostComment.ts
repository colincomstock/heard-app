import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unlikePostComment } from "../../../lib/api/comment";
import { useAuth } from '@/context/useAuth';

type UseUnlikePostCommentOptions = {
    onRollback?: () => void;
};

export function useUnlikePostComment(commentId: string, options?: UseUnlikePostCommentOptions) {
    const { accessToken, userId } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            if (!accessToken) {
                throw new Error("Cannot unlike comment without access token");
            }

            return unlikePostComment(accessToken, commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue', userId] });
        },
        onError: (error) => {
            console.error("Error unliking comment:", error);
            options?.onRollback?.();
        }
    });
};