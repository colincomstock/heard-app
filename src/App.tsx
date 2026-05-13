import { useState } from 'react'
import './App.css'
import albumArt from './assets/fauxlennium-album-art.jpg'
import discoverIcon from './assets/search-icon.png'
import newPostIcon from './assets/new-post-icon.png'
import profilePicture from './assets/profile-picture-icon.png'
import profileIcon from './assets/profile-icon.png'
import pauseIcon from './assets/pause-icon.png'
import likeIcon from './assets/like-icon.png'
import commentIcon from './assets/comment-icon.png'

function App() {
  return (
    <>
      <div className='main-container'>
        <div className='header'>
          <h1>queue</h1>
        </div>
        <div className='content'>
          <div className='song-area'>
            <div className='song-card-inner'>
              <img src={albumArt} alt="Album cover" style={{ width: '300px', height: '300px' }} />
              <div className='song-text'>
                <span>Summer 2000 Baby</span>
                <span>TV Girl</span>
              </div>
            </div>
            <div className='controls-social-area'>
              <div className='song-controls'>
                <img src={pauseIcon} alt="Pause icon" style={{ width: '40px', height: '40px' }} />
              </div>
              <div className='social-controls'>
                <img src={commentIcon} alt="Comment icon" style={{ width: '40px', height: '40px' }} />
                <img src={likeIcon} alt="Like icon" style={{ width: '40px', height: '40px' }} />              
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
