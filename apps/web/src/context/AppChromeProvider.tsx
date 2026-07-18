import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AppChromeContext, defaultHeader, type HeaderConfig } from './AppChromeContext';

// The AppChromeProvider component provides the AppChromeContext to its children, allowing them to access and modify the app's header configuration.
export function AppChromeProvider({ children }: { children: ReactNode }) {
    const [header, setHeaderState] = useState<HeaderConfig>(defaultHeader);

    // Function to set the header configuration, limiting the right actions to a maximum of 2
    const setHeader = useCallback((nextHeader: HeaderConfig) => {
        setHeaderState({
            ...nextHeader,
            right: nextHeader.right?.slice(0, 2),
        });
    }, []);

    // Function to reset the header to its default state for cleanup when the component unmounts
    const resetHeader = useCallback(() => {
        setHeaderState(defaultHeader);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders of consumers
    const value = useMemo(
        () => ({
            header,
            setHeader,
            resetHeader,
        }),
        [header, setHeader, resetHeader]
    );

    return (
        <AppChromeContext.Provider value={value}>
            {children}
        </AppChromeContext.Provider>
    );
};
