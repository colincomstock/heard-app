import { Bindings } from "../types/bindings";
import getSpotifyAccessToken from "../lib/getSpotifyAccessToken";

type SpotifyTrackMatch = {
    spotifyTrackId: string;
    spotifyUrl: string;
};

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

    const data = await response.json();
    const track = data.tracks?.items?.[0];
    if (!track) {
        return null;
    }
    return TruncateSpotifyTrackResult(track);
}

function TruncateSpotifyTrackResult(track: any): SpotifyTrackMatch {
    return {
        spotifyTrackId: track.id,
        spotifyUrl: track.external_urls?.spotify ?? "",
    };
}
