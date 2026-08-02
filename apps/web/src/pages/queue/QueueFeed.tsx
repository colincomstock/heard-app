import { useEffect } from 'react'
import styles from './QueueFeed.module.css'
import Post from '../../features/post/Post'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/useAuth'
import { getQueuePosts } from '@/lib/api/queue'
import { useAudioPlayer } from '@/context/useAudioPlayer'
import { useAppChrome } from '@/context/useAppChrome'
import { VolumeX, Volume2 } from 'lucide-react'
import queueIcon from '../../assets/queue-icon-4.png'

export default function QueueFeed() {

    const { setHeader, resetHeader } = useAppChrome();
    const { isMuted, setMuted, pause } = useAudioPlayer();

    useEffect(() => {
        setHeader({
            visible: true,
            title: 'queue',
            image: queueIcon,
            right: [
                {
                    id: 'mute-toggle',
                    label: isMuted ? 'Unmute' : 'Mute',
                    icon: isMuted ? <VolumeX /> : <Volume2 />,
                    onClick: () => setMuted(!isMuted),
                },
            ],
        });

        return resetHeader; // Reset header when component unmounts
    }, [setHeader, resetHeader, isMuted, setMuted]);

    // Split resetHeader into a separate effect to prevent 
    // unnecessary re-renders of the header when the mute state changes
    useEffect(() => {
        return resetHeader;
    }, [resetHeader]);

    const { accessToken, userId } = useAuth();

    const {data, isPending, isError} = useQuery({
        queryKey: ['queue', userId],
        queryFn: () => {
            if (!accessToken) {
                throw new Error("Cannot fetch queue posts without access token");
            }
            return getQueuePosts(accessToken);
        },
        placeholderData: (previousData) => previousData,
        enabled: !!accessToken,
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
                {data.posts && data.posts.length > 0 ? data.posts.map((post) => (
                    <Post key={post.id} {...post}/>
                )) : <div>No posts available.</div>}
            </div>
            
        </>
    )
}