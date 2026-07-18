import { useContext } from 'react';
import { AppChromeContext } from './AppChromeContext';

// The useAppChrome hook provides access to the AppChromeContext, allowing components to get and set the app's header configuration.
export function useAppChrome() {
    const context = useContext(AppChromeContext);

    if (!context) {
        throw new Error('useAppChrome must be used within an AppChromeProvider');
    }

    return context;
};