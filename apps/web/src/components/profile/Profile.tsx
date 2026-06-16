import ProfilePost from './ProfilePost';
import ProfileHeader from './ProfileHeader';
import type { ProfilePost as ProfilePostType } from '@heard/types';
import type { Profile } from '@heard/types';
import { useEffect, useState } from 'react';
import { UserAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {

    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<ProfilePostType[]>([]);

    const { session, signOutUser } = UserAuth()!;
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!session?.access_token) return;

        fetch(`${import.meta.env.VITE_API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setProfile(data.profile);
                setPosts(data.posts);
            })
            .catch(error =>
                console.error('Error fetching profile data:', error)
            );
    }, [session]);

    return (
        <div className='profile-page'>
            <ProfileHeader {...profile} />
            <div className='profile-posts-area'>
                {posts && posts.length > 0 ? posts.map((post) => (
                    <ProfilePost
                        key={post.id}
                        style={{
                            background: `linear-gradient(185deg, ${post.track?.coverColorVibrant}99 0%, ${post.track?.coverColorDarkVibrant}99 39%, ${post.track?.coverColorDarkContrast}cc 100%)`,
                            border: `solid 1px ${post.track?.coverColorDarkVibrant}`
                        }}
                        {...post}
                    />
                )) : <p>No posts available.</p>}
            </div>
            <div className='profile-page-bottom'>
                <span>end of posts.</span>
            </div>
            <div>
                <button onClick={handleSignOut}>Sign Out {session?.user?.email}</button>
            </div>
        </div>
    )
}