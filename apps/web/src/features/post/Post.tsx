import styles from './Post.module.css'
import { useState, useEffect, useRef } from 'react'
import timeAgo from '../../lib/utils'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../../components/ui/drawer'
import type { QueuePost } from '@heard/types'
import derivePostColors from '@/lib/colors'
import { 
    Heart, 
    MessageCircleMore, 
    Play, 
    Pause, 
    Share,
} from 'lucide-react'
import { useAudioPlayer } from '@/context/useAudioPlayer'
import appleMusicLockup from '../../assets/apple-music-lockup-white.svg'
import spotifyFullLogo from '../../assets/spotify-full-logo-white.png'
import { useLikePost } from './hooks/useLikePost'
import { useUnlikePost } from './hooks/useUnlikePost'
import CommentDrawer from '../comments/CommentDrawer'

export default function Post(post: QueuePost) {
    
    // Audio player context
    const {
        activeId,
        isPlaying,
        progress,
        toggle,
        play,
        pause,
    } = useAudioPlayer();
    
    // Determines if this post is the active one in the audio player 
    // and calculates the progress and play/pause state accordingly
    const isActive = activeId === post.id;
    const displayProgress = isActive ? progress : 0;
    const showPause = isActive && isPlaying;
    
    // State for managing drawer visibility
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [listenOpen, setListenOpen] = useState(false);
    
    // State for managing like status and count of comments and likes for optimistic UI updates
    const [likedByMe, setLikedByMe] = useState(post.likedByMe);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [commentCount, setCommentCount] = useState(post.commentCount);
    
    // Derive colors for the post card based on the track's Apple Music background color and genre badge color
    const derivedColors = derivePostColors(post.track.appleBgColor, post.track.genres[0].badgeColor);

    // Function to toggle play/pause for the post's audio preview
    function handlePlayPauseClick() {
        void toggle(post.track.songPreviewUrl, post.id);
    };
    
    const likeMutation = useLikePost(post.id, {
        onRollback: () => {
            setLikedByMe(false);
            setLikeCount((count) => count - 1);
        }
    });

    const unlikeMutation = useUnlikePost(post.id, {
        onRollback: () => {
            setLikedByMe(true);
            setLikeCount((count) => count + 1);
        }
    });

    // Function to handle like/unlike actions with optimistic UI updates
    function handleLikeClick() {
        if ( likeMutation.isPending || unlikeMutation.isPending ) {
            return;
        }
        
        const nextLiked = !likedByMe;
        
        setLikedByMe(nextLiked);
        setLikeCount((count) => nextLiked ? count + 1 : count - 1);
        
        if (nextLiked) {
            likeMutation.mutate();
        } else {
            unlikeMutation.mutate();
        }
    };

    // Refs and IntersectionObserver to handle auto-play/pause when the post is in view
    const cardRef = useRef<HTMLDivElement>(null);
    const inViewRef = useRef(false);
    
    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isInView = entry.intersectionRatio >= 0.5
                const wasInView = inViewRef.current

                if (isInView && !wasInView) {
                    void play(post.track.songPreviewUrl, post.id)
                }

                if (!isInView && wasInView) {
                    pause(post.id)
                }

                inViewRef.current = isInView
            },
            { threshold: [0, 0.5, 1] }
        )

        observer.observe(card)
        return () => observer.disconnect()
    }, [post.id, post.track.songPreviewUrl, play, pause])


    return (
        <>
            <div
                style={
                    { 
                        scrollSnapAlign: 'start',
                        '--applebgColor': derivedColors.bgColor,
                        '--bgColorBorder': derivedColors.border,
                        '--appleTextColor1': post.track.appleTextColor1,
                        '--appleTextColor2': post.track.appleTextColor2,
                        '--appleTextColor3': post.track.appleTextColor3,
                        '--appleTextColor4': post.track.appleTextColor4,
                        '--coverArt': `url(${post.track.coverUrl})`
                    } as React.CSSProperties
                }
            >
                <div className={`${styles.postCard} ${derivedColors.isLight ? styles.postCardLight : styles.postCardDark}`} ref={cardRef}>
                    <div className={styles.songArea}>
                        <div className={styles.songCardInner}>
                            <div className={styles.albumCoverContainer}>
                                <img src={post.track.coverUrl} alt="Album cover" className={`${styles.albumCover} ${derivedColors.isLight ? '' : styles.albumCoverDark}`} />
                                <div className={styles.appleMusicAttr}>
                                    <span>Preview provided by Apple Music</span>
                                </div>
                            </div>
                            <div className={styles.songMetaArea}>
                                <div className={styles.songMetaListen}>
                                    <div className={styles.songText}>
                                        <span className={`${styles.trackTitle} single-line-clamp`}>{post.track.title}</span>
                                        <span className={`${styles.trackArtist} single-line-clamp`}>{post.track.artistName}</span>
                                    </div>
                                    <button onClick={() => setListenOpen(true)}>
                                        <div className={styles.listenButtonIcon}>
                                            <Share size={30} color={post.track.appleTextColor1} />

                                        </div>
                                        <div className={styles.listenButtonText}>
                                            <span>listen</span>
                                        </div>
                                    </button>
                                </div>

                                <div className={`${styles.playerProgressBar} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                                    <div className={styles.playerProgressFill} style={{ width: `${displayProgress}%` }}></div>
                                </div>
                                <div className={styles.controlsSocialArea}>
                                    <div className={`${styles.playerControls} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                                        {showPause ? (
                                            <Pause size={20} color={post.track.appleTextColor1} fill={post.track.appleTextColor1} onClick={handlePlayPauseClick} />
                                        ) : (
                                            <Play size={20} color={post.track.appleTextColor1} fill={post.track.appleTextColor1} onClick={handlePlayPauseClick} />
                                        )}
                                    </div>
                                    <div className={styles.socialControls}>
                                        <div className={styles.socialControlIndv}>
                                            <MessageCircleMore size={30} color={post.track.appleTextColor1} onClick={() => setCommentsOpen(true)} />
                                            <span>{commentCount}</span>
                                        </div>
                                        <div className={styles.socialControlIndv}>                                        
                                            <button 
                                                type="button" 
                                                aria-label={likedByMe ? 'Unlike post' : 'Like post'} 
                                                onClick={handleLikeClick}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: 0,
                                                    cursor: 'pointer'
                                                }} 
                                            >
                                                <Heart 
                                                    size={30} 
                                                    color={post.track.appleTextColor1} 
                                                    fill={likedByMe ? post.track.appleTextColor1 : 'none'}
                                                />
                                            </button>
                                            <span>{likeCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Spacer for the space-between justification so that album art snaps to top and player snaps to middle */ }
                            <div></div>
                        </div>
                    </div>
                    <div className={styles.userPostArea}>
                        <div className={styles.userInfoMetadata}>
                            <img src={post.profile.pfpUrl} alt="User profile picture"/>
                            <div>
                                <span className={styles.username}>{post.profile.displayName}</span>
                                <div className={styles.postGenreBadges}>
                                    {post.track.genres.slice(0, 2).map((genre) => (
                                        <div
                                            key={genre.name}
                                            className={`${styles.indvBadge} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}
                                            style={{ '--badgeColor': genre.badgeColor } as React.CSSProperties}
                                        >
                                            <span className={styles.badgeColorDot}>⬤ </span>
                                            <span>{genre.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.postTime}>
                                <span>{timeAgo(post.createdAt)}</span>
                            </div>
                        </div>
                        <div className={`${styles.userTextPost} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                            <span>{post.caption}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.feedBuffer}></div>
            </div>
            <CommentDrawer 
                postId={post.id}
                comments={post.comments}
                commentsOpen={commentsOpen}
                setCommentsOpen={setCommentsOpen}
                incrementPostCommentCount={() => setCommentCount((count) => count + 1)}
                decrementPostCommentCount={() => setCommentCount((count) => count - 1)}
            />
            <Drawer open={listenOpen} onOpenChange={setListenOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle style={{padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"}}>Open in <Share size={16} /></DrawerTitle>
                    </DrawerHeader>
                    <div className={styles.drawerListenButtons}>
                        <div></div>
                        {post.track.appleMusicUrl ? <a href={post.track.appleMusicUrl} target="_blank" rel="noopener noreferrer">
                            <img 
                                src={appleMusicLockup} 
                                alt="Apple Music" 
                                style={{height: '30px' }} 
                            />
                        </a> : null}
                        {post.track.spotifyUrl ? <a href={post.track.spotifyUrl} target="_blank" rel="noopener noreferrer">
                            <img 
                                src={spotifyFullLogo} 
                                alt="Spotify" 
                                style={{ height: '30px' }} 
                            />
                        </a> : null}
                        <div></div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
        
    )
}
