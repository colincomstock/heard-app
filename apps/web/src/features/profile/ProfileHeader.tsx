import styles from './ProfileHeader.module.css';
import { Button } from "../../components/ui/button";
import { UserRoundPlus } from "lucide-react";

export default function ProfileHeader(profile: any) {
    return (
        <div 
            className={styles.profileHeader}
            style={
                {
                    '--profile-bg-image': `url(${profile.pfpUrl})`,
                } as React.CSSProperties
            }
        >
            <div className={styles.profileHeaderBg} />
            <div className={styles.profileHeaderTopMask} />
            <div className={styles.profileHeaderIdentityArea}>
                <div className={styles.pfpArea}>
                    <img src={profile.pfpUrl} alt="Profile picture" />
                </div>
                <div className={styles.profileHeaderStatsArea}>
                    <div className={styles.profileStat}>
                        <span className={styles.profileStatNumber}>{profile.postCount}</span>
                        <span>Posts</span>
                    </div>
                    <div className={styles.profileStatDivider}></div>
                    <div className={styles.profileStat}>
                        <span className={styles.profileStatNumber}>{profile.followerCount}</span>
                        <span>Followers</span>
                    </div>
                    <div className={styles.profileStatDivider}></div>
                    <div className={styles.profileStat}>
                        <span className={styles.profileStatNumber}>{profile.followingCount}</span>
                        <span>Following</span>
                    </div>
                </div>
            </div>
            <div className={styles.profileNameBioArea}>
                <h1 className={styles.profileName}>{`${profile.displayName}`}</h1>
                <p className={styles.profileBio}>{profile.bio}</p>
            </div>
            <div className={styles.profileTopGenresArea}>
                <span className={styles.profileTopGenresLabel}>Top genres:</span>
                <div className={styles.profileTopGenresBadges}>
                    {profile.topGenres?.map((genre: any, index: number) => (
                        <div key={index} className={`${styles.indvBadge} glass-area`} style={{ backgroundColor: `${genre.badgeColor}`, color: 'white' }}>
                            <span>{genre.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.profileFollowBtnArea}>
                <Button className={`glass-area`}>Follow <UserRoundPlus size={16}/></Button>
            </div>
        </div>
    )
}
