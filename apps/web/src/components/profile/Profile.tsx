import profileData from '../../ProfileData.json';
import ProfilePost from './ProfilePost';
import ProfileHeader from './ProfileHeader';
import type { ProfilePost as ProfilePostType } from '@heard/types';
import type { Profile } from '@heard/types';
import { useEffect, useState } from 'react';

export default function Profile() {

    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<ProfilePostType[]>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/profile/john_music`)
            .then(response => response.json())
            .then(data => {
                setProfile(data.profile);
                setPosts(data.posts);
            })
            .catch(error => 
                console.error('Error fetching profile data:', error)
            );
    }, []);

    return (
        <div className='profile-page'>
            <ProfileHeader {...profileData} />
            <div className='profile-posts-area'>
                {posts.map((post) => (
                    <ProfilePost
                        key={post.id}
                        style={{
                            background: `linear-gradient(185deg, ${post.track?.coverColorVibrant}99 0%, ${post.track?.coverColorDarkVibrant}99 39%, ${post.track?.coverColorDarkContrast}cc 100%)`,
                            border: `solid 1px ${post.track?.coverColorDarkVibrant}`
                        }}
                        {...post}
                    />
                ))}
            </div>
            <div className='profile-page-bottom'>
                <span>end of posts.</span>
            </div>
        </div>
    )
}