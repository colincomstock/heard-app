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
    Headphones
} from 'lucide-react'

export default function Post(post: QueuePost & { isMuted: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(new Audio(post.track.songPreviewUrl))
    
    // Effect to handle muting/unmuting when post.isMuted changes
    useEffect(() => {
        audioRef.current.muted = post.isMuted;
    }, [post.isMuted]);
    
    // Effect to update progress bar as audio plays
    useEffect(() => {
        const audio = audioRef.current;
        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
                if (audio.currentTime === audio.duration) {
                    setIsPlaying(false);
                }
            }
        }
        audio.addEventListener('timeupdate', updateProgress);
        return () => audio.removeEventListener('timeupdate', updateProgress);
    }, []);

    const cardRef = useRef<HTMLDivElement>(null);

    // Effect to handle auto-play/pause based on visibility using Intersection Observer
    useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
            const audio = audioRef.current;

            if (!audio) return;

            if (entry.isIntersecting) {
                try {
                await audio.play();
                setIsPlaying(true);
                } catch (error) {
                console.error("Audio failed to play:", error);
                setIsPlaying(false);
                }
            } else {
                audio.pause();
                setIsPlaying(false);
            }
            },
            { threshold: 0.5 }
        );

        observer.observe(card);

        return () => {
            observer.unobserve(card);
        };
    }, []);

    // Handler for play/pause button click
    function handlePlayPauseClick() {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const derivedColors = derivePostColors(post.track.appleBgColor, post.track.genres[0].badgeColor);

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
                                <a href={post.track.spotifyUrl ? post.track.spotifyUrl : '#'} className={styles.listenButton} target="_blank" rel="noopener noreferrer">
                                    <Headphones size={30} color={post.track.appleTextColor1} />
                                    <span>listen</span>
                                </a>
                            </div>

                            <div className={`${styles.playerProgressBar} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                                <div className={styles.playerProgressFill} style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className={styles.controlsSocialArea}>
                                <div className={`${styles.playerControls} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                                    {isPlaying ? (
                                        <Pause size={20} color={post.track.appleTextColor1} fill={post.track.appleTextColor1} onClick={handlePlayPauseClick} />
                                    ) : (
                                        <Play size={20} color={post.track.appleTextColor1} fill={post.track.appleTextColor1} onClick={handlePlayPauseClick} />
                                    )}
                                </div>
                                <div className={styles.socialControls}>
                                    <div className={styles.socialControlIndv}>
                                        <MessageCircleMore size={30} color={post.track.appleTextColor1} onClick={() => setCommentsOpen(true)} />
                                        <span>10</span>
                                    </div>
                                    <div className={styles.socialControlIndv}>
                                        <Heart size={30} color={post.track.appleTextColor1} />
                                        <span>30</span>
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
        </>
        
    )
}
