import albumArt from '../../assets/fauxlennium-album-art.jpg';
import { Button } from '../ui/button';
import profileData from '../../ProfileData.json';
import timeAgo from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export default function Profile() {
    return (
        <div className='profile-page'>
            <div className='profile-header'>
                <div className='pfp-card'>
                    <img src={profileData.profile.pfpUrl} alt="Profile" />
                </div>
                <div className='profile-header-top glass-area'>
                    <div className='profile-info-card'>
                        <div className='profile-stats'>
                            <div>
                                <span>{profileData.profile.post_count}</span>
                                <span>Posts</span>
                            </div>
                            <div>
                                <span>{profileData.profile.followers}</span>
                                <span>Followers</span>
                            </div>
                            <div>
                                <span>{profileData.profile.following}</span>
                                <span>Following</span>
                            </div>
                        </div>
                    </div>
                    <div className='follow-btn-area'>
                        <Button className='follow-btn glass-area'>Follow</Button>
                    </div>
                </div>
                
            </div>
            <h2>Recent Posts</h2>
            <div className='profile-post'>
                <div className='profile-post-card glass-area'>
                    <img src={profileData.posts[0].post.songInfo.coverUrl} alt="Album cover" className='album-cover' />
                    <div className='profile-post-body'>
                        <div className='profile-post-info'>
                            <span>{profileData.posts[0].post.songInfo.title}</span>
                            <span className='profile-post-secondary-text'>{profileData.posts[0].post.songInfo.artists.primary}</span>
                            <div className='profile-post-caption'>
                                <span className='profile-post-secondary-text'>{profileData.posts[0].post.postInfo.caption}</span>
                            </div>
                        </div>
                        <div className='profile-post-meta'>
                            <ArrowUpRight size={20} />
                            <span className='profile-post-secondary-text'>{timeAgo(profileData.posts[0].post.postInfo.timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}