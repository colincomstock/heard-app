import type { createSupabaseClientWithAuth } from '../lib/supabase';

export type Bindings = {
    PFPS: {
        get(key: string): Promise<{ body: ReadableStream<Uint8Array> } | null>;
        put(
            key: string,
            value: ArrayBuffer,
            options: { httpMetadata: { contentType: string } },
        ): Promise<unknown>;
    };
    ENABLE_AVATAR_TEST_ROUTE?: string;

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
    supabase: ReturnType<typeof createSupabaseClientWithAuth>;
};
