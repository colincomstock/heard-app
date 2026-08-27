import styles from './Profile.module.css';
import ProfilePost from '../../features/post/PostCondensed';
import ProfileHeader from '../../features/profile/ProfileHeader';
import { useAuth } from '@/context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppChrome } from '@/context/useAppChrome';
import { Ellipsis } from 'lucide-react';
import { useMe } from '@/hooks/useMe';
import { Spinner } from '@/components/ui/spinner';
import type { ProfileFull } from '@heard/types';

const emptyProfile: ProfileFull = {
    id: '',
    handle: '',
    displayName: '',
    pfpUrl: '',
    bio: null,
    isPrivate: false,
    postCount: 0,
    followingCount: 0,
    followerCount: 0,
    createdAt: '',
    updatedAt: '',
    topGenres: [],
};

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

    const posts = data?.posts ?? [];
    const profile = data?.profile ?? emptyProfile;

    return (
        <div className={styles.profilePage}>
            <ProfileHeader {...profile} />
            <div className={styles.profilePostsArea}>
                {isPending ? (
                    <div className={styles.placeholder}><Spinner /></div>
                ) : null}
                {isError ? (
                    <div className={styles.placeholder}>Something went wrong.</div>
                ) : null}
                {!isPending && !isError && posts.length > 0 ? posts.map((post, index) => (
                    <div
                        key={post.id}
                        className="condensedPostWrapper"
                        style={{ '--delay': `${Math.min(index, 6) * 100}ms` } as React.CSSProperties}
                    >
                        <ProfilePost
                            {...post}
                        />
                    </div>
                )) : null}
                {!isPending && !isError && posts.length === 0 ? (
                    <div className={styles.placeholder}>No posts available.</div>
                ) : null}
            </div>
            <div className={styles.profilePageBottom}>
                {!isPending && !isError && posts.length > 0 && (
                    <span>end of posts.</span>
                )}
            </div>
            <div>
                <button onClick={handleSignOut}>Sign Out {session?.user?.email}</button>
            </div>
        </div>
    )
}
