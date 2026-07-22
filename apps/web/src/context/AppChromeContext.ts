import { createContext, type ReactNode } from 'react';

// The AppChromeContext provides a way to manage the app's header configuration, including visibility, title, and actions. 
// It allows components to set and reset the header state as needed.

export type HeaderAction = {
    id: string;
    label: string;
    icon: ReactNode;
    onClick: () => void;
    disabled?: boolean;
};

export type HeaderConfig = {
    visible: boolean;
    title: string;
    left?: HeaderAction | null;
    right?: HeaderAction[] | null;
    image?: string | null | undefined;
    pfp?: boolean | null | undefined;
};

export type AppChromeContextValue = {
    header: HeaderConfig;
    setHeader: (header: HeaderConfig) => void;
    resetHeader: () => void;
};

export const defaultHeader: HeaderConfig = {
    visible: true,
    title: 'queue',
};

export const AppChromeContext = createContext<AppChromeContextValue | null>(null);
