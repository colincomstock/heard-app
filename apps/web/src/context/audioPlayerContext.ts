import { createContext } from "react";

export type AudioPlayerContextValue = {
    isMuted: boolean;
    isPlaying: boolean;
    currentSrc: string | null;
    activeId: string | null;
    progress: number;
    play: (src: string, id: string) => Promise<void>;
    pause: (ownerId?: string) => void;
    toggle: (src: string, id: string) => Promise<void>;
    setMuted: (value: boolean) => void;
};

export const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);