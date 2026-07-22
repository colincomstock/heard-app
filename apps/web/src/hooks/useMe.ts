import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/useAuth';
import { getMe } from '@/lib/api/me';

export function useMe() {
    const { accessToken, userId } = useAuth();

    return useQuery({
        queryKey: ['me', userId],
        queryFn: async () =>  {
            if (!accessToken) {
                throw new Error("Cannot fetch user data without access token");
            }
            return getMe(accessToken);
        },
        placeholderData: (previousData) => previousData,
        enabled: !!accessToken && !!userId,
    });
}