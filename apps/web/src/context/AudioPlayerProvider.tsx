import { 
    useState, 
    useEffect, 
    useRef, 
    type ReactNode,
    useCallback
} from 'react'
import { AudioPlayerContext } from './audioPlayerContext'

// Provider component to wrap the application and provide audio player state and functions
export function AudioPlayerProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    // State variables for audio player
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const currentSrcRef = useRef<string | null>(null);
    const activeIdRef = useRef<string | null>(null);

    // Effect to handle muting/unmuting the audio
    useEffect(() => {
        const audio = audioRef.current;
        audio.muted = isMuted;
    }, [isMuted]);


    // Effect to handle audio events, subscribing to time updates, play, pause, and ended events
    useEffect(() => {
        const audio = audioRef.current;

        function handleTimeUpdate() {
            if (!audio.duration) {
                setProgress(0);
                return;
            }
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        function handlePlay() {
            setIsPlaying(true);
        };

        function handlePause() {
            setIsPlaying(false);
        };

        function handleEnded() {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Function to play audio, handling ownership and source changes
    const play = useCallback(async (src: string, id: string) => {
        const audio = audioRef.current
        const isNewOwner = activeIdRef.current !== id

        if (isNewOwner) {
            audio.currentTime = 0;
            setProgress(0);
        }

        // Update ownership synchronously so stale observer callbacks
        // cannot pause the newly active card.
        activeIdRef.current = id
        setActiveId(id)

        if (currentSrcRef.current !== src) {
            currentSrcRef.current = src
            setCurrentSrc(src)
            audio.src = src
            audio.currentTime = 0
        }

        try {
            await audio.play()
        } catch (error) {
            if (
                error instanceof DOMException &&
                (error.name === 'AbortError' || error.name === 'NotAllowedError')
            ) {
                return
            }

            throw error
        }
    }, [])

    // Function to pause audio, optionally checking ownership
    const pause = useCallback((ownerId?: string) => {
        if (ownerId && activeIdRef.current !== ownerId) {
            return
        }

        audioRef.current.pause()
    }, [])

    // Toggle function to play or pause the audio based on the current state and ownership
    const toggle = useCallback(async (src: string, id: string) => {
        const audio = audioRef.current
        const isSameOwner = activeIdRef.current === id

        if (isSameOwner && !audio.paused) {
            pause(id)
            return
        }

        await play(src, id)
    }, [pause, play])

    // Provide the context value to children components
    return (
        <AudioPlayerContext.Provider 
            value={{ 
                isMuted, 
                isPlaying, 
                currentSrc, 
                activeId, 
                progress, 
                play, 
                pause, 
                toggle, 
                setMuted: setIsMuted 
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
}






