import '../styles/globals.css'
import '../styles/utilities.css'
import styles from './AppShell.module.css'
import BottomBar from '../features/navigation/BottomBar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Drawer, DrawerContent } from '../components/ui/drawer'
import NewPost from '../features/new-post/NewPost'
import { useAppChrome } from '@/context/useAppChrome'
import AppHeader from '@/features/navigation/AppHeader'

export default function App() {
  const [isNewPostDrawerOpen, setIsNewPostDrawerOpen] = useState(false)

  function openNewPostDrawer() {
    setIsNewPostDrawerOpen(true)
  }

  function closeNewPostDrawer() {
    setIsNewPostDrawerOpen(false)
  }

  const { header } = useAppChrome()

  return (
    <>
      <AppHeader header={header} />
      <div className={`${styles.mainContainer} hide-scrollbar`}>
        <Outlet />
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
