import styles from './Profile.module.css';
import ProfilePost from '../../features/post/PostCondensed';
import ProfileHeader from '../../features/profile/ProfileHeader';
import { useAuth } from '@/context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppChrome } from '@/context/useAppChrome';
import { Ellipsis } from 'lucide-react';
import { useMe } from '@/hooks/useMe';

export default function Profile() {
    
    const { session, signOutUser } = useAuth()!;
    const navigate = useNavigate();

    const { data, isPending, isError } = useMe();

    const { setHeader, resetHeader } = useAppChrome();

    // Reset the header to its default state when the component unmounts
    // Separated from the other effect to prevent unnecessary re-renders of the header when the profile data changes.
    useEffect(() => {
        return resetHeader;
    }, [resetHeader]);

    useEffect(() => {
        setHeader({
            visible: true,
            title: data?.profile?.handle ? `@${data.profile.handle}` : 'loading...',
            image: data?.profile?.pfpUrl || null,
            pfp: !!data?.profile?.pfpUrl,
            right: [
                {
                    id: 'edit-profile',
                    label: 'Edit Profile',
                    icon: <Ellipsis />,
                    onClick: () => {}
                }
            ],
        });
    }, [setHeader, data?.profile?.handle, data?.profile?.pfpUrl]);
    
    

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
