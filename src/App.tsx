import { useState, useRef, useEffect } from 'react'
import './App.css'
import albumArt from './assets/fauxlennium-album-art.jpg'
import discoverIcon from './assets/search-icon.png'
import newPostIcon from './assets/new-post-icon.png'
import profilePicture from './assets/profile-picture-icon.png'
import profileIcon from './assets/profile-icon.png'
import listenIcon from './assets/listen-icon.png'
import pauseIcon from './assets/pause-icon.png'
import playIcon from './assets/play-icon.png'
import likeIcon from './assets/like-icon.png'
import commentIcon from './assets/comment-icon.png'
import volumeOnIcon from './assets/volume-on-icon.png'
import volumeMuteIcon from './assets/volume-mute-icon.png'
import song from './assets/summer-2000-baby-preview.mp3'

function App() {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(new Audio(song))

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
              <img src={albumArt} alt="Album cover" className='album-cover' />
              <div className='song-meta-listen'>
                <div className='song-text'>
                  <span>Summer 2000 Baby</span>
                  <span>TV Girl</span>
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
                  <img src={commentIcon} alt="Comment icon" style={{ width: '40px', height: '40px' }} />
                  <img src={likeIcon} alt="Like icon" style={{ width: '40px', height: '40px' }} />              
                </div>
              </div>
            </div>
          </div>
          <div className='user-post-area'>
            <div className='user-info-metadata'>
              <img src={profilePicture} alt="User profile picture" style={{ width: '40px', height: '40px' }} />
              <div className='username-tags'>
                <span>musicblaster69</span>
                <div className='post-genre-badges'>
                  <div className='indv-badge' style={{ backgroundColor: '#d2c900', color: 'black' }}>
                    <span>indie</span>
                  </div>
                  <div className='indv-badge ' style={{ backgroundColor: '#8f00ff', color: 'white' }}>
                    <span>psych rock</span>
                  </div>
                </div>
              </div>
              <div className='post-time'>
                <span>1 day ago</span>
              </div>
            </div>
            <div className='user-text-post'>
              <span>test test test test test test test test test test test test test test test test test test test test test test test test</span>
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
    </>
  )
}

export default App
