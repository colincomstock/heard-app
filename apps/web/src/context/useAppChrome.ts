import { useContext } from 'react';
import { AppChromeContext } from './AppChromeContext';

export function useAppChrome() {
    const context = useContext(AppChromeContext);

    if (!context) {
        throw new Error('useAppChrome must be used within an AppChromeProvider');
    }

    return context;
};