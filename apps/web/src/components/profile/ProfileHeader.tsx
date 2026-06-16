import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";

export default function ProfileHeader(profile: any) {
    return (
        <div className='profile-header'>
            <div className='profile-header-identity-area'>
                <div className='pfp-area'>
                    <img src={profile.pfpUrl} alt="Profile picture" className='profile-pfp' />
                </div>
                <div className='profile-header-stats-area'>
                    <div className='profile-stat'>
                        <span className='profile-stat-number'>{profile.postCount}</span>
                        <span className='profile-stat-label'>Posts</span>
                    </div>
                    <div className='profile-stat-divider'></div>
                    <div className='profile-stat'>
                        <span className='profile-stat-number'>{profile.followerCount}</span>
                        <span className='profile-stat-label'>Followers</span>
                    </div>
                    <div className='profile-stat-divider'></div>
                    <div className='profile-stat'>
                        <span className='profile-stat-number'>{profile.followingCount}</span>
                        <span className='profile-stat-label'>Following</span>
                    </div>
                </div>
            </div>
            <div className='profile-name-bio-area'>
                <h1 className='profile-name'>{`${profile.displayName}`}</h1>
                <p className='profile-bio'>{profile.bio}</p>
            </div>
            <div className='profile-top-genres-area'>
                <span className='profile-top-genres-label'>Top genres:</span>
                <div className='profile-top-genres-badges'>
                    {profile.topGenres?.map((genre: any, index: number) => (
                        <div key={index} className='indv-badge glass-area' style={{ backgroundColor: `${genre.badgeColor}99`, color: 'white' }}>
                            <span>{genre.name}</span>
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