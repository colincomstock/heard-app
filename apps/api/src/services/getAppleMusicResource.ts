import type { Bindings } from "../types/bindings";
import generateAppleMusicToken from "../lib/generateAppleMusicToken";

// This function fetches a track from Apple Music by its ID and returns the track data.
export async function getAppleMusicTrackById(
    env: Bindings,
    appleMusicTrackId: string
) {
    const token = await generateAppleMusicToken(env);

    const appleMusicTrackUrl = `https://api.music.apple.com/v1/catalog/us/songs/${appleMusicTrackId}/?include=genres`;
        
        const res = await fetch(appleMusicTrackUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        if (!res.ok) {
            const detail = await res.text();
            throw new Error(
                `Apple Music API error: ${res.status}: ${detail}`
            );
        }

        const json = await res.json() as any;
        return json.data[0] ?? null;
}

// This function searches for tracks on Apple Music based on a query string and returns a list of track results.
export async function searchAppleMusicTracksByQuery(
    env: Bindings, 
    query: string
) {
    const token = await generateAppleMusicToken(env);

    const params = new URLSearchParams(
        { 
            types: "songs", 
            term: query, 
            limit: "10" 
        }
    );

    const searchUrl = `https://api.music.apple.com/v1/catalog/us/search?${params}`;

    const res = await fetch(searchUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const detail = await res.text();
        throw new Error(
            `Apple Music API error: ${res.status}: ${detail}`
        );
    }

    const json = await res.json() as any;
    return json.results.songs?.data ?? [];
}