import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostComments } from '@/lib/api/comment';
import { useAuth } from '@/context/useAuth';

export function usePostComments(
    postId: string,
    enabled?: boolean
) {
    const { accessToken, userId } = useAuth();

    return useInfiniteQuery({
        queryKey: ['postComments', postId, userId],
        initialPageParam: null as string | null,
        queryFn: ({ pageParam }) => {
            if (!accessToken) {
                throw new Error('Cannot fetch post comments without an access token');
            }
            return getPostComments(accessToken, postId, {
                limit: 10,
                cursor: pageParam,
            });
        },

        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

        enabled: enabled && !!accessToken && !!postId && !!userId,
    });
};