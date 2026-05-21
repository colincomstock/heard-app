import { useState, useRef, useEffect } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import './App.css'
import postData from './postData.json'
import discoverIcon from './assets/search-icon.png'
import newPostIcon from './assets/new-post-icon.png'
import profileIcon from './assets/profile-icon.png'
import listenIcon from './assets/listen-icon.png'
import pauseIcon from './assets/pause-icon.png'
import playIcon from './assets/play-icon.png'
import likeIcon from './assets/like-icon.png'
import commentIcon from './assets/comment-icon.png'
import volumeOnIcon from './assets/volume-on-icon.png'
import volumeMuteIcon from './assets/volume-mute-icon.png'

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds >= 86400) return `${Math.floor(seconds / 86400)}d ago`
  if (seconds >= 3600) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m ago`
  return `${seconds}s ago`
}

function App() {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(new Audio(postData.post.songInfo.songPreviewUrl))
  const post = postData.post
  useEffect(() => {
    const audio = audioRef.current
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [])

  function handleMuteClick() {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    audioRef.current.muted = newMuted
  }

  function handlePlayPauseClick() {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <div className='main-container'>
        <div className='header'>
          <div style={{width: '30px'}}></div>
          <h1>queue</h1>
          <img src={isMuted ? volumeMuteIcon : volumeOnIcon} alt="Volume icon" onClick={handleMuteClick} style={{ width: '30px', height: '30px', cursor: 'pointer' }} />
        </div>
        <div className='content'>
          <div className='song-area'>
            <div className='song-card-inner'>
              <img src={post.songInfo.coverUrl} alt="Album cover" className='album-cover' />
              <div className='song-meta-listen'>
                <div className='song-text'>
                  <span>{post.songInfo.title}</span>
                  <span>{post.songInfo.artist}</span>
                </div>
                <div className='listen-button'>
                  <img src={listenIcon} alt="Listen icon" style={{ width: '40px', height: '40px' }} />
                  <span>listen</span>
                </div>
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
        <div className='bottom-bar'>
          <img src={discoverIcon} alt="Discover icon" style={{ width: '40px', height: '40px' }} />
          <img src={discoverIcon} alt="Discover icon" style={{ width: '40px', height: '40px' }} />
          <img src={newPostIcon} alt="Discover icon" style={{ width: '40px', height: '40px' }} />
          <img src={discoverIcon} alt="Discover icon" style={{ width: '40px', height: '40px' }} />
          <img src={profileIcon} alt="Discover icon" style={{ width: '40px', height: '40px' }} />
        </div>
      </div>
      <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle style={{padding: "1rem"}}>Comments</DrawerTitle>
          </DrawerHeader>
          <div style={{ padding: '0rem 1rem 5rem 1rem', minHeight: '70vh', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            {post.postInfo.comments.map((c, i) => (
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

export default App
