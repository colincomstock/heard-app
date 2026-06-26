import styles from './ProfileHeader.module.css';
import { Button } from "../../components/ui/button";
import { UserRoundPlus } from "lucide-react";

export default function ProfileHeader(profile: any) {
    return (
        <div 
            className={styles['profile-header']}
            style={
                {
                    '--profile-bg-image': `url(${profile.pfpUrl})`,
                } as React.CSSProperties
            }
        >
            <div className={styles['profile-header-bg']} />
            <div className={styles['profile-header-top-mask']} />
            <div className={styles['profile-header-identity-area']}>
                <div className={styles['pfp-area']}>
                    <img src={profile.pfpUrl} alt="Profile picture" />
                </div>
                <div className={styles['profile-header-stats-area']}>
                    <div className={styles['profile-stat']}>
                        <span className={styles['profile-stat-number']}>{profile.postCount}</span>
                        <span>Posts</span>
                    </div>
                    <div className={styles['profile-stat-divider']}></div>
                    <div className={styles['profile-stat']}>
                        <span className={styles['profile-stat-number']}>{profile.followerCount}</span>
                        <span>Followers</span>
                    </div>
                    <div className={styles['profile-stat-divider']}></div>
                    <div className={styles['profile-stat']}>
                        <span className={styles['profile-stat-number']}>{profile.followingCount}</span>
                        <span>Following</span>
                    </div>
                </div>
            </div>
            <div className={styles['profile-name-bio-area']}>
                <h1 className={styles['profile-name']}>{`${profile.displayName}`}</h1>
                <p className={styles['profile-bio']}>{profile.bio}</p>
            </div>
            <div className={styles['profile-top-genres-area']}>
                <span className={styles['profile-top-genres-label']}>Top genres:</span>
                <div className={styles['profile-top-genres-badges']}>
                    {profile.topGenres?.map((genre: any, index: number) => (
                        <div key={index} className={`${styles['indv-badge']} glass-area`} style={{ backgroundColor: `${genre.badgeColor}99`, color: 'white' }}>
                            <span>{genre.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles['profile-follow-btn-area']}>
                <Button className={`glass-area`}>Follow <UserRoundPlus size={16}/></Button>
            </div>
        </div>
    )
}
