import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Session, AuthError, AuthResponse } from "@supabase/supabase-js";

type AuthResult<TData = undefined> = 
    | { success: true; data?: TData }
    | { success: false; error?: AuthError | Error | string };

interface AuthContextType {
    session: Session | undefined | null;
    signUpNewUser: (email: string, password: string) => Promise<AuthResult<AuthResponse["data"]>>;
    signInUser: (email: string, password: string) => Promise<AuthResult<AuthResponse["data"]>>;
    signOutUser: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | undefined | null>(undefined);

    // Sign Up
    const signUpNewUser = async (email: string, password: string): Promise<AuthResult<AuthResponse["data"]>> => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Error signing up:', error);
            return { success: false, error };
        }

        return { success: true, data };
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Sign In
    const signInUser = async (email: string, password: string): Promise<AuthResult<AuthResponse["data"]>> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.error('Error signing in:', error);
                return { success: false, error };
            }
            return { success: true, data };
        } catch (error) {
            console.error('Error signing in:', error);
            return { success: false, error: error instanceof Error ? error : new Error("Unknown sign-in error") };
        }
    };

    // Sign Out
    const signOutUser = async (): Promise<AuthResult> => {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Error signing out:', error);
            return { success: false, error };
        }
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOutUser }}>
            {children}
        </AuthContext.Provider>
    )
};

export const UserAuth = () => {
    return useContext(AuthContext);
};