import { useState } from 'react'
import './App.css'
import albumArt from './assets/fauxlennium-album-art.jpg'

function App() {
  return (
    <>
      <div className='main-container'>
        <div className='header'>
          <h1>queue</h1>
        </div>
        <div className='content'>
          <div className='song-area'>
            <img src={albumArt} alt="Album cover" style={{ width: '200px', height: '200px' }} />
            <div className='song-text'>
              <span>Summer 2000 Baby</span>
              <span>TV Girl</span>
            </div>
          </div>
          <div className='user-post-area'>
            <div className='user-info-metadata'>
              <div className='username-tags'>
                <span>musicblaster69</span>
                <span>indie</span>
                <span>psych rock</span>
              </div>
              <div className='post-time'>
                <span>1 day ago</span>
              </div>
            </div>
            <div className='user-text-post'>
              <span>test test test test test test</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
