import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.tsx'
import { AudioPlayerProvider } from './context/AudioPlayerProvider.tsx'
import { AuthContextProvider } from './context/AuthProvider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'
import { AppChromeProvider } from './context/AppChromeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <AudioPlayerProvider>
          <AppChromeProvider>
            <RouterProvider router={router} />
          </AppChromeProvider>
        </AudioPlayerProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
