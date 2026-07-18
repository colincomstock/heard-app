import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AppChromeContext, defaultHeader, type HeaderConfig } from './AppChromeContext';

export function AppChromeProvider({ children }: { children: ReactNode }) {
    const [header, setHeaderState] = useState<HeaderConfig>(defaultHeader);

    const setHeader = useCallback((nextHeader: HeaderConfig) => {
        setHeaderState({
            ...nextHeader,
            right: nextHeader.right?.slice(0, 2),
        });
    }, []);

    const resetHeader = useCallback(() => {
        setHeaderState(defaultHeader);
    }, []);

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
