import './App.css'
import queueIcon from './assets/queue-icon-4.png'
import discoverIcon from './assets/search-icon-2.png'
import newPostIcon from './assets/new-post-icon-2.png'
import savedIcon from './assets/saved-icon-2.png'
import profileIcon from './assets/profile-icon.png'
import QueueFeed from './components/queue/QueueFeed'
import volumeOnIcon from './assets/volume-on-icon.png'
import volumeMuteIcon from './assets/volume-mute-icon.png'
import { useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Profile from './components/profile/Profile'

const routeTitles: Record<string, string> = {
  '/': 'queue',
  '/discover': 'discover',
  '/new-post': 'new post',
  '/saved': 'saved',
  '/profile': 'profile',
}

function App() {
  const [isMuted, setIsMuted] = useState(false)
  const { pathname } = useLocation()
  const title = routeTitles[pathname] ?? 'queue'

  // Handler for mute/unmute button click
  function handleMuteClick() {
    setIsMuted(!isMuted)
  }

  return (
    <>
      <div className='header'>
        <div style={{width: '30px'}}></div>
        <h1>{title}</h1>
        <img src={isMuted ? volumeMuteIcon : volumeOnIcon} alt="Volume icon" onClick={handleMuteClick} style={{ width: '25px', height: '25px', cursor: 'pointer' }} />
      </div>
      <div className='main-container'>
        <Routes>
          <Route path="/" element={<QueueFeed isMuted={isMuted} />} />
          <Route path="/discover" element={<div>Discover Page</div>} />
          <Route path="/new-post" element={<div>New Post Page</div>} />
          <Route path="/saved" element={<div>Saved Page</div>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <div className='bottom-bar'>
          <Link to="/">
            <button>
              <img src={queueIcon} alt="Queue icon" style={{ width: '25px', height: '25px' }} />
            </button>
          </Link>
          <Link to="/discover">
            <button>
              <img src={discoverIcon} alt="Discover icon" style={{ width: '25px', height: '25px' }} />
            </button>
          </Link>
          <Link to="/new-post">
            <button>
              <img src={newPostIcon} alt="New Post icon" style={{ width: '25px', height: '25px' }} />
            </button>
          </Link>
          <Link to="/saved">
            <button>
              <img src={savedIcon} alt="Saved icon" style={{ width: '25px', height: '25px' }} />
            </button>
          </Link>
          <Link to="/profile">
            <button>
              <img src={profileIcon} alt="Profile icon" style={{ width: '25px', height: '25px' }} />
            </button>
          </Link>
      </div>
    </>
  )
}

export default App
