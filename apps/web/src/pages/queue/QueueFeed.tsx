import { useEffect } from 'react'
import styles from './QueueFeed.module.css'
import Post from '../../features/post/Post'
import { useQuery } from '@tanstack/react-query'
import { UserAuth } from '@/context/AuthContext'
import { getQueuePosts } from '@/lib/api/queue'
import type { QueuePost } from '@heard/types'
import { useAudioPlayer } from '@/context/AudioPlayerContext'

export default function QueueFeed() {

    const { session } = UserAuth()!;
    const { pause } = useAudioPlayer();

    const {data, isPending, isError} = useQuery({
        queryKey: ['queue', session?.user?.id],
        queryFn: () => getQueuePosts(session!.access_token),
        placeholderData: (previousData) => previousData,
        enabled: !!session?.access_token,
    });

    useEffect(() => {
        return () => {
            pause(); // Pause audio when the component unmounts
        }
    }, [pause]);

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Something went wrong.</div>;

    return (
        <>
            <div className={styles.feed}>
                {data.posts && data.posts.length > 0 ? data.posts.map((post: QueuePost) => (
                    <Post key={post.id} {...post}/>
                )) : <div>No posts available.</div>}
            </div>
            
        </>
    )
}