import profileData from '../../ProfileData.json';
import ProfilePost from './ProfilePost';
import ProfileHeader from './ProfileHeader';

export default function Profile() {
    return (
        <div className='profile-page'>
            <ProfileHeader {...profileData} />
            <div className='profile-posts-area'>
                {profileData.posts.map((post, index) => (
                    <ProfilePost key={index} style={{background: `linear-gradient(185deg, ${post.post.songInfo.coverColorVibrant}99 0%, ${post.post.songInfo.coverColorDarkVibrant}99 39%, ${post.post.songInfo.coverColorBlackContrast}cc 100%)`, border: `solid 1px ${post.post.songInfo.coverColorDarkVibrant}66` }} {...post.post} />
                ))}
                {profileData.posts.map((post, index) => (
                    <ProfilePost key={index} style={{background: `linear-gradient(185deg, ${post.post.songInfo.coverColorVibrant}99 0%, ${post.post.songInfo.coverColorDarkVibrant}99 39%, ${post.post.songInfo.coverColorBlackContrast}cc 100%)`, border: `solid 1px ${post.post.songInfo.coverColorDarkVibrant}66` }} {...post.post} />
                ))}
            </div>
        </div>
    )
}