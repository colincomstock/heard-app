import { getLikedPosts } from '@/lib/api/me';
import { useAuth } from '@/context/useAuth';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useGetLiked() {
    const { accessToken, userId } = useAuth();
    
    return useInfiniteQuery({
        queryKey: ['liked', userId],
        initialPageParam: null as string | null,
        queryFn: ({ pageParam }) => {
            if (!accessToken) {
                throw new Error("Cannot fetch liked posts without access token");
            }
            return getLikedPosts(accessToken, {
                    limit: 10,
                    cursor: pageParam,
            });
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        placeholderData: (previousData) => previousData,
        enabled: !!accessToken && !!userId,
    });
}