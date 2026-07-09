import type { Bindings } from "../types/bindings";
import { searchAppleMusicTracksByQuery } from "./getAppleMusicResource";
import type { TrackSearchResult } from "@heard/types";
import type { AppleMusicSong } from "../types/appleMusic";

type SearchTrackToPostArgs = {
    env: Bindings;
    query: string;
};

// This function searches for tracks on Apple Music based on a query string and returns a truncated list of track results suitable for posting.
export async function searchTracksToPost({
    env,
    query,
}: SearchTrackToPostArgs): Promise<TrackSearchResult[]> {
    const tracks = await searchAppleMusicTracksByQuery(env, query);

    if (!tracks || tracks.length === 0) {
        return [];
    }

    return truncateTrackResults(tracks);
}

// Helper function to truncate the track results to only include necessary information for posting
function truncateTrackResults(tracks: AppleMusicSong[]): TrackSearchResult[] {
    return tracks.map((track) => ({
        id: track.id,
        name: track.attributes.name,
        artistName: track.attributes.artistName,
        coverUrl: track.attributes.artwork.url.replace("{w}x{h}", "200x200"),
        genres: track.attributes.genreNames ?? [],
        previewUrl: track.attributes.previews?.[0]?.url || null,
        appleMusicUrl: track.attributes.url,
    }));
}
