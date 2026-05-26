import './App.css'
import discoverIcon from './assets/search-icon.png'
import newPostIcon from './assets/new-post-icon.png'
import profileIcon from './assets/profile-icon.png'
import QueueFeed from './components/queue/QueueFeed'
import volumeOnIcon from './assets/volume-on-icon.png'
import volumeMuteIcon from './assets/volume-mute-icon.png'
import { useState } from 'react'

function App() {
  const [isMuted, setIsMuted] = useState(false)

  // Handler for mute/unmute button click
  function handleMuteClick() {
    setIsMuted(!isMuted)
  }

  return (
    <>
      <div className='header'>
        <div style={{width: '30px'}}></div>
        <h1>queue</h1>
        <img src={isMuted ? volumeMuteIcon : volumeOnIcon} alt="Volume icon" onClick={handleMuteClick} style={{ width: '30px', height: '30px', cursor: 'pointer' }} />
      </div>
      <div className='main-container'>
        <QueueFeed isMuted={isMuted} />
      </div>
      <div className='bottom-bar'>
          <img src={discoverIcon} alt="Discover icon" style={{ width: '30px', height: '30px' }} />
          <img src={discoverIcon} alt="Discover icon" style={{ width: '30px', height: '30px' }} />
          <img src={newPostIcon} alt="Discover icon" style={{ width: '30px', height: '30px' }} />
          <img src={discoverIcon} alt="Discover icon" style={{ width: '30px', height: '30px' }} />
          <img src={profileIcon} alt="Discover icon" style={{ width: '30px', height: '30px' }} />
      </div>
    </>
  )
}

export default App
