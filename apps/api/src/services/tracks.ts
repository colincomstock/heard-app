import type { Bindings } from "../types/bindings";
import { getAppleMusicTrackById } from "./appleMusic";

type EnsureTrackArgs = {
    supabase: any;
    env: Bindings;
    appleMusicTrackId: string;
};

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

    const appleTrack = await getAppleMusicTrackById(env, appleMusicTrackId);

    if (!appleTrack) {
        throw new Error("Apple Music track not found");
    }

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

    return insertedTrack;
}

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