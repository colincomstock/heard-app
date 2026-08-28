import { useAppChrome } from '@/context/useAppChrome';
import styles from './Saved.module.css';
import { useEffect } from 'react';
import { ArrowUpDown, MessageCircleHeart } from 'lucide-react';
import saveIcon from '../../assets/saved-icon-2.png';
import { useMe } from '@/hooks/useMe';
import { useGetLiked } from './hooks/useGetLiked';
import ProfilePost from '@/features/post/PostCondensed';
import { Spinner } from '@/components/ui/spinner';

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
    
    const { data: meData } = useMe();
    const { data: likedData, isPending: likedIsPending, isError: likedIsError } = useGetLiked();
    const likedPosts = likedData?.likedPosts ?? [];

    useEffect(() => {
        console.log('likedData:', likedData);
    }, [likedData]);

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
                {likedIsPending ? (
                    <div className={styles.placeholder}><Spinner /></div>
                ) : null}
                {likedIsError ? (
                    <div className={styles.placeholder}>Something went wrong.</div>
                ) : null}
                {!likedIsPending && !likedIsError && likedPosts.length > 0 ? likedPosts.map((post, index) => (
                    <div
                        key={post.id}
                        className="condensedPostWrapper"
                        style={{ '--delay': `${Math.min(index, 6) * 150}ms` } as React.CSSProperties}
                    >
                        <ProfilePost
                            {...post}
                        />
                    </div>
                )) : null}

                {!likedIsPending && !likedIsError && likedPosts.length === 0 ? (
                    <div className={styles.placeholder}>
                        <MessageCircleHeart size={25} />
                        <span>hmm, nothing saved yet...</span>
                    </div>
                ) : null}
            </div>
                <div className={styles.savedPageBottom}>
                    {!likedIsPending && !likedIsError && likedPosts.length > 0 && (
                        <span>end of saved posts.</span>
                    )}
                </div>
        </div>
    );
}
