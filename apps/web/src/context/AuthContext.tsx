import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
    session: any;
    signUpNewUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    signInUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    signOutUser: () => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<any>(undefined);

    // Sign Up
    const signUpNewUser = async (email: string, password: string) => {
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
    const signInUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.error('Error signing in:', error);
                return { success: false, error: error.message };
            }
            console.log('Sign in successful:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error signing in:', error);
            return { success: false, error };
        }
    };

    // Sign Out
    const signOutUser = async () => {
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