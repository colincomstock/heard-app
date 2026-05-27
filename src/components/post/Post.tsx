import { useState, useEffect, useRef } from 'react'
import timeAgo from '../../lib/utils'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
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
            <div className='post-card-container' style={{ scrollSnapAlign: 'start' }}>
                <div className='post-card' ref={cardRef} style={{background: `linear-gradient(180deg, ${post.songInfo.coverColorVibrant} 0%, ${post.songInfo.coverColorDarkVibrant} 39%, ${post.songInfo.coverColorBlackContrast} 100%)`, border: `solid 1px ${post.songInfo.coverColorDarkVibrant}` }}>
                    <div className='song-area'>
                        <div className='song-card-inner'>
                            <img src={post.songInfo.coverUrl} alt="Album cover" className='album-cover' />
                            <div className='song-meta-listen'>
                                <div className='song-text'>
                                    <span>{post.songInfo.title}</span>
                                    <span>{post.songInfo.artists.primary && post.songInfo.artists.secondary.length > 0 ? `${post.songInfo.artists.primary}, ${post.songInfo.artists.secondary.join(', ')}` : post.songInfo.artists.primary}</span>
                                </div>
                                <a href={post.songInfo.externalUrl} className='listen-button' target="_blank" rel="noopener noreferrer">
                                    <img src={listenIcon} alt="Listen icon" style={{ width: '40px', height: '40px' }} />
                                    <span>listen</span>
                                </a>
                            </div>
                            <div className='player-progress-bar'>
                                <div className='player-progress-fill' style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className='controls-social-area'>
                                <div className='song-controls'>
                                    <img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? "Pause icon" : "Play icon"} onClick={handlePlayPauseClick} style={{ width: '40px', height: '40px', cursor: 'pointer' }} />
                                </div>
                                <div className='social-controls'>
                                    <img src={commentIcon} alt="Comment icon" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={() => setCommentsOpen(true)} />
                                    <img src={likeIcon} alt="Like icon" style={{ width: '40px', height: '40px' }} />              
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='user-post-area'>
                        <div className='user-info-metadata'>
                            <img src={post.postInfo.profilePicture} alt="User profile picture" style={{ width: '40px', height: '40px' }} />
                            <div className='username-tags'>
                                <span>{post.postInfo.username}</span>
                                <div className='post-genre-badges'>
                                    <div className='indv-badge' style={{ backgroundColor: '#d2c900', color: 'black' }}>
                                        <span>{post.songInfo.genres.primary}</span>
                                    </div>
                                    <div className='indv-badge ' style={{ backgroundColor: '#8f00ff', color: 'white' }}>
                                        <span>{post.songInfo.genres.secondary[0]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='post-time'>
                                <span>{timeAgo(post.postInfo.timestamp)}</span>
                            </div>
                        </div>
                        <div className='user-text-post'>
                            <span>{post.postInfo.caption}</span>
                        </div>
                    </div>
                </div>
                <div className='feed-buffer'></div>
            </div>
            <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle style={{padding: "1rem"}}>Comments</DrawerTitle>
                    </DrawerHeader>
                    <div style={{ padding: '0rem 1rem 5rem 1rem', minHeight: '70vh', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
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