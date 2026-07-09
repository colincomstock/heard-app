import { Bindings } from "../types/bindings";
import getSpotifyAccessToken from "../lib/getSpotifyAccessToken";
import type {
    SpotifyTrackMatch,
    SpotifyTrackSearchItem,
    SpotifySearchResponse,
} from "../types/spotify";

export async function getSpotifyTrackByISRC(
    env: Bindings,
    isrc: string
): Promise<SpotifyTrackMatch | null> {
    const token = await getSpotifyAccessToken(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);

    const params = new URLSearchParams({
        q: `isrc:${isrc}`,
        type: "track",
        market: "US",
        limit: "1",
    });

    const spotifySearchUrl = `https://api.spotify.com/v1/search?${params}`;

    const response = await fetch(spotifySearchUrl, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to get Spotify track by ISRC");
    }

    const data = await response.json() as SpotifySearchResponse;
    const track = data.tracks?.items?.[0];
    if (!track) {
        return null;
    }
    return truncateSpotifyTrackResult(track);
}

function truncateSpotifyTrackResult(track: SpotifyTrackSearchItem): SpotifyTrackMatch {
    return {
        spotifyTrackId: track.id,
        spotifyUrl: track.external_urls?.spotify ?? "",
    };
}
