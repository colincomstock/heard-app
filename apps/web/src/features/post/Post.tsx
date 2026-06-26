import styles from './Post.module.css'
import { useState, useEffect, useRef } from 'react'
import timeAgo from '../../lib/utils'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../../components/ui/drawer'
import listenIcon from '../../assets/listen-icon.png'
import pauseIcon from '../../assets/pause-icon.png'
import playIcon from '../../assets/play-icon.png'
import likeIcon from '../../assets/like-icon.png'
import commentIcon from '../../assets/comment-icon.png'

export default function Post(post: any) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(new Audio(post.songInfo.songPreviewUrl))
    
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

    return (
        <>
            <div style={{ scrollSnapAlign: 'start' }}>
                <div className={styles['post-card']} ref={cardRef} style={{background: `linear-gradient(185deg, ${post.songInfo.coverColorVibrant} 0%, ${post.songInfo.coverColorDarkVibrant} 39%, ${post.songInfo.coverColorBlackContrast} 100%)`, border: `solid 1px ${post.songInfo.coverColorDarkVibrant}` }}>
                    <div className={styles['song-area']}>
                        <div className={styles['song-card-inner']}>
                            <img src={post.songInfo.coverUrl} alt="Album cover" className={styles['album-cover']} />
                            <div className={styles['apple-music-attr']}>
                                <span>Preview provided by Apple Music</span>
                            </div>
                            <div className={styles['song-meta-listen']}>
                                <div className={styles['song-text']}>
                                    <span>{post.songInfo.title}</span>
                                    <span>{post.songInfo.artists.primary && post.songInfo.artists.secondary.length > 0 ? `${post.songInfo.artists.primary}, ${post.songInfo.artists.secondary.join(', ')}` : post.songInfo.artists.primary}</span>
                                </div>
                                <a href={post.songInfo.externalUrl} className={styles['listen-button']} target="_blank" rel="noopener noreferrer">
                                    <img src={listenIcon} alt="Listen icon" style={{ width: '40px', height: '40px' }} />
                                    <span>listen</span>
                                </a>
                            </div>

                            <div className={`${styles['player-progress-bar']} glass-area`}>
                                <div className={styles['player-progress-fill']} style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className={styles['controls-social-area']}>
                                <div>
                                    <img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? "Pause icon" : "Play icon"} onClick={handlePlayPauseClick} style={{ width: '40px', height: '40px', cursor: 'pointer'}} />
                                </div>
                                <div className={styles['social-controls']}>
                                    <img src={commentIcon} alt="Comment icon" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={() => setCommentsOpen(true)} />
                                    <img src={likeIcon} alt="Like icon" style={{ width: '40px', height: '40px' }} />              
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['user-post-area']}>
                        <div className={styles['user-info-metadata']}>
                            <img src={post.postInfo.profilePicture} alt="User profile picture"/>
                            <div className={styles['username-tags']}>
                                <span>{post.postInfo.username}</span>
                                <div className={styles['post-genre-badges']}>
                                    <div className={`${styles['indv-badge']} glass-area`} style={{ backgroundColor: '#FFA50060', color: 'white' }}>
                                        <span>{post.songInfo.genres.primary}</span>
                                    </div>
                                    <div className={`${styles['indv-badge']} glass-area`} style={{ backgroundColor: '#8f00ff60', color: 'white' }}>
                                        <span>{post.songInfo.genres.secondary[0]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['post-time']}>
                                <span>{timeAgo(post.postInfo.timestamp)}</span>
                            </div>
                        </div>
                        <div className={`${styles['user-text-post']} glass-area`}>
                            <span>{post.postInfo.caption}</span>
                        </div>
                    </div>
                </div>
                <div className={styles['feed-buffer']}></div>
            </div>
            <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle style={{padding: "1rem"}}>Comments</DrawerTitle>
                    </DrawerHeader>
                    <div style={{ padding: '0rem 1rem 5rem 1rem', minHeight: '75vh', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        {post.postInfo.comments.map((c: any, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <img src={c.profilePicture} alt={c.username} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.username}</div>
                                    <div style={{ fontSize: '0.875rem' }}>{c.comment}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{c.likes} likes</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{timeAgo(c.time)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
        
    )
}