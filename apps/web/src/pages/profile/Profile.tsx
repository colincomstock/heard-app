import styles from './Profile.module.css';
import ProfilePost from '../../features/post/PostCondensed';
import ProfileHeader from '../../features/profile/ProfileHeader';
import { useAuth } from '@/context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/lib/api/me';

export default function Profile() {

    const { session, signOutUser } = useAuth()!;
    const navigate = useNavigate();

    const { data, isPending, isError } = useQuery({
        queryKey: ['me', session?.user?.id],
        queryFn: () => getMe(session!.access_token),
        placeholderData: (previousData) => previousData,
        enabled: !!session?.access_token,
    });

    async function handleSignOut(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            await signOutUser();
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
            alert('An error occurred while signing out. Please try again.');
        }
    }

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Something went wrong.</div>;

    return (
        <div className={styles.profilePage}>
            <ProfileHeader {...data.profile} />
            <div className={styles.profilePostsArea}>
                {data.posts && data.posts.length > 0 ? data.posts.map((post) => (
                    <ProfilePost
                        key={post.id}
                        {...post}
                    />
                )) : <p>No posts available.</p>}
            </div>
            <div className={styles.profilePageBottom}>
                <span>end of posts.</span>
            </div>
            <div>
                <button onClick={handleSignOut}>Sign Out {session?.user?.email}</button>
            </div>
        </div>
    )
}
