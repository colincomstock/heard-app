import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";

export default function ProfileHeader(profileData: any) {
    return (
        <div className='profile-header'>
            <div className='profile-header-identity-area'>
                <div className='pfp-area'>
                    <img src={profileData.profile.pfpUrl} alt="Profile picture" className='profile-pfp' />
                </div>
                <div className='profile-header-stats-area'>
                    <div className='profile-stat'>
                        <span className='profile-stat-number'>{profileData.profile.post_count}</span>
                        <span className='profile-stat-label'>Posts</span>
                    </div>
                    <div className='profile-stat-divider'></div>
                    <div className='profile-stat'>
                        <span className='profile-stat-number'>{profileData.profile.followers}</span>
                        <span className='profile-stat-label'>Followers</span>
                    </div>
                    <div className='profile-stat-divider'></div>
                    <div className='profile-stat'>
                        <span className='profile-stat-number'>{profileData.profile.following}</span>
                        <span className='profile-stat-label'>Following</span>
                    </div>
                </div>
            </div>
            <div className='profile-name-bio-area'>
                <h1 className='profile-name'>{`${profileData.profile.displayName}`}</h1>
                <p className='profile-bio'>{profileData.profile.bio}</p>
            </div>
            <div className='profile-top-genres-area'>
                <span className='profile-top-genres-label'>Top genres:</span>
                <div className='profile-top-genres-badges'>
                    {profileData.profile.topGenres.map((genre: string, index: number) => (
                        <div key={index} className='indv-badge glass-area' style={{ backgroundColor: '#8f00ff60', color: 'white' }}>
                            <span>{genre}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='profile-follow-btn-area'>
                <Button className='glass-area'>Follow <UserRoundPlus size={16}/></Button>
            </div>
        </div>
    )
}