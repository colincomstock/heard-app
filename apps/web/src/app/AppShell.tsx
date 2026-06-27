import '../styles/globals.css'
import '../styles/utilities.css'
import styles from './AppShell.module.css'
import volumeOnIcon from '../assets/volume-on-icon.png'
import volumeMuteIcon from '../assets/volume-mute-icon.png'
import BottomBar from '../features/navigation/BottomBar'
import { useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { Drawer, DrawerContent } from '../components/ui/drawer'
import NewPost from '../features/new-post/NewPost'

export default function App() {
  const [isMuted, setIsMuted] = useState(false)
  const [isNewPostDrawerOpen, setIsNewPostDrawerOpen] = useState(false)

  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const title = (currentMatch?.handle as { title: string })?.title ?? 'queue'

  // Handler for mute/unmute button click
  function handleMuteClick() {
    setIsMuted(!isMuted)
  }

  function openNewPostDrawer() {
    setIsNewPostDrawerOpen(true)
  }

  function closeNewPostDrawer() {
    setIsNewPostDrawerOpen(false)
  }

  return (
    <>
      <div className={styles.header}>
        <div style={{width: '30px'}}></div>
        <h1>{title}</h1>
        <img src={isMuted ? volumeMuteIcon : volumeOnIcon} alt="Volume icon" onClick={handleMuteClick} style={{ width: '25px', height: '25px', cursor: 'pointer' }} />
      </div>
      <div className={styles.mainContainer}>
        <Outlet context={{ isMuted }} />
      </div>
      <BottomBar onOpenNewPostDrawer={openNewPostDrawer} />

      <Drawer 
        open={isNewPostDrawerOpen} 
        onOpenChange={setIsNewPostDrawerOpen}
        repositionInputs={false}
      >
        <DrawerContent>
          <div className='px-4 pb-4 flex h-full flex-col min-h-0'>
            <NewPost onDone={closeNewPostDrawer} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
