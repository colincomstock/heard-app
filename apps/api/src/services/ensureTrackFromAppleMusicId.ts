import type { Bindings } from "../types/bindings";
import { getAppleMusicTrackById } from "./getAppleMusicResource";
import { ensureGenresFromAppleMusicTrack } from "./ensureGenresFromAppleMusicTrack";

type EnsureTrackArgs = {
    supabase: any;
    env: Bindings;
    appleMusicTrackId: string;
};

// This function ensures that a track with the given Apple Music ID exists in the database. If it doesn't exist, it fetches the track from Apple Music and inserts it into the database.
export async function ensureTrackFromAppleMusicId({
    supabase,
    env,
    appleMusicTrackId,
}: EnsureTrackArgs) {
    // Check if track exists in the database
    const { data: existingTrack, error: trackLookupError } = await supabase
    .from('track')
    .select('*')
    .eq('apple_music_track_id', appleMusicTrackId)
    .maybeSingle();

    if (trackLookupError) {
        console.error("Track lookup failed:", trackLookupError);
        throw new Error("Failed to check whether track already exists");
    }

    if (existingTrack) {
        return existingTrack;
    }

    // If the track doesn't exist, fetch it from Apple Music and insert it into the database
    const appleTrack = await getAppleMusicTrackById(env, appleMusicTrackId);
    if (!appleTrack) {
        throw new Error("Apple Music track not found");
    }

    const appleGenres = appleTrack?.relationships?.genres?.data ?? [];
    const ensuredAppleGenres = await ensureGenresFromAppleMusicTrack({
        supabase,
        env,
        appleMusicTrackGenres: appleGenres,
    });

    const trackInsert = mapAppleSongToTrackInsert(appleTrack);

    const { data: insertedTrack, error: insertError } = await supabase
        .from('track')
        .insert(trackInsert)
        .select("*")
        .single();

    if (insertError) {
        console.error("Track insert failed:", insertError);
        throw new Error("Failed to insert track");
    }

    // Associate the ensured genres with the inserted track
    for (const genre of ensuredAppleGenres) {
        const { error: trackGenreInsertError } = await supabase
            .from('track_genre')
            .insert({
                track_id: insertedTrack.id,
                genre_id: genre.id,
            });
        if (trackGenreInsertError) {
            console.error("Track-genre association failed:", trackGenreInsertError);
            throw new Error("Failed to associate track with genre");
        }
    }

    return insertedTrack;
}

// Helper function to map Apple Music track data to the database schema
function mapAppleSongToTrackInsert(song: any): any {
    const attrs = song.attributes;
    
    return {
        title: attrs.name ?? null,
        album: attrs.albumName ?? null,
        artist_name: attrs.artistName ?? null,
        artist_names: attrs.artistName ? [attrs.artistName] : [],
        cover_url: attrs.artwork?.url
            ? attrs.artwork.url.replace('{w}', '500').replace('{h}', '500')
            : null,
        isrc: attrs.isrc ?? null,
        apple_music_track_id: song.id,
        apple_music_url: attrs.url ?? null,
        song_preview_url: attrs.previews?.[0]?.url ?? null,
        duration_ms: attrs.durationInMillis ?? null,
        release_date: attrs.releaseDate ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}