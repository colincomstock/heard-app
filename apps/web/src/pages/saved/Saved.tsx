import { useAppChrome } from '@/context/useAppChrome';
import styles from './Saved.module.css';
import { useEffect } from 'react';
import { ArrowUpDown, MessageCircleHeart } from 'lucide-react';
import saveIcon from '../../assets/saved-icon-2.png';
import { useMe } from '@/hooks/useMe';

export default function Saved() {

    const { setHeader, resetHeader } = useAppChrome();

    // Reset the header to its default state when the component unmounts
    // Separated from the other effect to prevent unnecessary re-renders of the header when the profile data changes.
    useEffect(() => {
        return resetHeader;
    }, [resetHeader]);

    useEffect(() => {
        setHeader({
            visible: true,
            title: 'saved',
            image: saveIcon,
            pfp: false,
            right: [
                {
                    id: 'edit-profile',
                    label: 'Edit Profile',
                    icon: <ArrowUpDown />,
                    onClick: () => {}
                }
            ],
        });
    }, [setHeader]);

    const { data: meData, isPending, isError } = useMe();

    return (
        <div className = {styles.savedPage}>
            <div 
                className={styles.savedHeader}
                style={
                    {
                        '--profile-bg-image': `url(${meData?.profile?.pfpUrl})`,
                    } as React.CSSProperties
                }
            >
                <div className={styles.profileHeaderBg} />
                <div className={styles.profileHeaderTopMask} />
                <div className={styles.pfpArea}>
                    <img src={meData?.profile?.pfpUrl} alt="Profile picture" />
                </div>
                <div className={styles.savedHeaderTitle}>
                    <h1>{meData?.profile?.displayName}'s saved posts</h1>
                    <span>posts you have liked will appear here</span>
                </div>
            </div>
            <div className={styles.savedPostsArea}>
                <div className={styles.placeholder}>
                    <MessageCircleHeart size={25} />
                    <span>hmm, nothing saved yet...</span>
                </div>
            </div>
            <div className={styles.savedPageBottom}>
            </div>
        </div>
    );
}