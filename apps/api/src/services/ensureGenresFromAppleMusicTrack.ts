import type { SupabaseClient } from "@supabase/supabase-js";
import type { Bindings } from "../types/bindings";
import { ensureGenreByAppleGenre } from "./ensureGenreByAppleGenre";
import type { 
    NormalizedAppleGenre,
    AppleMusicGenreRef,
} from "../types/appleMusic";

type EnsureGenresArgs = {
    supabase: SupabaseClient;
    env: Bindings;
    appleMusicTrackGenres: AppleMusicGenreRef[];
};

function normalizeAppleMusicGenre(raw: AppleMusicGenreRef): NormalizedAppleGenre {
    return {
        id: raw.id,
        name: raw.attributes.name,
        parentAppleGenreId: raw.attributes.parentId,
        parentAppleGenreName: raw.attributes.parentName,
    };
}

const MUSIC_GENRE_ID = "34"; // The Apple Music genre ID for the top-level "Music" genre

// This function ensures that the genres associated with an Apple Music track exist in the database.
// If a genre doesn't exist, it fetches the parent genre from Apple Music until it finds a genre that exists in the database or reaches the top-level genre.

export async function ensureGenresFromAppleMusicTrack({
    supabase,
    env,
    appleMusicTrackGenres,
}: EnsureGenresArgs) {
    
    const normalizedGenres = appleMusicTrackGenres
        .map(normalizeAppleMusicGenre)
        .filter((genre) => genre.id !== MUSIC_GENRE_ID); // Filter out the top-level "Music" genre

    const ensuredGenres = [];

    for (const genre of normalizedGenres) {
        const ensuredGenre = await ensureGenreByAppleGenre({
            supabase,
            env,
            appleGenre: genre,
        });
        ensuredGenres.push(ensuredGenre);
    }
    return ensuredGenres;
}
