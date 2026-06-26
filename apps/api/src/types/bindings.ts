export type Bindings = {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;

    APPLE_MUSIC_TEAM_ID: string;
    APPLE_MUSIC_KEY_ID: string;
    APPLE_MUSIC_PRIVATE_KEY: string;

    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
}; 

export type AuthVariables = {
    userId: string;
};