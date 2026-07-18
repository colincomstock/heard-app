import { createContext, type ReactNode } from 'react';

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
