import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthResult } from "./AuthContext";
import { supabase } from "../lib/supabaseClient";
import type { Session, AuthResponse } from "@supabase/supabase-js";

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

    const accessToken = session?.access_token ?? null;
    const userId = session?.user.id ?? null;
    const isAuthLoading = session === undefined;
    const isAuthenticated = !!session;

    return (
        <AuthContext.Provider 
            value={{ 
                session, 
                accessToken, 
                userId, 
                isAuthLoading,
                isAuthenticated,
                signUpNewUser, 
                signInUser, 
                signOutUser }}>
            {children}
        </AuthContext.Provider>
    )
};