import './App.css'
import volumeOnIcon from './assets/volume-on-icon.png'
import volumeMuteIcon from './assets/volume-mute-icon.png'
import BottomBar from './components/app-chrome/BottomBar'
import { useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'

export default function App() {
  const [isMuted, setIsMuted] = useState(false)
  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const title = (currentMatch?.handle as { title: string })?.title ?? 'queue'

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
        <Outlet context={{ isMuted }} />
      </div>
      <BottomBar />
    </>
  )
}

