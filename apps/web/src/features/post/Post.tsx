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
import { useAudioPlayer } from '@/context/AudioPlayerContext'
import appleMusicLockup from '../../assets/apple-music-lockup-white.svg'
import spotifyFullLogo from '../../assets/spotify-full-logo-white.png'
import { likePost, unlikePost } from '../../lib/api/post'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserAuth } from '@/context/AuthContext'

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
    
    // Query client for invalidating queries after like/unlike actions
    const queryClient = useQueryClient();
    
    // Auth context to get the current user's session for like/unlike actions
    const { session } = UserAuth()!;
    
    // State for managing drawer visibility
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [listenOpen, setListenOpen] = useState(false);
    
    // State for managing like status and count
    const [likedByMe, setLikedByMe] = useState(post.likedByMe);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    
    // Derive colors for the post card based on the track's Apple Music background color and genre badge color
    const derivedColors = derivePostColors(post.track.appleBgColor, post.track.genres[0].badgeColor);

    // Function to toggle play/pause for the post's audio preview
    function handlePlayPauseClick() {
        void toggle(post.track.songPreviewUrl, post.id);
    };
    
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
    }
    
    // Mutation for liking a post
    const likeMutation = useMutation({
        mutationFn: () => likePost(session!.access_token, post.id),
        onSuccess: () => {
            console.log("Post liked successfully");
            queryClient.invalidateQueries({ queryKey: ['queue', session?.user?.id] });
            queryClient.invalidateQueries({ queryKey: ['me', session?.user?.id] });
        },
        onError: (error) => {
            console.error("Error liking post:", error);
            setLikedByMe(false);
            setLikeCount((count) => count - 1);
        }
    });
    
    // Mutation for unliking a post
    const unlikeMutation = useMutation({
        mutationFn: () => unlikePost(session!.access_token, post.id),
        onSuccess: () => {
            console.log("Post unliked successfully");
            queryClient.invalidateQueries({ queryKey: ['queue', session?.user?.id] });
            queryClient.invalidateQueries({ queryKey: ['me', session?.user?.id] });
        },
        onError: (error) => {
            console.error("Error unliking post:", error);
            setLikedByMe(true);
            setLikeCount((count) => count + 1);
        }
    });

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
                            <img src={post.track.coverUrl} alt="Album cover" className={`${styles.albumCover} ${derivedColors.isLight ? '' : styles.albumCoverDark}`} />
                            <div className={styles.appleMusicAttr}>
                                <span>Preview provided by Apple Music</span>
                            </div>
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
                                        <span>{post.commentCount}</span>
                                    </div>
                                    <div className={styles.socialControlIndv}>
                                        {likedByMe ? (
                                            <Heart size={30} color={post.track.appleTextColor1} fill={post.track.appleTextColor1} onClick={handleLikeClick} />
                                        ) : (
                                            <Heart size={30} color={post.track.appleTextColor1} onClick={handleLikeClick} />
                                        )}
                                        <span>{likeCount}</span>
                                    </div>
                                </div>
                            </div>
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
                                <span>{timeAgo(post.updatedAt)}</span>
                            </div>
                        </div>
                        <div className={`${styles.userTextPost} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                            <span>{post.caption}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.feedBuffer}></div>
            </div>
            <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle style={{padding: "1rem"}}>Comments</DrawerTitle>
                    </DrawerHeader>
                    <div style={{ padding: '0rem 1rem 5rem 1rem', minHeight: '75vh', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        {post.comments ? post.comments.map((c: any, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <img src={c.pfpUrl} alt={c.displayName} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.displayName}</div>
                                    <div style={{ fontSize: '0.875rem' }}>{c.comment}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{c.likes} likes</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{timeAgo(c.createdAt)}</div>
                                </div>
                            </div>
                        )) : null}
                    </div>
                </DrawerContent>
            </Drawer>
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
