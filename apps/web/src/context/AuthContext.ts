import { createContext } from "react";
import type { Session, AuthError, AuthResponse } from "@supabase/supabase-js";

export type AuthResult<TData = undefined> = 
    | { success: true; data?: TData }
    | { success: false; error?: AuthError | Error | string };

export interface AuthContextType {
    session: Session | undefined | null;
    accessToken: string | null;
    userId: string | null;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
    signUpNewUser: (email: string, password: string) => Promise<AuthResult<AuthResponse["data"]>>;
    signInUser: (email: string, password: string) => Promise<AuthResult<AuthResponse["data"]>>;
    signOutUser: () => Promise<AuthResult>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);