import { getLikedPosts } from '@/lib/api/me';
import { useAuth } from '@/context/useAuth';
import { useQuery } from '@tanstack/react-query';

export function useGetLiked() {
    const { accessToken, userId } = useAuth();
    
    return useQuery({
        queryKey: ['liked', userId],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("Cannot fetch liked posts without access token");
            }
            return getLikedPosts(accessToken);
        },
        placeholderData: (previousData) => previousData,
        enabled: !!accessToken && !!userId,
    });
}